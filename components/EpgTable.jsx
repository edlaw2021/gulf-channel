'use client';
import { useState } from 'react';
import Modal from './Modal';

// Groups flat event rows (as returned by /api/events) back into a
// venue -> day grid. The date math is trivial now because events carry
// real dates instead of a day-of-week index — this is the piece that
// actually fixes the "Kid Royal plays forever every Monday" bug.
export default function EpgTable({ events, venues, weekStart }) {
  const [selectedVenue, setSelectedVenue] = useState(null);

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  if (!venues.length) {
    return <div className="agenda-empty">No live music venues in this town yet</div>;
  }

  return (
    <>
      <div className="epg-scroll">
        <table className="epg">
          <thead>
            <tr>
              <th className="venue-col">Venue</th>
              {days.map(d => (
                <th key={d.toISOString()}>
                  {d.toLocaleDateString('en-US', { weekday: 'short' })}
                  <span className="th-date">{d.getMonth() + 1}/{d.getDate()}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {venues.map((v, idx) => (
              <tr key={v.id} className={idx % 2 === 0 ? 'row-even' : 'row-odd'}>
                <td className="venue-cell" style={{ borderLeft: `3px solid ${v.accent_color}`, cursor: 'pointer' }}
                  onClick={() => setSelectedVenue(v)}>
                  <div className="venue-name">{v.name}</div>
<div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-mid)', marginTop: 2 }}>
  {v.address ? v.address.split(',').slice(-2, -1)[0]?.trim() : ''}
</div>
                </td>
                {days.map(day => {
                  const dayStr = day.toISOString().slice(0, 10);
                  const gigs = events.filter(e => e.venue_id === v.id && e.date.slice(0, 10) === dayStr);
                  return (
                    <td key={day.toISOString()} className="gig-cell">
                      {gigs.length
                        ? gigs.map(g => (
                            <div className="gig" key={g.id}>
                              <div className="gig-performer">{g.performer_name}</div>
                              <div className="gig-time">{g.start_time?.slice(0, 5)}–{g.end_time?.slice(0, 5)}</div>
                              <span className="gig-type">{g.act_type}</span>
                            </div>
                          ))
                        : <div className="gig-empty">—</div>}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={!!selectedVenue} onClose={() => setSelectedVenue(null)}>
        {selectedVenue && (
          <>
            <div className="modal-title">{selectedVenue.name}</div>
            <div className="modal-cat">{selectedVenue.category}</div>
            <div className="modal-row"><span>Address</span><span>{selectedVenue.address}</span></div>
            <div className="modal-row"><span>Rating</span><span>{selectedVenue.rating} / 5</span></div>
            <div className="modal-row"><span>Hours</span><span>{selectedVenue.hours}</span></div>
          </>
        )}
      </Modal>
    </>
  );
}
