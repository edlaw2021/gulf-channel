'use client';
import { useRef, useState } from 'react';

// Same two-phase slide (out, swap data, in) as the prototype — CSS
// transitions alone can't animate this because the underlying data
// actually changes between weeks, not just its position.
export default function WeekNav({ weekStart, onChangeWeek, contentRef }) {
  const [animating, setAnimating] = useState(false);
  const start = new Date(weekStart);
  const end = new Date(weekStart);
  end.setDate(end.getDate() + 6);
  const label = `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;

  function go(delta) {
    if (animating || !contentRef?.current) return;
    setAnimating(true);
    const el = contentRef.current;
    const outClass = delta > 0 ? 'slide-out-left' : 'slide-out-right';
    const inClass = delta > 0 ? 'slide-in-prep-left' : 'slide-in-prep-right';
    el.classList.add(outClass);
    setTimeout(() => {
      onChangeWeek(delta);
      el.classList.remove(outClass);
      el.classList.add(inClass);
      void el.offsetWidth;
      el.classList.remove(inClass);
      setTimeout(() => setAnimating(false), 300);
    }, 280);
  }

  return (
    <div className="week-nav">
      <button className="week-nav-btn" onClick={() => go(-1)}>‹</button>
      <div className="music-week">{label}</div>
      <button className="week-nav-btn" onClick={() => go(1)}>›</button>
    </div>
  );
}
