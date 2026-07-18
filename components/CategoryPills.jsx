'use client';
import { useState } from 'react';

const categories = [
  { id: 'all', label: 'All' },
  { id: 'beach', label: 'Beaches' },
  { id: 'pier', label: 'Piers & Fishing' },
  { id: 'ramp', label: 'Boat Ramps' },
  { id: 'dune', label: 'Trails & Dunes' },
  { id: 'boardwalk', label: 'Boardwalk' },
];

export default function CategoryPills({ onSelect }) {
  const [active, setActive] = useState('all');
  return (
    <div className="pills pills-right">
      {categories.map(c => (
        <button
          key={c.id}
          className={`pill${active === c.id ? ' active' : ''}`}
          onClick={() => { setActive(c.id); onSelect?.(c.id === 'all' ? null : c.id); }}
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}
