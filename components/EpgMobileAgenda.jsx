'use client';
import { useRef, useState } from 'react';

// Mobile equivalent of EpgTable: one day at a time with a day switcher,
// instead of a 7-column table that needs horizontal scrolling. Includes
// the same swipe-to-change-week gesture from the prototype.
export default function EpgMobileAgenda({ events, weekStart, onChangeWeek }) {
  const [selectedDay, setSelectedDay] = useState(0);
  const touchStart = useRef(null);
  const listRef = useRef(null);

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  const dayStr = days[selectedDay].toISOString().slice(0, 10);
  const venueIds = [...new Set(events.map(e => e.venue_id))];

  function handleTouchStart(e) {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }
  function handleTouchEnd(e) {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      onChangeWeek(dx < 0 ? 1 : -1);
    }
    touchStart.current = null;
  }

  return (
    <div className="epg-mobile">
      <div className="day-switcher">
        {days.map((d, i) => (
          <button key={i} className={`day-btn${selectedDay === i ? ' active' : ''}`} onClick={() => setSelectedDay(i)}>
            <span>{d.toLocaleDateString('en-US', { weekday: 'short' })}</span>
            <span style={{ fontWeight: 600 }}>{d.getDate()}</span>
          </button>
        ))}
      </div>
      <div ref={listRef} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        {venueIds.length === 0 && <div className="agenda-empty">No live music venues in this town yet</div>}
        {venueIds.map(venueId => {
          const venueEvent = events.find(e => e.venue_id === venueId);
          const gigs = events.filter(e => e.venue_id === venueId && e.date.slice(0, 10) === dayStr);
          return (
            <div className="agenda-venue" key={venueId}>
              <div className="agenda-venue-head">
                <div className="agenda-badge" style={{ background: venueEvent.accent_color }}>
                  {venueEvent.venue_name.slice(0, 2).toUpperCase()}
                </div>
                <div className="agenda-venue-name">{venueEvent.venue_name}</div>
              </div>
              {gigs.length ? (
                <div className="agenda-gigs">
                  {gigs.map(g => (
                    <div className="agenda-gig" key={g.id}>
                      <div>
                        <div className="gig-performer">{g.performer_name}</div>
                        <div className="gig-time">{g.start_time?.slice(0, 5)}–{g.end_time?.slice(0, 5)}</div>
                      </div>
                      <span className="gig-type">{g.act_type}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="agenda-empty">No live music this day</div>
              )}
            </div>
          );
        })}
      </div>
      <div style={{ textAlign: 'center', fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-dim)', marginTop: 8 }}>
        ← Swipe for another week →
      </div>
    </div>
  );
}
