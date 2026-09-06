import { spawn } from 'node:child_process';
import process from 'node:process';
import { chromium } from 'playwright';

const port = Number(process.env.SMOKE_PORT ?? 4174);
const baseUrl = process.env.SMOKE_BASE_URL ?? `http://127.0.0.1:${port}/`;
const chromiumPath = process.env.CHROMIUM_PATH ?? '/repl/tools/bin/chromium';
let devServer;

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function waitForServer(url) {
  const deadline = Date.now() + 30_000;
  let lastError;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  throw new Error(`Timed out waiting for ${url}: ${lastError?.message ?? 'server did not respond'}`);
}

function startDevServer() {
  if (process.env.SMOKE_BASE_URL) return;

  devServer = spawn('pnpm', ['run', 'dev'], {
    cwd: new URL('.', import.meta.url),
    detached: true,
    env: { ...process.env, BASE_PATH: '/', PORT: String(port) },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  devServer.stderr.on('data', (chunk) => process.stderr.write(`[portfolio] ${chunk}`));
}

function stopDevServer() {
  if (!devServer?.pid) return;
  try {
    process.kill(-devServer.pid, 'SIGTERM');
  } catch {
    // The server may already have exited after a failed startup.
  }
}

async function openPortfolio(browser, viewport) {
  const consoleErrors = [];
  const pageErrors = [];
  const page = await browser.newPage({ viewport });

  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => pageErrors.push(error.message));

  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  await page.getByTestId('link-work').waitFor({ state: 'attached' });
  const layout = await page.evaluate(() => ({
    width: window.innerWidth,
    navDisplay: getComputedStyle(document.querySelector('.ce-nav')).display,
  }));
  assert(
    viewport.width <= 900 ? layout.navDisplay === 'none' : layout.navDisplay === 'flex',
    `unexpected navigation layout at ${layout.width}px: ${layout.navDisplay}`,
  );
  if (viewport.width > 900) await page.getByTestId('link-work').waitFor({ state: 'visible' });
  assert((await page.locator('main.ce-site').count()) === 1, 'portfolio shell did not render');

  return { page, consoleErrors, pageErrors };
}

async function assertAnchorLinks(page) {
  for (const [testId, targetId] of [
    ['link-work', 'work'],
    ['link-experiments', 'experiments'],
    ['link-notes', 'notes'],
    ['link-about', 'about'],
  ]) {
    await page.getByTestId(testId).click();
    assert(
      await page.evaluate(() => window.location.hash),
      `${testId} did not update the URL hash`,
    );
    assert(
      (await page.evaluate(() => window.location.hash)) === `#${targetId}`,
      `${testId} pointed to the wrong section`,
    );
    assert((await page.locator(`#${targetId}`).count()) === 1, `#${targetId} section is missing`);
  }
}

async function assertTectonicInteractions(page) {
  const status = page.getByTestId('status-active-plate');
  const coordinates = page.getByTestId('text-active-coordinates');
  const mapCanvas = page.getByTestId('visual-tectonic-map').locator('.ce-map-canvas');
  const mapSvg = mapCanvas.locator('svg.ce-plates');
  const crosshair = mapSvg.locator('.ce-map-crosshair');

  assert((await status.textContent()).includes('Pacific'), 'Pacific should be selected initially');
  assert((await coordinates.textContent()).trim() === '39° N / 144° W', 'initial plate coordinates are wrong');

  await page.getByTestId('button-plate-north-america').click();
  assert((await status.textContent()).includes('North American'), 'pointer selection did not update the plate readout');
  assert((await coordinates.textContent()).trim() === '44° N / 101° W', 'plate selection did not update coordinates');

  await page.getByTestId('button-plate-south-america').press('Enter');
  assert((await status.textContent()).includes('South American'), 'Enter did not activate a plate');
  await page.getByTestId('button-plate-eurasia').press('Space');
  assert((await status.textContent()).includes('Eurasian'), 'Space did not activate a plate');

  const initialTransform = await mapSvg.getAttribute('style');
  const initialCrosshairX = await crosshair.getAttribute('cx');
  const box = await mapCanvas.boundingBox();
  assert(box, 'map canvas has no layout box');
  await page.mouse.move(box.x + box.width * 0.18, box.y + box.height * 0.76);
  await page.waitForTimeout(250);
  assert((await mapSvg.getAttribute('style')) !== initialTransform, 'pointer movement did not update the map transform');
  assert((await crosshair.getAttribute('cx')) !== initialCrosshairX, 'pointer movement did not update the crosshair readout');

  const zoom = page.getByTestId('text-map-zoom');
  assert((await zoom.textContent()).trim() === '100%', 'map zoom should start at 100%');
  await page.getByTestId('button-zoom-in').click();
  await page.getByTestId('button-zoom-in').click();
  assert((await zoom.textContent()).trim() === '120%', 'zoom in did not update the zoom readout');
  await page.getByTestId('button-zoom-out').click();
  assert((await zoom.textContent()).trim() === '110%', 'zoom out did not update the zoom readout');
}

async function assertNotesAndPrinciples(page) {
  const notes = page.locator('[data-testid^="card-note-"]');
  const notesToggle = page.getByTestId('button-toggle-notes');
  assert((await notes.count()) === 3, 'notes should start collapsed to three cards');
  assert((await notesToggle.getAttribute('aria-expanded')) === 'false', 'collapsed notes need aria-expanded=false');

  await notesToggle.click();
  assert((await notes.count()) === 4, 'show all notes did not reveal the fourth note');
  assert((await notesToggle.getAttribute('aria-expanded')) === 'true', 'expanded notes need aria-expanded=true');
  assert((await notesToggle.getAttribute('aria-controls')) === 'notes-list', 'notes toggle does not control the notes list');

  await notesToggle.click();
  assert((await notes.count()) === 3, 'show fewer notes did not collapse the fourth note');
  assert((await notesToggle.getAttribute('aria-expanded')) === 'false', 'collapsed notes state was not restored');

  const systems = page.getByTestId('button-principle-systems');
  const product = page.getByTestId('button-principle-product');
  assert((await systems.getAttribute('aria-expanded')) === 'true', 'systems principle should be expanded initially');
  assert((await product.getAttribute('aria-expanded')) === 'false', 'product principle should be collapsed initially');

  await product.click();
  assert((await systems.getAttribute('aria-expanded')) === 'false', 'opening product should close systems');
  assert((await product.getAttribute('aria-expanded')) === 'true', 'opening product did not update aria-expanded');
  await product.click();
  assert((await product.getAttribute('aria-expanded')) === 'false', 'clicking an open principle should collapse it');
}

async function assertNoBrowserErrors(errors, label) {
  assert(errors.consoleErrors.length === 0, `${label} browser console errors: ${errors.consoleErrors.join('; ')}`);
  assert(errors.pageErrors.length === 0, `${label} page errors: ${errors.pageErrors.join('; ')}`);
}

async function run() {
  startDevServer();
  await waitForServer(baseUrl);
  const browser = await chromium.launch({ executablePath: chromiumPath, headless: true, args: ['--no-sandbox'] });

  try {
    const desktop = await openPortfolio(browser, { width: 1440, height: 1000 });
    await assertAnchorLinks(desktop.page);
    await assertTectonicInteractions(desktop.page);
    await assertNotesAndPrinciples(desktop.page);
    await assertNoBrowserErrors(desktop, 'desktop');
    await desktop.page.close();

    const mobile = await openPortfolio(browser, { width: 390, height: 844 });
    const menu = mobile.page.getByTestId('button-toggle-navigation');
    assert((await menu.getAttribute('aria-expanded')) === 'false', 'mobile Index menu should start closed');
    await menu.click();
    assert((await menu.getAttribute('aria-expanded')) === 'true', 'mobile Index menu did not open');
    await mobile.page.getByTestId('link-notes').click();
    assert((await mobile.page.evaluate(() => window.location.hash)) === '#notes', 'mobile Index link did not reach Notes');
    assert((await menu.getAttribute('aria-expanded')) === 'false', 'mobile Index menu did not close after navigation');
    await assertTectonicInteractions(mobile.page);
    await assertNotesAndPrinciples(mobile.page);
    await assertNoBrowserErrors(mobile, 'mobile');
    await mobile.page.close();

    console.log('Portfolio smoke checks passed: desktop and mobile');
  } finally {
    await browser.close();
    stopDevServer();
  }
}

run().catch((error) => {
  console.error(error);
  stopDevServer();
  process.exitCode = 1;
});