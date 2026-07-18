'use client';
import { useState } from 'react';

// Same circular initials + custom tooltip pattern from the prototype —
// works on hover (desktop) and tap (mobile) without relying on the
// native `title` attribute, which touch devices mostly ignore.
export default function TownPills({ towns, onSelect }) {
  const [active, setActive] = useState('all');
  const [tooltip, setTooltip] = useState(null);

  function select(id) {
    setActive(id);
    onSelect?.(id === 'all' ? null : id);
  }

  const all = [{ id: 'all', name: 'All Towns', initials: 'ALL', color: '#1C3B45' }, ...towns];

  return (
    <div className="pills" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      {all.map(t => (
        <div key={t.id} style={{ position: 'relative' }}
          onMouseEnter={() => setTooltip(t.id)} onMouseLeave={() => setTooltip(null)}>
          <button
            className={`town-circle${active === t.id ? ' active' : ''}`}
            style={{ '--town-color': t.color }}
            onClick={() => { select(t.id); setTooltip(t.id); setTimeout(() => setTooltip(null), 1400); }}
          >
            {t.initials}
          </button>
          {tooltip === t.id && <span className="town-tooltip show">{t.name}</span>}
        </div>
      ))}
    </div>
  );
}
