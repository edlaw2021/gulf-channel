'use client';
import { useState } from 'react';
import Modal from './Modal';

// Full version: hover-to-play, refresh button, click-catcher (so a click
// opens the detail modal instead of hitting the embedded player's own
// controls), status/flag badges, and water/air temp chips looked up from
// the weather cache by town.

// Derives a real preview image from the camera's own embed source, rather
// than a flat placeholder gradient — WetMet exposes a separate snapshot
// endpoint alongside their video widget, and YouTube auto-generates
// thumbnails for any video at a predictable URL. Falls back to the
// gradient scene when neither pattern matches.
function getThumbnailUrl(cam) {
  if (!cam.embed_url) return null;
  const wetmetMatch = cam.embed_url.match(/wetmet\.net\/widgets\/stream\/frame\.php\?uid=([a-f0-9]+)/);
  if (wetmetMatch) {
    return `https://api.wetmet.net/widgets/image/frame.php?uid=${wetmetMatch[1]}&type=image&format=image.jpg`;
  }
  const youtubeMatch = cam.embed_url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
  if (youtubeMatch) {
    return `https://img.youtube.com/vi/${youtubeMatch[1]}/hqdefault.jpg`;
  }
  return null;
}

export default function CamGrid({ cameras, weather = [] }) {
  const [hoveredId, setHoveredId] = useState(null);
  const [selected, setSelected] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  function weatherFor(townId) {
    return weather.find(w => w.town_id === townId);
  }

  return (
    <>
      <div id="grid-view">
        {cameras.map(cam => {
          const w = weatherFor(cam.town_id);
          const thumb = getThumbnailUrl(cam);
          return (
            <div key={cam.id} className={`cam-card${cam.status === 'offline' ? ' offline' : ''}`}>
              <div
                className="feed"
                onMouseEnter={() => setHoveredId(cam.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {cam.status === 'offline' ? (
                  <div className="static-bg" />
                ) : cam.embed_url && hoveredId === cam.id ? (
                  <iframe
                    key={refreshKey}
                    className="live-embed"
                    src={cam.embed_url}
                    title={`${cam.name} live feed`}
                    allow="autoplay"
                  />
                ) : (
                  <div
                    className="feed-scene"
                    style={thumb ? { backgroundImage: `url(${thumb})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
                  />
                )}

                {cam.embed_url && (
                  <div className="click-catcher" onClick={() => setSelected(cam)} />
                )}

                <div className="rec-badge">
                  <span className="rec-dot" />
                  {cam.status === 'online' ? 'LIVE' : 'OFFLINE'}
                </div>
                <div className="cam-id">{cam.id}</div>

                {cam.embed_url && hoveredId === cam.id && (
                  <button
                    className="refresh-btn"
                    onClick={e => { e.stopPropagation(); setRefreshKey(k => k + 1); }}
                  >
                    ↻
                  </button>
                )}

                {cam.source && <div className="source-badge">via {cam.source}</div>}
                {cam.flag && <div className="flag-badge" style={{ background: flagColor(cam.flag) }} />}

                {(w?.air_temp || w?.water_temp) && (
                  <div style={{ position: 'absolute', bottom: 8, right: 8, display: 'flex', gap: 4 }}>
                    {w.air_temp && <span className="temp-chip">☀ {Math.round(w.air_temp)}°</span>}
                    {w.water_temp && <span className="temp-chip">💧 {Math.round(w.water_temp)}°</span>}
                  </div>
                )}
              </div>
              <div className="cam-meta">
                <div className="cam-name">{cam.name}</div>
                <div className="cam-loc">{cam.loc}</div>
              </div>
            </div>
          );
        })}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)}>
        {selected && (
          <>
            <div className="feed" style={{ aspectRatio: '16/9', marginBottom: '0.9rem' }}>
              <iframe className="live-embed" src={selected.embed_url} title={selected.name} allow="autoplay" />
            </div>
            <div className="modal-title">{selected.name}</div>
            <div className="modal-cat">{selected.loc}</div>
            {selected.source && <div className="modal-row"><span>Source</span><span>{selected.source}</span></div>}
          </>
        )}
      </Modal>
    </>
  );
}

function flagColor(flag) {
  return { green: '#4C8C5C', yellow: '#E0A62E', red: '#C1272D', purple: '#6B4C93' }[flag] || '#4C8C5C';
}
