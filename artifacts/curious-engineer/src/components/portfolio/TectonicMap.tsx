import { useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { portfolio } from '@/data/portfolio';

export function TectonicMap() {
  const [activeId, setActiveId] = useState('pacific');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pointer, setPointer] = useState({ x: 50, y: 50 });
  const mapRef = useRef<HTMLDivElement>(null);
  const activePlate = portfolio.plates.find((plate) => plate.id === activeId) ?? portfolio.plates[0];

  function updatePointer(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    setPointer({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    });
  }

  return (
    <div className="ce-map-shell" data-testid="visual-tectonic-map">
      <div className="ce-map-toolbar">
        <span className="ce-map-kicker"><i className="ce-live-dot" /> LIVE MODEL / 01</span>
        <span className="ce-map-coordinates" data-testid="text-active-coordinates">{activePlate.position}</span>
        <div className="ce-map-zoom" aria-label="Map controls">
          <button type="button" aria-label="Zoom out" data-testid="button-zoom-out" onClick={() => setZoom((value) => Math.max(0.85, value - 0.1))}>−</button>
          <span data-testid="text-map-zoom">{Math.round(zoom * 100)}%</span>
          <button type="button" aria-label="Zoom in" data-testid="button-zoom-in" onClick={() => setZoom((value) => Math.min(1.3, value + 0.1))}>+</button>
        </div>
      </div>
      <div
        className="ce-map-canvas"
        ref={mapRef}
        onPointerMove={updatePointer}
        onPointerLeave={() => setHoveredId(null)}
        style={{ '--pointer-x': `${pointer.x}%`, '--pointer-y': `${pointer.y}%` } as CSSProperties}
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
          <path className="ce-boundary ce-boundary-a" d="M92 44 C115 70 106 90 122 108 C140 126 155 142 174 168" />
          <path className="ce-boundary ce-boundary-b" d="M185 33 C177 56 187 68 181 91 C176 112 183 131 194 159" />
          <path className="ce-boundary ce-boundary-c" d="M218 87 C245 92 261 87 282 74 C298 64 310 68 326 76" />
          {portfolio.plates.map((plate) => {
            const isActive = activeId === plate.id;
            const labelX = plate.id === 'antarctic' ? 188 : plate.id === 'pacific' ? 52 : plate.id === 'north-america' ? 132 : plate.id === 'eurasia' ? 246 : plate.id === 'south-america' ? 199 : 239;
            const labelY = plate.id === 'antarctic' ? 182 : plate.id === 'pacific' ? 102 : plate.id === 'north-america' ? 51 : plate.id === 'eurasia' ? 56 : plate.id === 'south-america' ? 120 : 119;
            return (
              <g
                key={plate.id}
                onClick={() => setActiveId(plate.id)}
                onMouseEnter={() => setHoveredId(plate.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`ce-plate-group ${isActive ? 'is-active' : ''} ${hoveredId === plate.id ? 'is-hovered' : ''}`}
                role="button"
                tabIndex={0}
                aria-label={`Select ${plate.name} plate`}
                data-testid={`button-plate-${plate.id}`}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setActiveId(plate.id);
                  }
                }}
              >
                <polygon points={plate.points} fill={plate.fill} />
                <text x={labelX} y={labelY} className="ce-plate-label">{plate.name.split(' ')[0].toUpperCase()}</text>
              </g>
            );
          })}
          <circle className="ce-map-crosshair" cx={(pointer.x / 100) * 340} cy={(pointer.y / 100) * 220} r="5" />
          <line className="ce-map-crosshair-line" x1={(pointer.x / 100) * 340 - 13} x2={(pointer.x / 100) * 340 + 13} y1={(pointer.y / 100) * 220} y2={(pointer.y / 100) * 220} />
          <line className="ce-map-crosshair-line" x1={(pointer.x / 100) * 340} x2={(pointer.x / 100) * 340} y1={(pointer.y / 100) * 220 - 13} y2={(pointer.y / 100) * 220 + 13} />
        </svg>
        <div className="ce-map-cursor-note">MOVE THROUGH THE SYSTEM</div>
        <div className="ce-map-tooltip" data-testid="status-active-plate">
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