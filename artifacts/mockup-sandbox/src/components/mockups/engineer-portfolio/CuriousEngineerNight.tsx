import { useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent } from "react";

type Plate = {
  id: string;
  name: string;
  movement: string;
  position: string;
  points: string;
  fill: string;
  labelX: number;
  labelY: number;
};

const plates: Plate[] = [
  { id: "pacific", name: "Pacific", movement: "north-west", position: "39° N / 144° W", points: "18,88 45,64 82,70 108,94 95,124 62,136 28,122", fill: "#4b6573", labelX: 52, labelY: 102 },
  { id: "north-america", name: "North American", movement: "west", position: "44° N / 101° W", points: "108,24 164,21 190,45 182,77 153,87 128,71 105,72 94,47", fill: "#856b61", labelX: 132, labelY: 51 },
  { id: "south-america", name: "South American", movement: "west", position: "18° S / 62° W", points: "188,91 216,99 224,130 204,160 190,143 178,118", fill: "#79535d", labelX: 199, labelY: 120 },
  { id: "eurasia", name: "Eurasian", movement: "east", position: "51° N / 72° E", points: "190,45 242,25 292,41 316,61 301,82 256,79 227,93 203,74", fill: "#6b6877", labelX: 246, labelY: 56 },
  { id: "africa", name: "African", movement: "north-east", position: "1° N / 18° E", points: "224,91 252,83 275,101 265,145 241,158 217,130", fill: "#65745f", labelX: 239, labelY: 119 },
  { id: "antarctic", name: "Antarctic", movement: "east", position: "77° S / 0° E", points: "120,165 176,157 225,169 263,162 302,176 279,197 210,202 152,193", fill: "#777b73", labelX: 188, labelY: 182 },
];

const experiments = [
  { number: "01", title: "Interactive visualization", tag: "DATA / FORM", copy: "A small atlas for seeing systems move." },
  { number: "02", title: "Small Python tool", tag: "UTILITY / PLAY", copy: "A useful little lever for a stubborn task." },
  { number: "03", title: "Simulation", tag: "MODEL / QUESTION", copy: "What changes when one assumption moves?" },
  { number: "04", title: "Tiny product idea", tag: "PRODUCT / MAYBE", copy: "An interface for decisions made slowly." },
  { number: "05", title: "API experiment", tag: "SYSTEM / EDGE", copy: "Following a signal through the edges." },
  { number: "06", title: "Visual experiment", tag: "IMAGE / MOTION", copy: "Motion as a way to explain a feeling." },
];

const notes = [
  { date: "12.06.24", category: "CULTURE", title: "Why did Nescafé have to teach Japan to drink coffee?", copy: "A product can be an invitation, a ritual, and a piece of infrastructure at the same time." },
  { date: "04.05.24", category: "INTERFACES", title: "Why do some interfaces feel physical?", copy: "The useful metaphor is not always the obvious one. Sometimes a little resistance is information." },
  { date: "21.03.24", category: "BEHAVIOUR", title: "What happens when a technical system meets human behaviour?", copy: "The gap between the model and the person is usually where the interesting work begins." },
  { date: "08.02.24", category: "MATERIALS", title: "How did salt become more than food?", copy: "A tiny object can carry a surprisingly large history of trade, power, and taste." },
];

const principles = [
  { key: "systems", number: "01", title: "Systems", statement: "Understanding how components interact.", detail: "I look for the relationships first: what depends on what, where information bends, and which small change will travel furthest." },
  { key: "product", number: "02", title: "Product", statement: "Understanding why something should exist.", detail: "A clear interface cannot rescue an unclear reason. I start with the question a product is helping someone answer." },
  { key: "engineering", number: "03", title: "Engineering", statement: "Turning constraints into reliable systems.", detail: "Constraints are not an interruption to the work. They are the shape the work has to become." },
  { key: "curiosity", number: "04", title: "Curiosity", statement: "Following questions even when they are not immediately useful.", detail: "The side path is often where a better mental model is waiting. I keep a notebook for the questions that do not fit yet." },
];

function TectonicNightMap() {
  const [activeId, setActiveId] = useState("pacific");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pointer, setPointer] = useState({ x: 50, y: 50 });
  const activePlate = plates.find((plate) => plate.id === activeId) ?? plates[0];

  function updatePointer(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    setPointer({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    });
  }

  return (
    <div className="cen-map-shell">
      <div className="cen-map-toolbar">
        <span className="cen-map-kicker"><i className="cen-live-dot" /> LIVE MODEL / 01</span>
        <span className="cen-map-coordinates">{activePlate.position}</span>
        <div className="cen-map-zoom" aria-label="Map controls">
          <button type="button" aria-label="Zoom out" onClick={() => setZoom((value) => Math.max(.85, value - .1))}>−</button>
          <span>{Math.round(zoom * 100)}%</span>
          <button type="button" aria-label="Zoom in" onClick={() => setZoom((value) => Math.min(1.3, value + .1))}>+</button>
        </div>
      </div>
      <div
        className="cen-map-canvas"
        onPointerMove={updatePointer}
        onPointerLeave={() => setHoveredId(null)}
        style={{ "--pointer-x": `${pointer.x}%`, "--pointer-y": `${pointer.y}%` } as CSSProperties}
      >
        <div className="cen-map-stars" />
        <div className="cen-map-graticule" />
        <div className="cen-map-orbit cen-map-orbit-one" />
        <div className="cen-map-orbit cen-map-orbit-two" />
        <svg
          className="cen-plates"
          viewBox="0 0 340 220"
          role="img"
          aria-label="Abstract interactive tectonic plate map"
          style={{ transform: `scale(${zoom}) rotateX(${(pointer.y - 50) * -.025}deg) rotateY(${(pointer.x - 50) * .025}deg)` }}
        >
          <defs>
            <filter id="cen-night-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#040a12" floodOpacity=".55" />
            </filter>
          </defs>
          <path className="cen-boundary cen-boundary-a" d="M92 44 C115 70 106 90 122 108 C140 126 155 142 174 168" />
          <path className="cen-boundary cen-boundary-b" d="M185 33 C177 56 187 68 181 91 C176 112 183 131 194 159" />
          <path className="cen-boundary cen-boundary-c" d="M218 87 C245 92 261 87 282 74 C298 64 310 68 326 76" />
          {plates.map((plate) => {
            const selected = activeId === plate.id;
            return (
              <g
                key={plate.id}
                className={`cen-plate-group ${selected ? "is-active" : ""} ${hoveredId === plate.id ? "is-hovered" : ""}`}
                onClick={() => setActiveId(plate.id)}
                onMouseEnter={() => setHoveredId(plate.id)}
                onMouseLeave={() => setHoveredId(null)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") setActiveId(plate.id);
                }}
                role="button"
                tabIndex={0}
                aria-label={`Select ${plate.name} plate`}
              >
                <polygon points={plate.points} fill={plate.fill} filter="url(#cen-night-shadow)" />
                <text x={plate.labelX} y={plate.labelY} className="cen-plate-label">{plate.name.split(" ")[0].toUpperCase()}</text>
              </g>
            );
          })}
          <circle className="cen-map-crosshair" cx={(pointer.x / 100) * 340} cy={(pointer.y / 100) * 220} r="5" />
          <line className="cen-map-crosshair-line" x1={(pointer.x / 100) * 340 - 13} x2={(pointer.x / 100) * 340 + 13} y1={(pointer.y / 100) * 220} y2={(pointer.y / 100) * 220} />
          <line className="cen-map-crosshair-line" x1={(pointer.x / 100) * 340} x2={(pointer.x / 100) * 340} y1={(pointer.y / 100) * 220 - 13} y2={(pointer.y / 100) * 220 + 13} />
        </svg>
        <div className="cen-map-cursor-note">MOVE THROUGH THE SYSTEM</div>
        <div className="cen-map-tooltip">
          <span>SELECTED PLATE</span>
          <strong>{activePlate.name}</strong>
          <small>moving {activePlate.movement}</small>
        </div>
      </div>
      <div className="cen-map-footer">
        <div><span className="cen-map-readout">PLATE / {activePlate.name.toUpperCase()}</span><p>Click a plate to inspect the relationship.</p></div>
        <div className="cen-map-key"><span><i className="cen-key-line" /> BOUNDARY</span><span><i className="cen-key-dot" /> ACTIVE NODE</span></div>
      </div>
    </div>
  );
}

function SystemMark() {
  const [cursor, setCursor] = useState({ x: 50, y: 50 });
  const points = useMemo(() => [{ x: 50, y: 50, r: 3 }, { x: 27, y: 30, r: 2 }, { x: 76, y: 25, r: 2 }, { x: 84, y: 70, r: 2 }, { x: 19, y: 73, r: 2 }, { x: 55, y: 12, r: 1.5 }], []);
  return (
    <div
      className="cen-system-mark"
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setCursor({ x: ((event.clientX - rect.left) / rect.width) * 100, y: ((event.clientY - rect.top) / rect.height) * 100 });
      }}
      style={{ "--mark-x": `${cursor.x}%`, "--mark-y": `${cursor.y}%` } as CSSProperties}
      aria-hidden="true"
    >
      <svg viewBox="0 0 100 100">
        <path d="M50 50 L27 30 M50 50 L76 25 M50 50 L84 70 M50 50 L19 73 M50 50 L55 12" />
        <path d="M27 30 L76 25 M76 25 L84 70 M84 70 L19 73 M19 73 L27 30" className="cen-mark-faint" />
        {points.map((point) => <circle key={`${point.x}-${point.y}`} cx={point.x} cy={point.y} r={point.r} />)}
        <circle cx={cursor.x} cy={cursor.y} r="12" className="cen-mark-cursor" />
      </svg>
      <span>systems are connected</span>
    </div>
  );
}

export function CuriousEngineerNight() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePrinciple, setActivePrinciple] = useState("systems");
  const [showMoreNotes, setShowMoreNotes] = useState(false);
  const [selectedExperiment, setSelectedExperiment] = useState<typeof experiments[number] | null>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setSelectedExperiment(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const visibleNotes = showMoreNotes ? notes : notes.slice(0, 3);

  return (
    <main className="cen-root">
      <style>{`
        .cen-root { --cen-bg: #0b1118; --cen-bg-deep: #080d13; --cen-panel: #111b24; --cen-ink: #e5e0d4; --cen-soft: #9ba5a6; --cen-dim: #66747b; --cen-line: rgba(213,224,218,.2); --cen-cyan: #8fb7ae; --cen-coral: #d88169; --cen-lilac: #aaa5c3; background: var(--cen-bg); color: var(--cen-ink); min-height: 100dvh; overflow: hidden; font-family: "Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif; }
        .cen-root *, .cen-root *::before, .cen-root *::after { box-sizing: border-box; }
        .cen-root { scroll-behavior: smooth; }
        .cen-root a { color: inherit; text-decoration: none; }
        .cen-root button { color: inherit; }
        .cen-mono, .cen-root button, .cen-label, .cen-nav, .cen-map-shell, .cen-system-mark span, .cen-work-meta, .cen-experiment-tag, .cen-note-meta, .cen-currently-label, .cen-footer-meta { font-family: "SFMono-Regular", "Cascadia Code", "Roboto Mono", ui-monospace, monospace; }
        .cen-container { width: min(1240px, calc(100% - 64px)); margin: 0 auto; }
        .cen-topbar { height: 92px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--cen-line); position: relative; z-index: 20; }
        .cen-logo { font: 600 12px "SFMono-Regular", ui-monospace, monospace; letter-spacing: .14em; }
        .cen-logo span, .cen-root em, .cen-label, .cen-eyebrow { color: var(--cen-coral); }
        .cen-nav { display: flex; align-items: center; gap: 30px; font-size: 10px; letter-spacing: .15em; text-transform: uppercase; }
        .cen-nav a { position: relative; padding: 12px 0; }
        .cen-nav a::after { content: ""; position: absolute; left: 0; right: 100%; bottom: 5px; height: 1px; background: var(--cen-coral); transition: right .3s ease; }
        .cen-nav a:hover::after, .cen-nav a:focus-visible::after { right: 0; }
        .cen-nav-toggle { display: none; border: 0; background: transparent; font: 11px "SFMono-Regular", monospace; letter-spacing: .14em; text-transform: uppercase; cursor: pointer; }
        .cen-hero { min-height: 760px; display: grid; grid-template-columns: 1fr 290px; align-items: end; padding: 120px 0 104px; position: relative; }
        .cen-hero-copy { max-width: 840px; position: relative; z-index: 2; }
        .cen-eyebrow, .cen-label { display: block; font: 10px/1.4 "SFMono-Regular", monospace; letter-spacing: .19em; text-transform: uppercase; }
        .cen-eyebrow { margin-bottom: 30px; color: var(--cen-cyan); }
        .cen-hero h1 { margin: 0; max-width: 920px; font-size: clamp(58px, 9vw, 137px); line-height: .91; letter-spacing: -.065em; font-weight: 400; }
        .cen-hero h1 em { font-style: italic; }
        .cen-hero-support { max-width: 360px; margin: 56px 0 0 8px; font-size: 20px; line-height: 1.35; color: var(--cen-soft); }
        .cen-hero-index { align-self: start; padding-top: 10px; font: 10px/1.7 "SFMono-Regular", monospace; letter-spacing: .12em; text-transform: uppercase; color: var(--cen-soft); }
        .cen-hero-index strong { display: block; color: var(--cen-ink); font-size: 13px; margin-bottom: 12px; font-weight: 500; }
        .cen-hero-index span { display: block; }
        .cen-hero-index span::before { content: "— "; color: var(--cen-coral); }
        .cen-system-mark { position: absolute; right: 7%; top: 122px; width: 250px; height: 250px; opacity: .62; transition: opacity .3s ease; }
        .cen-system-mark:hover { opacity: 1; }
        .cen-system-mark svg { width: 100%; height: 100%; overflow: visible; }
        .cen-system-mark path { fill: none; stroke: var(--cen-cyan); stroke-width: .42; vector-effect: non-scaling-stroke; }
        .cen-system-mark .cen-mark-faint { opacity: .24; stroke-dasharray: 1 3; }
        .cen-system-mark circle { fill: var(--cen-coral); }
        .cen-system-mark .cen-mark-cursor { cx: var(--mark-x); cy: var(--mark-y); fill: none; stroke: var(--cen-coral); stroke-width: .65; opacity: .8; transition: cx .18s ease-out, cy .18s ease-out; }
        .cen-system-mark span { position: absolute; bottom: 13px; right: 0; color: var(--cen-dim); font-size: 8px; letter-spacing: .12em; text-transform: uppercase; white-space: nowrap; }
        .cen-rule { border: 0; border-top: 1px solid var(--cen-line); margin: 0; }
        .cen-section { padding: 142px 0; }
        .cen-section-heading { display: grid; grid-template-columns: 1.1fr 1fr; gap: 40px; align-items: end; margin-bottom: 64px; }
        .cen-section-heading h2 { margin: 0; font-size: clamp(47px, 6.6vw, 92px); line-height: .91; letter-spacing: -.065em; font-weight: 400; }
        .cen-section-heading p { max-width: 355px; margin: 0 0 5px; color: var(--cen-soft); font-size: 18px; line-height: 1.4; }
        .cen-section-heading p::before { content: "↳"; color: var(--cen-coral); font-family: ui-monospace, monospace; display: block; margin-bottom: 12px; }
        .cen-feature { border-top: 1px solid var(--cen-ink); padding-top: 27px; }
        .cen-feature-intro { display: grid; grid-template-columns: 1fr 1.25fr; gap: 70px; margin-bottom: 48px; }
        .cen-feature h3 { margin: 10px 0 16px; font-size: clamp(38px, 5vw, 72px); line-height: .96; font-weight: 400; letter-spacing: -.055em; }
        .cen-feature-deck { margin: 0; max-width: 420px; font-size: 21px; line-height: 1.35; color: var(--cen-soft); }
        .cen-work-meta { display: flex; flex-wrap: wrap; gap: 9px 28px; margin-top: 31px; color: var(--cen-soft); font-size: 10px; letter-spacing: .11em; text-transform: uppercase; }
        .cen-work-meta b { color: var(--cen-ink); font-weight: 400; }
        .cen-map-shell { background: var(--cen-panel); border: 1px solid rgba(185,213,204,.35); position: relative; overflow: hidden; }
        .cen-map-toolbar, .cen-map-footer { min-height: 48px; padding: 0 18px; display: flex; align-items: center; justify-content: space-between; gap: 18px; color: var(--cen-soft); font-size: 9px; letter-spacing: .12em; text-transform: uppercase; }
        .cen-map-toolbar { border-bottom: 1px solid rgba(185,213,204,.2); background: rgba(8,13,19,.38); }
        .cen-map-kicker { color: var(--cen-ink); }
        .cen-live-dot { display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: var(--cen-coral); margin-right: 8px; animation: cen-pulse 2.2s infinite ease-in-out; }
        .cen-map-coordinates { margin-left: auto; color: var(--cen-cyan); }
        .cen-map-zoom { display: flex; border-left: 1px solid rgba(185,213,204,.2); padding-left: 14px; align-items: center; gap: 12px; }
        .cen-map-zoom button { border: 0; padding: 1px 4px; font-size: 15px; background: transparent; cursor: pointer; }
        .cen-map-canvas { height: 515px; position: relative; overflow: hidden; perspective: 700px; background: radial-gradient(circle at var(--pointer-x) var(--pointer-y), rgba(139,183,174,.15), transparent 25%), #0e1a23; }
        .cen-map-stars { position: absolute; inset: 0; opacity: .7; background-image: radial-gradient(circle, rgba(224,230,216,.6) 0 1px, transparent 1.5px), radial-gradient(circle, rgba(216,129,105,.45) 0 1px, transparent 1.5px); background-size: 79px 91px, 131px 113px; background-position: 14px 22px, 42px 62px; }
        .cen-map-graticule { position: absolute; inset: -40% -20%; opacity: .34; background-image: linear-gradient(rgba(143,183,174,.2) 1px, transparent 1px), linear-gradient(90deg, rgba(143,183,174,.2) 1px, transparent 1px); background-size: 70px 70px; transform: rotate(-12deg); }
        .cen-map-orbit { position: absolute; left: 50%; top: 50%; border: 1px solid rgba(143,183,174,.25); border-radius: 50%; transform: translate(-50%, -50%) rotate(-20deg); }
        .cen-map-orbit-one { width: 71%; height: 82%; }
        .cen-map-orbit-two { width: 88%; height: 56%; transform: translate(-50%, -50%) rotate(30deg); border-style: dashed; }
        .cen-plates { position: absolute; width: min(85%, 780px); height: auto; left: 50%; top: 50%; transform-origin: center; translate: -50% -50%; overflow: visible; transition: transform .2s ease-out; }
        .cen-plate-group { cursor: pointer; outline: none; }
        .cen-plate-group polygon { stroke: rgba(215,227,218,.46); stroke-width: 1.2; transition: transform .35s ease, fill .35s ease, opacity .35s ease; transform-box: fill-box; transform-origin: center; }
        .cen-plate-group:hover polygon, .cen-plate-group.is-hovered polygon, .cen-plate-group.is-active polygon { transform: translateY(-3px) scale(1.025); fill: #b77c69; }
        .cen-plate-group:not(.is-active):not(:hover) { opacity: .75; }
        .cen-plate-label { fill: rgba(235,231,216,.72); font: 6px "SFMono-Regular", monospace; letter-spacing: .08em; pointer-events: none; }
        .cen-boundary { fill: none; stroke: var(--cen-coral); stroke-width: 1.5; stroke-dasharray: 1 4; stroke-linecap: round; opacity: .9; }
        .cen-map-crosshair { fill: none; stroke: var(--cen-cyan); stroke-width: 1; opacity: .9; pointer-events: none; }
        .cen-map-crosshair-line { stroke: var(--cen-cyan); stroke-width: .5; opacity: .55; pointer-events: none; }
        .cen-map-cursor-note { position: absolute; left: 18px; bottom: 17px; color: var(--cen-dim); font-size: 8px; letter-spacing: .12em; }
        .cen-map-tooltip { position: absolute; right: 18px; bottom: 17px; display: flex; flex-direction: column; gap: 4px; background: rgba(11,17,24,.88); border-left: 2px solid var(--cen-coral); padding: 11px 14px; min-width: 140px; }
        .cen-map-tooltip span, .cen-map-tooltip small { font-size: 8px; letter-spacing: .11em; color: var(--cen-soft); }
        .cen-map-tooltip strong { font: 13px Georgia, serif; font-weight: 400; }
        .cen-map-footer { border-top: 1px solid rgba(185,213,204,.2); min-height: 69px; text-transform: none; letter-spacing: 0; }
        .cen-map-footer p { margin: 4px 0 0; font-family: Georgia, serif; font-size: 13px; color: var(--cen-soft); }
        .cen-map-readout { font-size: 9px; letter-spacing: .12em; color: var(--cen-ink); }
        .cen-map-key { display: flex; gap: 16px; align-items: center; font-size: 8px; letter-spacing: .1em; }
        .cen-map-key span { display: flex; align-items: center; gap: 5px; }
        .cen-key-line { width: 14px; border-top: 1px dashed var(--cen-coral); }
        .cen-key-dot { width: 5px; height: 5px; background: var(--cen-coral); border-radius: 50%; }
        .cen-case-study { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; border-top: 1px solid var(--cen-line); margin-top: 48px; }
        .cen-case-step { padding: 20px 20px 4px 0; border-right: 1px solid var(--cen-line); margin-right: 20px; min-height: 152px; }
        .cen-case-step:last-child { border: 0; }
        .cen-case-step span { font: 10px "SFMono-Regular", monospace; color: var(--cen-coral); }
        .cen-case-step h4 { margin: 13px 0 9px; font-size: 21px; font-weight: 400; }
        .cen-case-step p { margin: 0; color: var(--cen-soft); font-size: 14px; line-height: 1.4; }
        .cen-cta-link { display: inline-flex; align-items: center; gap: 12px; border-bottom: 1px solid var(--cen-ink); padding-bottom: 6px; margin-top: 38px; font: 10px "SFMono-Regular", monospace; letter-spacing: .12em; text-transform: uppercase; transition: color .2s ease, border-color .2s ease, gap .2s ease; }
        .cen-cta-link:hover { color: var(--cen-coral); border-color: var(--cen-coral); gap: 17px; }
        .cen-placeholder-list, .cen-notes-grid, .cen-principle-list { border-top: 1px solid var(--cen-ink); }
        .cen-placeholder-item { display: grid; grid-template-columns: 60px 1fr 1.2fr 140px; gap: 25px; padding: 26px 0; border-bottom: 1px solid var(--cen-line); align-items: start; transition: padding .25s ease, background .25s ease; }
        .cen-placeholder-item:hover, .cen-note:hover { padding-left: 14px; padding-right: 14px; background: rgba(216,129,105,.06); }
        .cen-placeholder-index { color: var(--cen-coral); font: 11px "SFMono-Regular", monospace; }
        .cen-placeholder-item h3 { margin: 0 0 6px; font-size: 25px; font-weight: 400; }
        .cen-placeholder-company { color: var(--cen-soft); font: 10px "SFMono-Regular", monospace; letter-spacing: .13em; text-transform: uppercase; }
        .cen-placeholder-note { margin: 0; color: var(--cen-soft); font-size: 15px; line-height: 1.4; max-width: 430px; }
        .cen-placeholder-label { justify-self: end; font: 9px "SFMono-Regular", monospace; letter-spacing: .11em; color: var(--cen-coral); }
        .cen-section-alt { background: var(--cen-bg-deep); margin: 0 calc((100vw - 100%) / -2); padding-left: max(32px, calc((100vw - 1240px) / 2)); padding-right: max(32px, calc((100vw - 1240px) / 2)); }
        .cen-experiment-grid { display: grid; grid-template-columns: repeat(3, 1fr); border-top: 1px solid var(--cen-line); border-left: 1px solid var(--cen-line); }
        .cen-experiment { min-height: 190px; border: 0; border-right: 1px solid var(--cen-line); border-bottom: 1px solid var(--cen-line); padding: 20px; display: flex; flex-direction: column; align-items: stretch; text-align: left; justify-content: space-between; position: relative; overflow: hidden; background: transparent; cursor: pointer; transition: background .25s ease, color .25s ease; }
        .cen-experiment::after { content: "↗"; position: absolute; right: 20px; top: 18px; color: var(--cen-coral); font-size: 20px; transform: translate(-4px, 4px); opacity: 0; transition: opacity .25s ease, transform .25s ease; }
        .cen-experiment:hover, .cen-experiment:focus-visible { background: var(--cen-ink); color: var(--cen-bg); }
        .cen-experiment:hover::after, .cen-experiment:focus-visible::after { opacity: 1; transform: none; }
        .cen-experiment-number { color: var(--cen-coral); font: 11px "SFMono-Regular", monospace; }
        .cen-experiment h3 { max-width: 210px; margin: auto 0 20px; font-size: 25px; line-height: 1.02; font-weight: 400; }
        .cen-experiment-tag { font-size: 9px; letter-spacing: .14em; color: var(--cen-soft); }
        .cen-experiment:hover .cen-experiment-tag, .cen-experiment:focus-visible .cen-experiment-tag { color: #53676b; }
        .cen-experiment-panel { position: fixed; z-index: 40; left: 50%; top: 50%; width: min(480px, calc(100% - 34px)); transform: translate(-50%, -50%); padding: 27px; background: var(--cen-ink); color: var(--cen-bg); box-shadow: 0 24px 90px rgba(0,0,0,.55); }
        .cen-experiment-panel::backdrop { background: rgba(3,7,11,.75); }
        .cen-experiment-panel .cen-label { color: #9f5d4e; }
        .cen-experiment-panel h3 { margin: 23px 0 11px; font-size: 38px; line-height: .96; font-weight: 400; }
        .cen-experiment-panel p { margin: 0; color: #46585d; font-size: 17px; line-height: 1.4; }
        .cen-panel-close { margin-top: 28px; border: 1px solid #46585d; background: transparent; padding: 10px 13px; color: var(--cen-bg); font: 10px "SFMono-Regular", monospace; letter-spacing: .1em; text-transform: uppercase; cursor: pointer; }
        .cen-note { display: grid; grid-template-columns: 100px 170px 1fr 32px; gap: 25px; border-bottom: 1px solid var(--cen-line); padding: 27px 0; align-items: start; transition: padding .25s ease, background .25s ease; }
        .cen-note-meta { font-size: 9px; letter-spacing: .1em; color: var(--cen-soft); }
        .cen-note-meta span { display: block; margin-bottom: 8px; color: var(--cen-coral); }
        .cen-note h3 { margin: 0; font-size: 23px; line-height: 1.15; font-weight: 400; }
        .cen-note-copy { margin: 0; max-width: 340px; color: var(--cen-soft); font-size: 15px; line-height: 1.4; }
        .cen-note-arrow { color: var(--cen-coral); font: 21px Georgia, serif; text-align: right; }
        .cen-text-button { background: transparent; border: 0; color: var(--cen-coral); padding: 0; margin-top: 26px; font: 10px "SFMono-Regular", monospace; letter-spacing: .14em; text-transform: uppercase; cursor: pointer; }
        .cen-principles-layout, .cen-about { display: grid; grid-template-columns: 1fr 1.1fr; gap: 100px; align-items: start; }
        .cen-principles-intro h2, .cen-about h2 { margin: 0; font-size: clamp(46px, 6vw, 82px); line-height: .93; letter-spacing: -.065em; font-weight: 400; }
        .cen-principles-intro p { color: var(--cen-soft); max-width: 250px; font-size: 17px; line-height: 1.45; margin-top: 42px; }
        .cen-principle { border-bottom: 1px solid var(--cen-line); padding: 19px 0 21px; cursor: pointer; }
        .cen-principle-header { display: grid; grid-template-columns: 45px 1fr 25px; gap: 15px; align-items: baseline; }
        .cen-principle-number { font: 10px "SFMono-Regular", monospace; color: var(--cen-coral); }
        .cen-principle h3 { margin: 0; font-size: 31px; font-weight: 400; }
        .cen-principle-plus { color: var(--cen-coral); font: 22px "SFMono-Regular", monospace; transition: transform .25s ease; }
        .cen-principle.is-active .cen-principle-plus { transform: rotate(45deg); }
        .cen-principle-statement { margin: 5px 0 0 60px; font-size: 16px; color: var(--cen-soft); }
        .cen-principle-detail { max-height: 0; overflow: hidden; margin: 0 0 0 60px; color: var(--cen-soft); font-size: 15px; line-height: 1.4; transition: max-height .3s ease, padding-top .3s ease; }
        .cen-principle.is-active .cen-principle-detail { max-height: 100px; padding-top: 16px; }
        .cen-about-copy { max-width: 480px; padding-top: 5px; }
        .cen-about-copy p { margin: 0 0 21px; font-size: 20px; line-height: 1.42; }
        .cen-about-copy p:not(:first-child) { color: var(--cen-soft); }
        .cen-links { display: flex; gap: 18px; flex-wrap: wrap; margin-top: 35px; }
        .cen-links a { border-bottom: 1px solid var(--cen-ink); padding-bottom: 5px; font: 10px "SFMono-Regular", monospace; letter-spacing: .12em; text-transform: uppercase; transition: color .2s ease, border-color .2s ease; }
        .cen-links a:hover { color: var(--cen-coral); border-color: var(--cen-coral); }
        .cen-currently { border-top: 1px solid var(--cen-ink); display: grid; grid-template-columns: 1.15fr repeat(4, 1fr); gap: 30px; padding-top: 25px; }
        .cen-currently-title { font-size: 25px; }
        .cen-currently-cell { border-left: 1px solid var(--cen-line); padding-left: 16px; }
        .cen-currently-label { display: block; color: var(--cen-coral); font-size: 9px; letter-spacing: .13em; margin-bottom: 11px; }
        .cen-currently-cell p { margin: 0; color: var(--cen-soft); font-size: 14px; line-height: 1.3; }
        .cen-footer { padding: 110px 0 34px; border-top: 1px solid var(--cen-line); }
        .cen-footer h2 { margin: 0 0 100px; font-size: clamp(74px, 15vw, 220px); line-height: .78; font-weight: 400; letter-spacing: -.09em; }
        .cen-footer-bottom { display: flex; justify-content: space-between; align-items: end; border-top: 1px solid var(--cen-line); padding-top: 18px; }
        .cen-footer-links { display: flex; gap: 24px; font: 10px "SFMono-Regular", monospace; letter-spacing: .11em; text-transform: uppercase; }
        .cen-footer-links a:hover { color: var(--cen-coral); }
        .cen-footer-meta { color: var(--cen-soft); font-size: 9px; letter-spacing: .1em; }
        @keyframes cen-pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: .35; transform: scale(.75); } }
        @media (max-width: 900px) {
          .cen-container { width: min(100% - 42px, 700px); }
          .cen-topbar { height: 76px; }
          .cen-nav-toggle { display: block; }
          .cen-nav { display: none; position: absolute; top: 76px; left: 0; right: 0; background: var(--cen-bg); border-bottom: 1px solid var(--cen-line); padding: 18px 21px 24px; flex-direction: column; align-items: flex-start; gap: 3px; }
          .cen-nav.is-open { display: flex; }
          .cen-nav a { width: 100%; }
          .cen-hero { min-height: 690px; grid-template-columns: 1fr; padding: 95px 0 78px; }
          .cen-system-mark { width: 178px; height: 178px; right: -12px; top: 100px; opacity: .48; }
          .cen-hero h1 { max-width: 660px; font-size: clamp(55px, 13vw, 98px); }
          .cen-hero-support { margin-top: 45px; max-width: 290px; }
          .cen-hero-index { align-self: end; margin-top: 70px; }
          .cen-section { padding: 100px 0; }
          .cen-section-heading, .cen-feature-intro, .cen-principles-layout, .cen-about { grid-template-columns: 1fr; gap: 35px; }
          .cen-section-heading { margin-bottom: 45px; }
          .cen-feature-intro { gap: 12px; }
          .cen-map-canvas { height: 430px; }
          .cen-case-study { grid-template-columns: repeat(2, 1fr); }
          .cen-case-step:nth-child(2) { border-right: 0; }
          .cen-case-step:nth-child(3) { border-top: 1px solid var(--cen-line); }
          .cen-placeholder-item { grid-template-columns: 43px 1fr 90px; gap: 13px; }
          .cen-placeholder-note { grid-column: 2 / 4; }
          .cen-placeholder-label { grid-column: 3; grid-row: 1; }
          .cen-experiment-grid { grid-template-columns: repeat(2, 1fr); }
          .cen-note { grid-template-columns: 85px 1fr 20px; gap: 15px; }
          .cen-note-copy { grid-column: 2 / 4; margin-top: -4px; }
          .cen-note-arrow { grid-column: 3; grid-row: 1; }
          .cen-principles-layout { gap: 54px; }
          .cen-currently { grid-template-columns: 1fr 1fr; gap: 25px 15px; }
          .cen-currently-title { grid-column: 1 / -1; }
          .cen-currently-cell:nth-child(2) { border-left: 0; padding-left: 0; }
          .cen-footer h2 { margin-bottom: 74px; }
          .cen-footer-bottom { align-items: start; flex-direction: column; gap: 24px; }
        }
        @media (max-width: 520px) {
          .cen-container { width: calc(100% - 34px); }
          .cen-hero { min-height: 630px; padding-top: 82px; }
          .cen-hero h1 { font-size: clamp(51px, 15vw, 74px); }
          .cen-system-mark { top: 79px; right: -27px; transform: scale(.8); transform-origin: top right; }
          .cen-hero-index { margin-top: 58px; }
          .cen-section { padding: 80px 0; }
          .cen-section-heading h2 { font-size: 54px; }
          .cen-feature h3 { font-size: 48px; }
          .cen-map-toolbar { padding: 0 11px; }
          .cen-map-coordinates { display: none; }
          .cen-map-canvas { height: 320px; }
          .cen-map-cursor-note { display: none; }
          .cen-map-tooltip { right: 11px; bottom: 11px; }
          .cen-map-footer { padding: 12px 11px; align-items: start; }
          .cen-map-key { display: none; }
          .cen-case-study { grid-template-columns: 1fr; }
          .cen-case-step { min-height: 0; border-right: 0; border-bottom: 1px solid var(--cen-line); padding-bottom: 18px; margin-right: 0; }
          .cen-case-step:nth-child(3) { border-top: 0; }
          .cen-placeholder-item { grid-template-columns: 33px 1fr; padding: 21px 0; }
          .cen-placeholder-label { grid-column: 2; grid-row: 2; justify-self: start; margin-top: 4px; }
          .cen-placeholder-note { grid-column: 2; }
          .cen-experiment-grid { grid-template-columns: 1fr 1fr; }
          .cen-experiment { min-height: 157px; padding: 14px; }
          .cen-experiment h3 { font-size: 20px; }
          .cen-note { grid-template-columns: 70px 1fr 16px; gap: 11px; }
          .cen-note h3 { font-size: 20px; }
          .cen-note-copy { font-size: 14px; }
          .cen-principle h3 { font-size: 27px; }
          .cen-principle-statement, .cen-principle-detail { margin-left: 45px; }
          .cen-about h2 { font-size: 60px; }
          .cen-about-copy p { font-size: 18px; }
          .cen-currently { grid-template-columns: 1fr 1fr; }
          .cen-footer { padding-top: 80px; }
          .cen-footer h2 { font-size: 23vw; }
          .cen-footer-links { gap: 13px; flex-wrap: wrap; }
        }
      `}</style>

      <header className="cen-container cen-topbar">
        <a className="cen-logo" href="#cen-top" aria-label="Back to top">CE<span>↗</span></a>
        <button className="cen-nav-toggle" type="button" onClick={() => setMenuOpen((value) => !value)} aria-expanded={menuOpen} aria-controls="cen-primary-navigation">{menuOpen ? "Close" : "Index"}</button>
        <nav id="cen-primary-navigation" className={`cen-nav ${menuOpen ? "is-open" : ""}`} aria-label="Primary navigation">
          <a href="#cen-work" onClick={() => setMenuOpen(false)}>Work</a>
          <a href="#cen-experiments" onClick={() => setMenuOpen(false)}>Experiments</a>
          <a href="#cen-notes" onClick={() => setMenuOpen(false)}>Notes</a>
          <a href="#cen-about" onClick={() => setMenuOpen(false)}>About</a>
        </nav>
      </header>

      <section className="cen-container cen-hero" id="cen-top" aria-labelledby="cen-hero-title">
        <div className="cen-hero-copy">
          <span className="cen-eyebrow">Software engineering · systems · product · after dark</span>
          <h1 id="cen-hero-title">I like understanding <em>how things work.</em></h1>
          <p className="cen-hero-support">Software engineer interested in systems, products, and the space between the two.</p>
        </div>
        <div className="cen-hero-index"><strong>01 / 08</strong><span>an independent notebook</span><span>built in the open</span><span>updated occasionally</span></div>
        <SystemMark />
      </section>

      <div className="cen-container"><hr className="cen-rule" /></div>

      <section className="cen-container cen-section" id="cen-work" aria-labelledby="cen-work-title">
        <div className="cen-section-heading"><h2 id="cen-work-title">Selected<br /><em>work.</em></h2><p>The pieces where the question mattered as much as the answer.</p></div>
        <article className="cen-feature">
          <div className="cen-feature-intro">
            <div><span className="cen-label">01 / Flagship concept</span><h3>TECTONIC</h3><div className="cen-work-meta"><span>Role <b>Software engineer / builder</b></span><span>Topics <b>Data · interaction · systems</b></span></div></div>
            <div><p className="cen-feature-deck">What happens when geology becomes an interface?</p><p className="cen-hero-support" style={{ margin: "24px 0 0", fontSize: "15px", maxWidth: "390px" }}>An interactive exploration of tectonic plates designed to make a geological system intuitive and explorable.</p></div>
          </div>
          <TectonicNightMap />
          <div className="cen-case-study">
            <div className="cen-case-step"><span>01 — QUESTION</span><h4>Make the invisible legible.</h4><p>How do you communicate a dynamic geological system through an interface?</p></div>
            <div className="cen-case-step"><span>02 — THINKING</span><h4>Let the model stay alive.</h4><p>Boundaries, movement, and relationships should be things you can inspect.</p></div>
            <div className="cen-case-step"><span>03 — ENGINEERING</span><h4>Data → API → view.</h4><p>A simple architecture keeps the visual layer curious instead of brittle.</p></div>
            <div className="cen-case-step"><span>04 — REFLECTION</span><h4>Good tools invite a second question.</h4><p>The result is less a map than a way into the map.</p></div>
          </div>
          <a className="cen-cta-link" href="#cen-tectonic-notes">Read the thinking <span>↗</span></a>
        </article>

        <div id="cen-tectonic-notes" style={{ marginTop: "124px" }}>
          <div className="cen-section-heading" style={{ marginBottom: "35px" }}><h2 style={{ fontSize: "clamp(39px, 5vw, 66px)" }}>Professional<br /><em>work.</em></h2><p>Space reserved for the work that cannot be responsibly summarized until the details are in.</p></div>
          <div className="cen-placeholder-list">
            <article className="cen-placeholder-item"><span className="cen-placeholder-index">02</span><div><h3>Systems for people</h3><span className="cen-placeholder-company">[Company]</span></div><p className="cen-placeholder-note">[Context, problem, responsibility, constraints, approach, architecture, trade-offs, outcome]</p><span className="cen-placeholder-label">CASE STUDY TO COME</span></article>
            <article className="cen-placeholder-item"><span className="cen-placeholder-index">03</span><div><h3>Another careful build</h3><span className="cen-placeholder-company">[Company]</span></div><p className="cen-placeholder-note">[The engineering judgment behind this work belongs here.]</p><span className="cen-placeholder-label">CASE STUDY TO COME</span></article>
          </div>
        </div>
      </section>

      <section className="cen-section cen-section-alt" id="cen-experiments" aria-labelledby="cen-experiments-title">
        <div className="cen-container"><div className="cen-section-heading"><h2 id="cen-experiments-title">Things I build<br /><em>because I’m curious.</em></h2><p>Small, unfinished, and occasionally useful. The point is following the thread.</p></div>
          <div className="cen-experiment-grid">{experiments.map((experiment) => <button className="cen-experiment" type="button" key={experiment.number} onClick={() => setSelectedExperiment(experiment)}><span className="cen-experiment-number">{experiment.number}</span><h3>{experiment.title}</h3><span className="cen-experiment-tag">{experiment.tag}</span></button>)}</div>
        </div>
      </section>

      <section className="cen-container cen-section" id="cen-notes" aria-labelledby="cen-notes-title">
        <div className="cen-section-heading"><h2 id="cen-notes-title">Things I’ve been<br /><em>thinking about.</em></h2><p>A notebook for the questions that survive the walk home.</p></div>
        <div className="cen-notes-grid">{visibleNotes.map((note) => <article className="cen-note" key={note.title}><div className="cen-note-meta"><span>{note.date}</span>{note.category}</div><h3>{note.title}</h3><p className="cen-note-copy">{note.copy}</p><span className="cen-note-arrow" aria-hidden="true">↗</span></article>)}</div>
        {!showMoreNotes && <button className="cen-text-button" type="button" onClick={() => setShowMoreNotes(true)}>Open the notebook +</button>}
      </section>

      <section className="cen-container cen-section" aria-labelledby="cen-principles-title">
        <div className="cen-principles-layout"><div className="cen-principles-intro"><span className="cen-label">A working model</span><h2 id="cen-principles-title">How<br />I think.</h2><p>Not skills. Not a methodology. Just a few lenses I keep reaching for.</p></div>
          <div className="cen-principle-list">{principles.map((principle) => <article className={`cen-principle ${activePrinciple === principle.key ? "is-active" : ""}`} key={principle.key} onClick={() => setActivePrinciple(activePrinciple === principle.key ? "" : principle.key)}><div className="cen-principle-header"><span className="cen-principle-number">{principle.number}</span><h3>{principle.title}</h3><span className="cen-principle-plus" aria-hidden="true">+</span></div><p className="cen-principle-statement">{principle.statement}</p><p className="cen-principle-detail">{principle.detail}</p></article>)}</div>
        </div>
      </section>

      <section className="cen-container cen-section" id="cen-about" aria-labelledby="cen-about-title">
        <div className="cen-about"><div><span className="cen-label">A little context</span><h2 id="cen-about-title">About<br /><em>the person.</em></h2></div><div className="cen-about-copy"><p>I’m a software engineer who enjoys understanding systems — especially the messy space where technology meets people.</p><p>Most of my professional life is spent building software. Outside of work, I tend to disappear down rabbit holes: products, technology, culture, maps, coffee, books, and occasionally ideas that have absolutely no reason to become software.</p><p>Some of them do anyway.</p><div className="cen-links"><a href="https://github.com" target="_blank" rel="noreferrer">GitHub ↗</a><a href="https://linkedin.com" target="_blank" rel="noreferrer">LinkedIn ↗</a><a href="mailto:hello@example.com">Email ↗</a><a href="#cen-resume">Résumé ↗</a></div></div></div>
      </section>

      <section className="cen-container cen-section" style={{ paddingTop: 0 }} aria-labelledby="cen-currently-title">
        <div className="cen-currently"><h2 className="cen-currently-title" id="cen-currently-title">Currently<span style={{ color: "var(--cen-coral)" }}>.</span></h2><div className="cen-currently-cell"><span className="cen-currently-label">Building</span><p>[Current project]</p></div><div className="cen-currently-cell"><span className="cen-currently-label">Learning</span><p>[Current topic]</p></div><div className="cen-currently-cell"><span className="cen-currently-label">Reading</span><p>[Current book]</p></div><div className="cen-currently-cell"><span className="cen-currently-label">Thinking about</span><p>[Current question]</p></div></div>
      </section>

      <footer className="cen-container cen-footer" id="cen-resume"><h2>Still <em>curious.</em></h2><div className="cen-footer-bottom"><div className="cen-footer-links"><a href="https://github.com" target="_blank" rel="noreferrer">GitHub</a><a href="https://linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a><a href="mailto:hello@example.com">Email</a><a href="#cen-resume">Résumé</a></div><span className="cen-footer-meta">© {new Date().getFullYear()} / CE / SOMEWHERE BETWEEN SYSTEMS</span></div></footer>

      {selectedExperiment && <div className="cen-experiment-panel" role="dialog" aria-modal="true" aria-labelledby="cen-panel-title"><span className="cen-label">{selectedExperiment.tag}</span><h3 id="cen-panel-title">{selectedExperiment.title}</h3><p>{selectedExperiment.copy} The details are still taking shape, which is often the useful part.</p><button className="cen-panel-close" type="button" onClick={() => setSelectedExperiment(null)}>Close / return to index</button></div>}
    </main>
  );
}