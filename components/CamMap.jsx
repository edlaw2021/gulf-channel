'use client';
import { useState } from 'react';
import Modal from './Modal';

// Same abstract county-shape + pin approach as the prototype: an SVG
// polygon standing in for the real coastline, with pins positioned by
// each camera's map_x/map_y. Swap the path for real geography and
// lat/lng-to-SVG projection once you have exact camera locations.
export default function CamMap({ cameras }) {
  const [selected, setSelected] = useState(null);

  const countyOutline = 'M40,60 L520,30 L560,180 L500,300 L420,420 L180,440 L60,340 L20,180 Z';

  return (
    <div className="map-wrap">
      <div className="map-panel">
        <svg className="map-svg" viewBox="0 0 600 460">
          <rect width="600" height="460" fill="#C9DEDA" />
          <path d={countyOutline} fill="#F3ECDC" stroke="#DCD1B4" strokeWidth="1.5" />
          {cameras.map(cam => (
            <g
              key={cam.id}
              className="map-pin"
              transform={`translate(${cam.map_x},${cam.map_y})`}
              opacity={cam.status === 'offline' ? 0.4 : 1}
              onClick={() => setSelected(cam)}
            >
              <circle r="6" fill={cam.status === 'offline' ? '#8C9690' : '#2C7A75'} />
              <circle r="6" fill="none" stroke="#FAF6EC" strokeWidth="1.5" />
              <text x="9" y="4">{cam.name}</text>
            </g>
          ))}
        </svg>
      </div>
      <div className="detail-panel">
        {selected ? (
          <>
            <div className="feed" style={{ aspectRatio: '16/10', borderRadius: 8, overflow: 'hidden' }}>
              {selected.embed_url
                ? <iframe className="live-embed" src={selected.embed_url} title={selected.name} allow="autoplay" />
                : <div className="feed-scene" />}
            </div>
            <div className="cam-name">{selected.name}</div>
            <div className="cam-loc">{selected.loc}</div>
          </>
        ) : (
          <div className="agenda-empty">Select a pin on the map to preview a feed</div>
        )}
      </div>
    </div>
  );
}
