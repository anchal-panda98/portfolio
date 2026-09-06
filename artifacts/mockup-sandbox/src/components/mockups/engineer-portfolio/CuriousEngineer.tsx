import { useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent } from "react";

type Plate = {
  id: string;
  name: string;
  movement: string;
  position: string;
  points: string;
  fill: string;
};

const plates: Plate[] = [
  {
    id: "pacific",
    name: "Pacific",
    movement: "north-west",
    position: "39° N / 144° W",
    points: "18,88 45,64 82,70 108,94 95,124 62,136 28,122",
    fill: "#a8b5a1",
  },
  {
    id: "north-america",
    name: "North American",
    movement: "west",
    position: "44° N / 101° W",
    points: "108,24 164,21 190,45 182,77 153,87 128,71 105,72 94,47",
    fill: "#d1b08c",
  },
  {
    id: "south-america",
    name: "South American",
    movement: "west",
    position: "18° S / 62° W",
    points: "188,91 216,99 224,130 204,160 190,143 178,118",
    fill: "#c99c78",
  },
  {
    id: "eurasia",
    name: "Eurasian",
    movement: "east",
    position: "51° N / 72° E",
    points: "190,45 242,25 292,41 316,61 301,82 256,79 227,93 203,74",
    fill: "#b8a78b",
  },
  {
    id: "africa",
    name: "African",
    movement: "north-east",
    position: "1° N / 18° E",
    points: "224,91 252,83 275,101 265,145 241,158 217,130",
    fill: "#a9aa8f",
  },
  {
    id: "antarctic",
    name: "Antarctic",
    movement: "east",
    position: "77° S / 0° E",
    points: "120,165 176,157 225,169 263,162 302,176 279,197 210,202 152,193",
    fill: "#c9c4ad",
  },
];

const workPlaceholders = [
  {
    index: "02",
    title: "[Professional Project]",
    company: "[Company]",
    label: "CASE STUDY TO COME",
    note: "[Context, problem, responsibility, constraints, approach, architecture, trade-offs, outcome]",
  },
  {
    index: "03",
    title: "[Another Professional Project]",
    company: "[Company]",
    label: "CASE STUDY TO COME",
    note: "[The engineering judgment behind this work belongs here.]",
  },
];

const experiments = [
  { number: "01", title: "[Interactive visualization]", tag: "DATA / FORM" },
  { number: "02", title: "[Small Python tool]", tag: "UTILITY / PLAY" },
  { number: "03", title: "[Simulation]", tag: "MODEL / QUESTION" },
  { number: "04", title: "[Tiny product idea]", tag: "PRODUCT / MAYBE" },
  { number: "05", title: "[API experiment]", tag: "SYSTEM / EDGE" },
  { number: "06", title: "[Visual experiment]", tag: "IMAGE / MOTION" },
];

const notes = [
  {
    date: "12.06.24",
    category: "CULTURE",
    title: "Why did Nescafé have to teach Japan to drink coffee?",
    copy: "A product can be an invitation, a ritual, and a piece of infrastructure at the same time.",
  },
  {
    date: "04.05.24",
    category: "INTERFACES",
    title: "Why do some interfaces feel physical?",
    copy: "The useful metaphor is not always the obvious one. Sometimes a little resistance is information.",
  },
  {
    date: "21.03.24",
    category: "BEHAVIOUR",
    title: "What happens when a technical system meets human behaviour?",
    copy: "The gap between the model and the person is usually where the interesting work begins.",
  },
  {
    date: "08.02.24",
    category: "MATERIALS",
    title: "How did salt become more than food?",
    copy: "A tiny object can carry a surprisingly large history of trade, power, and taste.",
  },
];

const principles = [
  {
    key: "systems",
    number: "01",
    title: "Systems",
    statement: "Understanding how components interact.",
    detail: "I look for the relationships first: what depends on what, where information bends, and which small change will travel furthest.",
  },
  {
    key: "product",
    number: "02",
    title: "Product",
    statement: "Understanding why something should exist.",
    detail: "A clear interface cannot rescue an unclear reason. I start with the question a product is helping someone answer.",
  },
  {
    key: "engineering",
    number: "03",
    title: "Engineering",
    statement: "Turning constraints into reliable systems.",
    detail: "Constraints are not an interruption to the work. They are the shape the work has to become.",
  },
  {
    key: "curiosity",
    number: "04",
    title: "Curiosity",
    statement: "Following questions even when they are not immediately useful.",
    detail: "The side path is often where a better mental model is waiting. I keep a notebook for the questions that do not fit yet.",
  },
];

function TectonicMap() {
  const [activeId, setActiveId] = useState("pacific");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pointer, setPointer] = useState({ x: 50, y: 50 });
  const mapRef = useRef<HTMLDivElement>(null);
  const activePlate = plates.find((plate) => plate.id === activeId) ?? plates[0];

  function updatePointer(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    setPointer({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    });
  }

  return (
    <div className="ce-map-shell">
      <div className="ce-map-toolbar">
        <span className="ce-map-kicker">
          <i className="ce-live-dot" /> LIVE MODEL / 01
        </span>
        <span className="ce-map-coordinates">
          {activePlate.position}
        </span>
        <div className="ce-map-zoom" aria-label="Map controls">
          <button type="button" aria-label="Zoom out" onClick={() => setZoom((value) => Math.max(0.85, value - 0.1))}>−</button>
          <span>{Math.round(zoom * 100)}%</span>
          <button type="button" aria-label="Zoom in" onClick={() => setZoom((value) => Math.min(1.3, value + 0.1))}>+</button>
        </div>
      </div>
      <div
        className="ce-map-canvas"
        ref={mapRef}
        onPointerMove={updatePointer}
        onPointerLeave={() => setHoveredId(null)}
        style={{ "--pointer-x": `${pointer.x}%`, "--pointer-y": `${pointer.y}%` } as CSSProperties}
      >
        <div className="ce-map-graticule" />
        <div className="ce-map-orbit ce-map-orbit-one" />
        <div className="ce-map-orbit ce-map-orbit-two" />
        <svg
          className="ce-plates"
          viewBox="0 0 340 220"
          role="img"
          aria-label="Abstract interactive tectonic plate map"
          style={{ transform: `scale(${zoom}) rotateX(${(pointer.y - 50) * -0.025}deg) rotateY(${(pointer.x - 50) * 0.025}deg)` }}
        >
          <defs>
            <filter id="ce-paper-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#24322b" floodOpacity=".14" />
            </filter>
          </defs>
          <path className="ce-boundary ce-boundary-a" d="M92 44 C115 70 106 90 122 108 C140 126 155 142 174 168" />
          <path className="ce-boundary ce-boundary-b" d="M185 33 C177 56 187 68 181 91 C176 112 183 131 194 159" />
          <path className="ce-boundary ce-boundary-c" d="M218 87 C245 92 261 87 282 74 C298 64 310 68 326 76" />
          {plates.map((plate) => {
            const isActive = activeId === plate.id;
            return (
              <g
                key={plate.id}
                onClick={() => setActiveId(plate.id)}
                onMouseEnter={() => setHoveredId(plate.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`ce-plate-group ${isActive ? "is-active" : ""} ${hoveredId === plate.id ? "is-hovered" : ""}`}
                role="button"
                tabIndex={0}
                aria-label={`Select ${plate.name} plate`}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") setActiveId(plate.id);
                }}
              >
                <polygon points={plate.points} fill={plate.fill} filter="url(#ce-paper-shadow)" />
                <text x={plate.id === "antarctic" ? 188 : plate.id === "pacific" ? 52 : plate.id === "north-america" ? 132 : plate.id === "eurasia" ? 246 : plate.id === "south-america" ? 199 : 239} y={plate.id === "antarctic" ? 182 : plate.id === "pacific" ? 102 : plate.id === "north-america" ? 51 : plate.id === "eurasia" ? 56 : plate.id === "south-america" ? 120 : 119} className="ce-plate-label">
                  {plate.name.split(" ")[0].toUpperCase()}
                </text>
              </g>
            );
          })}
          <circle className="ce-map-crosshair" cx={(pointer.x / 100) * 340} cy={(pointer.y / 100) * 220} r="5" />
          <line className="ce-map-crosshair-line" x1={(pointer.x / 100) * 340 - 13} x2={(pointer.x / 100) * 340 + 13} y1={(pointer.y / 100) * 220} y2={(pointer.y / 100) * 220} />
          <line className="ce-map-crosshair-line" x1={(pointer.x / 100) * 340} x2={(pointer.x / 100) * 340} y1={(pointer.y / 100) * 220 - 13} y2={(pointer.y / 100) * 220 + 13} />
        </svg>
        <div className="ce-map-cursor-note">MOVE THROUGH THE SYSTEM</div>
        <div className="ce-map-tooltip">
          <span>SELECTED PLATE</span>
          <strong>{activePlate.name}</strong>
          <small>moving {activePlate.movement}</small>
        </div>
      </div>
      <div className="ce-map-footer">
        <div>
          <span className="ce-map-readout">PLATE / {activePlate.name.toUpperCase()}</span>
          <p>Click a plate to inspect the relationship.</p>
        </div>
        <div className="ce-map-key">
          <span><i className="ce-key-line" /> BOUNDARY</span>
          <span><i className="ce-key-dot" /> ACTIVE NODE</span>
        </div>
      </div>
    </div>
  );
}

function SystemMark() {
  const [cursor, setCursor] = useState({ x: 50, y: 50 });
  const points = useMemo(() => [
    { x: 50, y: 50, r: 3 },
    { x: 27, y: 30, r: 2 },
    { x: 76, y: 25, r: 2 },
    { x: 84, y: 70, r: 2 },
    { x: 19, y: 73, r: 2 },
    { x: 55, y: 12, r: 1.5 },
  ], []);
  return (
    <div
      className="ce-system-mark"
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setCursor({ x: ((event.clientX - rect.left) / rect.width) * 100, y: ((event.clientY - rect.top) / rect.height) * 100 });
      }}
      style={{ "--mark-x": `${cursor.x}%`, "--mark-y": `${cursor.y}%` } as CSSProperties}
      aria-hidden="true"
    >
      <svg viewBox="0 0 100 100">
        <path d="M50 50 L27 30 M50 50 L76 25 M50 50 L84 70 M50 50 L19 73 M50 50 L55 12" />
        <path d="M27 30 L76 25 M76 25 L84 70 M84 70 L19 73 M19 73 L27 30" className="ce-mark-faint" />
        {points.map((point) => <circle key={`${point.x}-${point.y}`} cx={point.x} cy={point.y} r={point.r} />)}
        <circle cx={cursor.x} cy={cursor.y} r="12" className="ce-mark-cursor" />
      </svg>
      <span>systems are connected</span>
    </div>
  );
}

export function CuriousEngineer() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePrinciple, setActivePrinciple] = useState("systems");
  const [showMoreNotes, setShowMoreNotes] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const visibleNotes = showMoreNotes ? notes : notes.slice(0, 3);

  return (
    <main className="ce-root">
      <style>{`
        .ce-root {
          --paper: #e9e5dc;
          --paper-deep: #ddd8cc;
          --ink: #202c29;
          --ink-soft: #52615a;
          --line: rgba(32,44,41,.23);
          --accent: #c85b39;
          --accent-deep: #9d402b;
          --sage: #a8b5a1;
          background: var(--paper);
          color: var(--ink);
          font-family: "Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif;
          min-height: 100dvh;
          overflow: hidden;
        }
        .ce-root *, .ce-root *::before, .ce-root *::after { box-sizing: border-box; }
        .ce-root { scroll-behavior: smooth; }
        .ce-root a { color: inherit; text-decoration: none; }
        .ce-mono, .ce-root button, .ce-label, .ce-nav, .ce-map-shell, .ce-system-mark span, .ce-annotation, .ce-work-meta, .ce-experiment-tag, .ce-note-meta, .ce-currently-label, .ce-footer-meta {
          font-family: "SFMono-Regular", "Cascadia Code", "Roboto Mono", ui-monospace, monospace;
        }
        .ce-container { width: min(1240px, calc(100% - 64px)); margin: 0 auto; }
        .ce-topbar { height: 92px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--line); position: relative; z-index: 20; }
        .ce-logo { font-family: "SFMono-Regular", ui-monospace, monospace; font-size: 12px; letter-spacing: .14em; font-weight: 600; }
        .ce-logo span { color: var(--accent); }
        .ce-nav { display: flex; align-items: center; gap: 30px; font-size: 10px; letter-spacing: .15em; text-transform: uppercase; }
        .ce-nav a { position: relative; padding: 12px 0; }
        .ce-nav a::after { content: ""; position: absolute; left: 0; right: 100%; bottom: 5px; height: 1px; background: var(--accent); transition: right .3s ease; }
        .ce-nav a:hover::after, .ce-nav a:focus-visible::after { right: 0; }
        .ce-nav-toggle { display: none; border: 0; background: transparent; color: var(--ink); font: 11px "SFMono-Regular", monospace; letter-spacing: .14em; text-transform: uppercase; cursor: pointer; }
        .ce-hero { min-height: 760px; display: grid; grid-template-columns: 1fr 290px; align-items: end; padding: 120px 0 104px; position: relative; }
        .ce-hero-copy { max-width: 840px; position: relative; z-index: 2; }
        .ce-eyebrow, .ce-label { display: block; color: var(--accent-deep); font: 10px/1.4 "SFMono-Regular", monospace; letter-spacing: .19em; text-transform: uppercase; }
        .ce-eyebrow { margin-bottom: 30px; }
        .ce-hero h1 { margin: 0; max-width: 920px; font-size: clamp(58px, 9vw, 137px); line-height: .91; letter-spacing: -.065em; font-weight: 400; }
        .ce-hero h1 em { color: var(--accent); font-style: italic; }
        .ce-hero-support { max-width: 360px; margin: 56px 0 0 8px; font-size: 20px; line-height: 1.35; color: var(--ink-soft); }
        .ce-hero-index { align-self: start; padding-top: 10px; font: 10px/1.7 "SFMono-Regular", monospace; letter-spacing: .12em; text-transform: uppercase; color: var(--ink-soft); }
        .ce-hero-index strong { display: block; color: var(--ink); font-size: 13px; margin-bottom: 12px; font-weight: 500; }
        .ce-hero-index span { display: block; }
        .ce-hero-index span::before { content: "— "; color: var(--accent); }
        .ce-system-mark { position: absolute; right: 7%; top: 122px; width: 250px; height: 250px; opacity: .62; transition: opacity .3s ease; }
        .ce-system-mark:hover { opacity: 1; }
        .ce-system-mark svg { width: 100%; height: 100%; overflow: visible; }
        .ce-system-mark path { fill: none; stroke: var(--ink-soft); stroke-width: .42; vector-effect: non-scaling-stroke; }
        .ce-system-mark .ce-mark-faint { opacity: .24; stroke-dasharray: 1 3; }
        .ce-system-mark circle { fill: var(--accent); }
        .ce-system-mark .ce-mark-cursor { cx: var(--mark-x); cy: var(--mark-y); fill: none; stroke: var(--accent); stroke-width: .65; opacity: .8; transition: cx .18s ease-out, cy .18s ease-out; }
        .ce-system-mark span { position: absolute; bottom: 13px; right: 0; color: var(--ink-soft); font-size: 8px; letter-spacing: .12em; text-transform: uppercase; white-space: nowrap; }
        .ce-rule { border: 0; border-top: 1px solid var(--line); margin: 0; }
        .ce-section { padding: 142px 0; }
        .ce-section-heading { display: grid; grid-template-columns: 1.1fr 1fr; gap: 40px; align-items: end; margin-bottom: 64px; }
        .ce-section-heading h2 { margin: 0; font-size: clamp(47px, 6.6vw, 92px); line-height: .91; letter-spacing: -.065em; font-weight: 400; }
        .ce-section-heading p { max-width: 355px; margin: 0 0 5px; color: var(--ink-soft); font-size: 18px; line-height: 1.4; }
        .ce-section-heading p::before { content: "↳"; color: var(--accent); font-family: ui-monospace, monospace; display: block; margin-bottom: 12px; }
        .ce-feature { border-top: 1px solid var(--ink); padding-top: 27px; }
        .ce-feature-intro { display: grid; grid-template-columns: 1fr 1.25fr; gap: 70px; margin-bottom: 48px; }
        .ce-feature h3 { margin: 10px 0 16px; font-size: clamp(38px, 5vw, 72px); line-height: .96; font-weight: 400; letter-spacing: -.055em; }
        .ce-feature h3 em { color: var(--accent); font-style: normal; }
        .ce-feature-deck { margin: 0; max-width: 420px; font-size: 21px; line-height: 1.35; color: var(--ink-soft); }
        .ce-work-meta { display: flex; flex-wrap: wrap; gap: 9px 28px; margin-top: 31px; color: var(--ink-soft); font-size: 10px; letter-spacing: .11em; text-transform: uppercase; }
        .ce-work-meta b { color: var(--ink); font-weight: 400; }
        .ce-map-shell { background: #d5d7c8; border: 1px solid rgba(32,44,41,.42); position: relative; overflow: hidden; }
        .ce-map-toolbar, .ce-map-footer { min-height: 48px; padding: 0 18px; display: flex; align-items: center; justify-content: space-between; gap: 18px; color: var(--ink-soft); font-size: 9px; letter-spacing: .12em; text-transform: uppercase; }
        .ce-map-toolbar { border-bottom: 1px solid rgba(32,44,41,.2); background: rgba(233,229,220,.27); }
        .ce-map-kicker { color: var(--ink); }
        .ce-live-dot { display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: var(--accent); margin-right: 8px; animation: ce-pulse 2.2s infinite ease-in-out; }
        .ce-map-coordinates { margin-left: auto; color: var(--accent-deep); }
        .ce-map-zoom { display: flex; border-left: 1px solid rgba(32,44,41,.2); padding-left: 14px; align-items: center; gap: 12px; }
        .ce-map-zoom button { border: 0; padding: 1px 4px; font-size: 15px; background: transparent; cursor: pointer; color: var(--ink); }
        .ce-map-canvas { height: 515px; position: relative; overflow: hidden; perspective: 700px; background: radial-gradient(circle at var(--pointer-x) var(--pointer-y), rgba(247,241,219,.35), transparent 24%), #d5d7c8; }
        .ce-map-graticule { position: absolute; inset: -40% -20%; opacity: .45; background-image: linear-gradient(rgba(59,82,71,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(59,82,71,.15) 1px, transparent 1px); background-size: 70px 70px; transform: rotate(-12deg); }
        .ce-map-orbit { position: absolute; left: 50%; top: 50%; border: 1px solid rgba(59,82,71,.22); border-radius: 50%; transform: translate(-50%, -50%) rotate(-20deg); }
        .ce-map-orbit-one { width: 71%; height: 82%; }
        .ce-map-orbit-two { width: 88%; height: 56%; transform: translate(-50%, -50%) rotate(30deg); border-style: dashed; }
        .ce-plates { position: absolute; width: min(85%, 780px); height: auto; left: 50%; top: 50%; transform-origin: center; translate: -50% -50%; overflow: visible; transition: transform .2s ease-out; }
        .ce-plate-group { cursor: pointer; outline: none; }
        .ce-plate-group polygon { stroke: rgba(32,44,41,.43); stroke-width: 1.2; transition: transform .35s ease, fill .35s ease, opacity .35s ease; transform-box: fill-box; transform-origin: center; }
        .ce-plate-group:hover polygon, .ce-plate-group.is-hovered polygon, .ce-plate-group.is-active polygon { transform: translateY(-3px) scale(1.025); fill: #e4ba85; }
        .ce-plate-group:not(.is-active):not(:hover) { opacity: .75; }
        .ce-plate-label { fill: rgba(32,44,41,.64); font: 6px "SFMono-Regular", monospace; letter-spacing: .08em; pointer-events: none; }
        .ce-boundary { fill: none; stroke: var(--accent); stroke-width: 1.5; stroke-dasharray: 1 4; stroke-linecap: round; opacity: .82; }
        .ce-map-crosshair { fill: none; stroke: var(--accent); stroke-width: 1; opacity: .9; pointer-events: none; }
        .ce-map-crosshair-line { stroke: var(--accent); stroke-width: .5; opacity: .55; pointer-events: none; }
        .ce-map-cursor-note { position: absolute; left: 18px; bottom: 17px; color: var(--ink-soft); font-size: 8px; letter-spacing: .12em; }
        .ce-map-tooltip { position: absolute; right: 18px; bottom: 17px; display: flex; flex-direction: column; gap: 4px; background: rgba(233,229,220,.84); border-left: 2px solid var(--accent); padding: 11px 14px; min-width: 140px; }
        .ce-map-tooltip span, .ce-map-tooltip small { font-size: 8px; letter-spacing: .11em; color: var(--ink-soft); }
        .ce-map-tooltip strong { font: 13px Georgia, serif; font-weight: 400; }
        .ce-map-footer { border-top: 1px solid rgba(32,44,41,.2); min-height: 69px; text-transform: none; letter-spacing: 0; }
        .ce-map-footer p { margin: 4px 0 0; font-family: Georgia, serif; font-size: 13px; color: var(--ink-soft); }
        .ce-map-readout { font-size: 9px; letter-spacing: .12em; color: var(--ink); }
        .ce-map-key { display: flex; gap: 16px; align-items: center; font-size: 8px; letter-spacing: .1em; }
        .ce-map-key span { display: flex; align-items: center; gap: 5px; }
        .ce-key-line { width: 14px; border-top: 1px dashed var(--accent); }
        .ce-key-dot { width: 5px; height: 5px; background: var(--accent); border-radius: 50%; }
        .ce-case-study { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; border-top: 1px solid var(--line); margin-top: 48px; }
        .ce-case-step { padding: 20px 20px 4px 0; border-right: 1px solid var(--line); margin-right: 20px; min-height: 152px; }
        .ce-case-step:last-child { border: 0; }
        .ce-case-step span { font: 10px "SFMono-Regular", monospace; color: var(--accent); }
        .ce-case-step h4 { margin: 13px 0 9px; font-size: 21px; font-weight: 400; }
        .ce-case-step p { margin: 0; color: var(--ink-soft); font-size: 14px; line-height: 1.4; }
        .ce-cta-link { display: inline-flex; align-items: center; gap: 12px; border-bottom: 1px solid var(--ink); padding-bottom: 6px; margin-top: 38px; font: 10px "SFMono-Regular", monospace; letter-spacing: .12em; text-transform: uppercase; transition: color .2s ease, border-color .2s ease, gap .2s ease; }
        .ce-cta-link:hover { color: var(--accent-deep); border-color: var(--accent); gap: 17px; }
        .ce-placeholder-list { border-top: 1px solid var(--ink); }
        .ce-placeholder-item { display: grid; grid-template-columns: 60px 1fr 1.2fr 140px; gap: 25px; padding: 26px 0; border-bottom: 1px solid var(--line); align-items: start; transition: padding .25s ease, background .25s ease; }
        .ce-placeholder-item:hover { padding-left: 14px; padding-right: 14px; background: rgba(200,91,57,.06); }
        .ce-placeholder-index { color: var(--accent); font: 11px "SFMono-Regular", monospace; }
        .ce-placeholder-item h3 { margin: 0 0 6px; font-size: 25px; font-weight: 400; }
        .ce-placeholder-company { color: var(--ink-soft); font: 10px "SFMono-Regular", monospace; letter-spacing: .13em; text-transform: uppercase; }
        .ce-placeholder-note { margin: 0; color: var(--ink-soft); font-size: 15px; line-height: 1.4; max-width: 430px; }
        .ce-placeholder-label { justify-self: end; font: 9px "SFMono-Regular", monospace; letter-spacing: .11em; color: var(--accent-deep); }
        .ce-section-alt { background: var(--paper-deep); margin: 0 calc((100vw - 100%) / -2); padding-left: max(32px, calc((100vw - 1240px) / 2)); padding-right: max(32px, calc((100vw - 1240px) / 2)); }
        .ce-experiment-grid { display: grid; grid-template-columns: repeat(3, 1fr); border-top: 1px solid var(--line); border-left: 1px solid var(--line); }
        .ce-experiment { min-height: 190px; border-right: 1px solid var(--line); border-bottom: 1px solid var(--line); padding: 20px; display: flex; flex-direction: column; justify-content: space-between; position: relative; overflow: hidden; transition: background .25s ease, color .25s ease; }
        .ce-experiment::after { content: "↗"; position: absolute; right: 20px; top: 18px; color: var(--accent); font-size: 20px; transform: translate(-4px, 4px); opacity: 0; transition: opacity .25s ease, transform .25s ease; }
        .ce-experiment:hover { background: var(--ink); color: var(--paper); }
        .ce-experiment:hover::after { opacity: 1; transform: none; }
        .ce-experiment-number { color: var(--accent); font: 11px "SFMono-Regular", monospace; }
        .ce-experiment h3 { max-width: 210px; margin: auto 0 20px; font-size: 25px; line-height: 1.02; font-weight: 400; }
        .ce-experiment-tag { font-size: 9px; letter-spacing: .14em; color: var(--ink-soft); }
        .ce-experiment:hover .ce-experiment-tag { color: #b9c0b2; }
        .ce-notes-grid { border-top: 1px solid var(--line); }
        .ce-note { display: grid; grid-template-columns: 100px 170px 1fr 32px; gap: 25px; border-bottom: 1px solid var(--line); padding: 27px 0; align-items: start; transition: padding .25s ease; }
        .ce-note:hover { padding-left: 13px; background: rgba(200,91,57,.05); }
        .ce-note-meta { font-size: 9px; letter-spacing: .1em; color: var(--ink-soft); }
        .ce-note-meta span { display: block; margin-bottom: 8px; color: var(--accent-deep); }
        .ce-note h3 { margin: 0; font-size: 23px; line-height: 1.15; font-weight: 400; }
        .ce-note-copy { margin: 0; max-width: 340px; color: var(--ink-soft); font-size: 15px; line-height: 1.4; }
        .ce-note-arrow { color: var(--accent); font: 21px Georgia, serif; text-align: right; }
        .ce-text-button { background: transparent; border: 0; color: var(--accent-deep); padding: 0; margin-top: 26px; font: 10px "SFMono-Regular", monospace; letter-spacing: .14em; text-transform: uppercase; cursor: pointer; }
        .ce-principles-layout { display: grid; grid-template-columns: 1fr 1.1fr; gap: 100px; align-items: start; }
        .ce-principles-intro h2 { margin: 0; font-size: clamp(46px, 6vw, 82px); line-height: .93; letter-spacing: -.065em; font-weight: 400; }
        .ce-principles-intro p { color: var(--ink-soft); max-width: 250px; font-size: 17px; line-height: 1.45; margin-top: 42px; }
        .ce-principle-list { border-top: 1px solid var(--ink); }
        .ce-principle { border-bottom: 1px solid var(--line); padding: 19px 0 21px; cursor: pointer; }
        .ce-principle-header { display: grid; grid-template-columns: 45px 1fr 25px; gap: 15px; align-items: baseline; }
        .ce-principle-number { font: 10px "SFMono-Regular", monospace; color: var(--accent); }
        .ce-principle h3 { margin: 0; font-size: 31px; font-weight: 400; }
        .ce-principle-plus { color: var(--accent); font: 22px "SFMono-Regular", monospace; transition: transform .25s ease; }
        .ce-principle.is-active .ce-principle-plus { transform: rotate(45deg); }
        .ce-principle-statement { margin: 5px 0 0 60px; font-size: 16px; color: var(--ink-soft); }
        .ce-principle-detail { max-height: 0; overflow: hidden; margin-left: 60px; color: var(--ink-soft); font-size: 15px; line-height: 1.4; transition: max-height .3s ease, padding-top .3s ease; }
        .ce-principle.is-active .ce-principle-detail { max-height: 100px; padding-top: 16px; }
        .ce-about { display: grid; grid-template-columns: 1fr 1fr; gap: 100px; align-items: start; }
        .ce-about h2 { margin: 0; font-size: clamp(48px, 6.5vw, 90px); line-height: .9; letter-spacing: -.07em; font-weight: 400; }
        .ce-about-copy { max-width: 480px; padding-top: 5px; }
        .ce-about-copy p { margin: 0 0 21px; font-size: 20px; line-height: 1.42; }
        .ce-about-copy p:last-of-type { color: var(--ink-soft); }
        .ce-links { display: flex; gap: 18px; flex-wrap: wrap; margin-top: 35px; }
        .ce-links a { border-bottom: 1px solid var(--ink); padding-bottom: 5px; font: 10px "SFMono-Regular", monospace; letter-spacing: .12em; text-transform: uppercase; transition: color .2s ease, border-color .2s ease; }
        .ce-links a:hover { color: var(--accent-deep); border-color: var(--accent); }
        .ce-currently { border-top: 1px solid var(--ink); display: grid; grid-template-columns: 1.15fr repeat(4, 1fr); gap: 30px; padding-top: 25px; }
        .ce-currently-title { font-size: 25px; }
        .ce-currently-cell { border-left: 1px solid var(--line); padding-left: 16px; }
        .ce-currently-label { display: block; color: var(--accent-deep); font-size: 9px; letter-spacing: .13em; margin-bottom: 11px; }
        .ce-currently-cell p { margin: 0; color: var(--ink-soft); font-size: 14px; line-height: 1.3; }
        .ce-footer { padding: 110px 0 34px; border-top: 1px solid var(--line); }
        .ce-footer h2 { margin: 0 0 100px; font-size: clamp(74px, 15vw, 220px); line-height: .78; font-weight: 400; letter-spacing: -.09em; }
        .ce-footer h2 em { color: var(--accent); font-style: italic; }
        .ce-footer-bottom { display: flex; justify-content: space-between; align-items: end; border-top: 1px solid var(--line); padding-top: 18px; }
        .ce-footer-links { display: flex; gap: 24px; font: 10px "SFMono-Regular", monospace; letter-spacing: .11em; text-transform: uppercase; }
        .ce-footer-links a:hover { color: var(--accent-deep); }
        .ce-footer-meta { color: var(--ink-soft); font-size: 9px; letter-spacing: .1em; }
        @keyframes ce-pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: .35; transform: scale(.75); } }
        @media (max-width: 900px) {
          .ce-container { width: min(100% - 42px, 700px); }
          .ce-topbar { height: 76px; }
          .ce-nav-toggle { display: block; }
          .ce-nav { display: none; position: absolute; top: 76px; left: 0; right: 0; background: var(--paper); border-bottom: 1px solid var(--line); padding: 18px 21px 24px; flex-direction: column; align-items: flex-start; gap: 3px; }
          .ce-nav.is-open { display: flex; }
          .ce-nav a { width: 100%; }
          .ce-hero { min-height: 690px; grid-template-columns: 1fr; padding: 95px 0 78px; }
          .ce-system-mark { width: 178px; height: 178px; right: -12px; top: 100px; opacity: .48; }
          .ce-hero h1 { max-width: 660px; font-size: clamp(55px, 13vw, 98px); }
          .ce-hero-support { margin-top: 45px; max-width: 290px; }
          .ce-hero-index { align-self: end; margin-top: 70px; }
          .ce-section { padding: 100px 0; }
          .ce-section-heading, .ce-feature-intro, .ce-principles-layout, .ce-about { grid-template-columns: 1fr; gap: 35px; }
          .ce-section-heading { margin-bottom: 45px; }
          .ce-feature-intro { gap: 12px; }
          .ce-map-canvas { height: 430px; }
          .ce-case-study { grid-template-columns: repeat(2, 1fr); }
          .ce-case-step:nth-child(2) { border-right: 0; }
          .ce-case-step:nth-child(3) { border-top: 1px solid var(--line); }
          .ce-placeholder-item { grid-template-columns: 43px 1fr 90px; gap: 13px; }
          .ce-placeholder-note { grid-column: 2 / 4; }
          .ce-placeholder-label { grid-column: 3; grid-row: 1; }
          .ce-experiment-grid { grid-template-columns: repeat(2, 1fr); }
          .ce-note { grid-template-columns: 85px 1fr 20px; gap: 15px; }
          .ce-note-copy { grid-column: 2 / 4; margin-top: -4px; }
          .ce-note-arrow { grid-column: 3; grid-row: 1; }
          .ce-principles-layout { gap: 54px; }
          .ce-currently { grid-template-columns: 1fr 1fr; gap: 25px 15px; }
          .ce-currently-title { grid-column: 1 / -1; }
          .ce-currently-cell:nth-child(2) { border-left: 0; padding-left: 0; }
          .ce-footer h2 { margin-bottom: 74px; }
          .ce-footer-bottom { align-items: start; flex-direction: column; gap: 24px; }
        }
        @media (max-width: 520px) {
          .ce-container { width: calc(100% - 34px); }
          .ce-hero { min-height: 630px; padding-top: 82px; }
          .ce-hero h1 { font-size: clamp(51px, 15vw, 74px); }
          .ce-system-mark { top: 79px; right: -27px; transform: scale(.8); transform-origin: top right; }
          .ce-hero-index { margin-top: 58px; }
          .ce-section { padding: 80px 0; }
          .ce-section-heading h2 { font-size: 54px; }
          .ce-feature h3 { font-size: 48px; }
          .ce-map-toolbar { padding: 0 11px; }
          .ce-map-coordinates { display: none; }
          .ce-map-canvas { height: 320px; }
          .ce-map-cursor-note { display: none; }
          .ce-map-tooltip { right: 11px; bottom: 11px; }
          .ce-map-footer { padding: 0 11px; align-items: start; padding-top: 12px; padding-bottom: 12px; }
          .ce-map-key { display: none; }
          .ce-case-study { grid-template-columns: 1fr; }
          .ce-case-step { min-height: 0; border-right: 0; border-bottom: 1px solid var(--line); padding-bottom: 18px; margin-right: 0; }
          .ce-case-step:nth-child(3) { border-top: 0; }
          .ce-placeholder-item { grid-template-columns: 33px 1fr; padding: 21px 0; }
          .ce-placeholder-label { grid-column: 2; grid-row: 2; justify-self: start; margin-top: 4px; }
          .ce-placeholder-note { grid-column: 2; }
          .ce-experiment-grid { grid-template-columns: 1fr 1fr; }
          .ce-experiment { min-height: 157px; padding: 14px; }
          .ce-experiment h3 { font-size: 20px; }
          .ce-note { grid-template-columns: 70px 1fr 16px; gap: 11px; }
          .ce-note h3 { font-size: 20px; }
          .ce-note-copy { font-size: 14px; }
          .ce-principle h3 { font-size: 27px; }
          .ce-principle-statement, .ce-principle-detail { margin-left: 45px; }
          .ce-about h2 { font-size: 60px; }
          .ce-about-copy p { font-size: 18px; }
          .ce-currently { grid-template-columns: 1fr 1fr; }
          .ce-footer { padding-top: 80px; }
          .ce-footer h2 { font-size: 23vw; }
          .ce-footer-links { gap: 13px; flex-wrap: wrap; }
        }
      `}</style>

      <header className="ce-container ce-topbar">
        <a className="ce-logo" href="#top" aria-label="Back to top">CE<span>↗</span></a>
        <button className="ce-nav-toggle" type="button" onClick={() => setMenuOpen((value) => !value)} aria-expanded={menuOpen} aria-controls="primary-navigation">
          {menuOpen ? "Close" : "Index"}
        </button>
        <nav id="primary-navigation" className={`ce-nav ${menuOpen ? "is-open" : ""}`} aria-label="Primary navigation">
          <a href="#work" onClick={() => setMenuOpen(false)}>Work</a>
          <a href="#experiments" onClick={() => setMenuOpen(false)}>Experiments</a>
          <a href="#notes" onClick={() => setMenuOpen(false)}>Notes</a>
          <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
        </nav>
      </header>

      <section className="ce-container ce-hero" id="top" aria-labelledby="hero-title">
        <div className="ce-hero-copy">
          <span className="ce-eyebrow">Software engineering · systems · product · curiosity</span>
          <h1 id="hero-title">I like understanding <em>how things work.</em></h1>
          <p className="ce-hero-support">Software engineer interested in systems, products, and the space between the two.</p>
        </div>
        <div className="ce-hero-index">
          <strong>01 / 08</strong>
          <span>an independent notebook</span>
          <span>built in the open</span>
          <span>updated occasionally</span>
        </div>
        <SystemMark />
      </section>

      <div className="ce-container"><hr className="ce-rule" /></div>

      <section className="ce-container ce-section" id="work" aria-labelledby="work-title">
        <div className="ce-section-heading">
          <h2 id="work-title">Selected<br /><em>work.</em></h2>
          <p>The pieces where the question mattered as much as the answer.</p>
        </div>
        <article className="ce-feature">
          <div className="ce-feature-intro">
            <div>
              <span className="ce-label">01 / Flagship concept</span>
              <h3>TECTONIC</h3>
              <div className="ce-work-meta">
                <span>Role <b>Software engineer / builder</b></span>
                <span>Topics <b>Data · interaction · systems</b></span>
              </div>
            </div>
            <div>
              <p className="ce-feature-deck">What happens when geology becomes an interface?</p>
              <p className="ce-hero-support" style={{ margin: "24px 0 0", fontSize: "15px", maxWidth: "390px" }}>An interactive exploration of tectonic plates designed to make a geological system intuitive and explorable.</p>
            </div>
          </div>
          <TectonicMap />
          <div className="ce-case-study">
            <div className="ce-case-step"><span>01 — QUESTION</span><h4>Make the invisible legible.</h4><p>How do you communicate a dynamic geological system through an interface?</p></div>
            <div className="ce-case-step"><span>02 — THINKING</span><h4>Let the model stay alive.</h4><p>Boundaries, movement, and relationships should be things you can inspect.</p></div>
            <div className="ce-case-step"><span>03 — ENGINEERING</span><h4>Data → API → view.</h4><p>A simple architecture keeps the visual layer curious instead of brittle.</p></div>
            <div className="ce-case-step"><span>04 — REFLECTION</span><h4>Good tools invite a second question.</h4><p>The result is less a map than a way into the map.</p></div>
          </div>
          <a className="ce-cta-link" href="#tectonic-notes">Read the thinking <span>↗</span></a>
        </article>

        <div id="tectonic-notes" style={{ marginTop: "124px" }}>
          <div className="ce-section-heading" style={{ marginBottom: "35px" }}>
            <h2 style={{ fontSize: "clamp(39px, 5vw, 66px)" }}>Professional<br /><em>work.</em></h2>
            <p>Space reserved for the work that cannot be responsibly summarized until the details are in.</p>
          </div>
          <div className="ce-placeholder-list">
            {workPlaceholders.map((item) => (
              <article className="ce-placeholder-item" key={item.index}>
                <span className="ce-placeholder-index">{item.index}</span>
                <div><h3>{item.title}</h3><span className="ce-placeholder-company">{item.company}</span></div>
                <p className="ce-placeholder-note">{item.note}</p>
                <span className="ce-placeholder-label">{item.label}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ce-section ce-section-alt" id="experiments" aria-labelledby="experiments-title">
        <div className="ce-container">
          <div className="ce-section-heading">
            <h2 id="experiments-title">Things I build<br /><em>because I’m curious.</em></h2>
            <p>Small, unfinished, and occasionally useful. The point is following the thread.</p>
          </div>
          <div className="ce-experiment-grid">
            {experiments.map((experiment) => (
              <button className="ce-experiment" type="button" key={experiment.number} onClick={() => window.alert(`${experiment.title} — details will live here.`)}>
                <span className="ce-experiment-number">{experiment.number}</span>
                <h3>{experiment.title}</h3>
                <span className="ce-experiment-tag">{experiment.tag}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="ce-container ce-section" id="notes" aria-labelledby="notes-title">
        <div className="ce-section-heading">
          <h2 id="notes-title">Things I’ve been<br /><em>thinking about.</em></h2>
          <p>A notebook for the questions that survive the walk home.</p>
        </div>
        <div className="ce-notes-grid">
          {visibleNotes.map((note) => (
            <article className="ce-note" key={note.title}>
              <div className="ce-note-meta"><span>{note.date}</span>{note.category}</div>
              <h3>{note.title}</h3>
              <p className="ce-note-copy">{note.copy}</p>
              <span className="ce-note-arrow" aria-hidden="true">↗</span>
            </article>
          ))}
        </div>
        {!showMoreNotes && <button className="ce-text-button" type="button" onClick={() => setShowMoreNotes(true)}>Open the notebook +</button>}
      </section>

      <section className="ce-container ce-section" aria-labelledby="principles-title">
        <div className="ce-principles-layout">
          <div className="ce-principles-intro">
            <span className="ce-label">A working model</span>
            <h2 id="principles-title">How<br />I think.</h2>
            <p>Not skills. Not a methodology. Just a few lenses I keep reaching for.</p>
          </div>
          <div className="ce-principle-list">
            {principles.map((principle) => (
              <article className={`ce-principle ${activePrinciple === principle.key ? "is-active" : ""}`} key={principle.key} onClick={() => setActivePrinciple(activePrinciple === principle.key ? "" : principle.key)}>
                <div className="ce-principle-header">
                  <span className="ce-principle-number">{principle.number}</span>
                  <h3>{principle.title}</h3>
                  <span className="ce-principle-plus" aria-hidden="true">+</span>
                </div>
                <p className="ce-principle-statement">{principle.statement}</p>
                <p className="ce-principle-detail">{principle.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ce-container ce-section" id="about" aria-labelledby="about-title">
        <div className="ce-about">
          <div><span className="ce-label">A little context</span><h2 id="about-title">About<br /><em>the person.</em></h2></div>
          <div className="ce-about-copy">
            <p>I’m a software engineer who enjoys understanding systems — especially the messy space where technology meets people.</p>
            <p>Most of my professional life is spent building software. Outside of work, I tend to disappear down rabbit holes: products, technology, culture, maps, coffee, books, and occasionally ideas that have absolutely no reason to become software.</p>
            <p>Some of them do anyway.</p>
            <div className="ce-links">
              <a href="https://github.com" target="_blank" rel="noreferrer">GitHub ↗</a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer">LinkedIn ↗</a>
              <a href="mailto:[email]">Email ↗</a>
              <a href="#resume">Résumé ↗</a>
            </div>
          </div>
        </div>
      </section>

      <section className="ce-container ce-section" style={{ paddingTop: 0 }} id="currently" aria-labelledby="currently-title">
        <div className="ce-currently">
          <h2 className="ce-currently-title" id="currently-title">Currently<span style={{ color: "var(--accent)" }}>.</span></h2>
          <div className="ce-currently-cell"><span className="ce-currently-label">Building</span><p>[Current project]</p></div>
          <div className="ce-currently-cell"><span className="ce-currently-label">Learning</span><p>[Current topic]</p></div>
          <div className="ce-currently-cell"><span className="ce-currently-label">Reading</span><p>[Current book]</p></div>
          <div className="ce-currently-cell"><span className="ce-currently-label">Thinking about</span><p>[Current question]</p></div>
        </div>
      </section>

      <footer className="ce-container ce-footer" id="resume">
        <h2>Still <em>curious.</em></h2>
        <div className="ce-footer-bottom">
          <div className="ce-footer-links">
            <a href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a>
            <a href="mailto:[email]">Email</a>
            <a href="#resume">Résumé</a>
          </div>
          <span className="ce-footer-meta">© {new Date().getFullYear()} / CE / SOMEWHERE BETWEEN SYSTEMS</span>
        </div>
      </footer>
    </main>
  );
}