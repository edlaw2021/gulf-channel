'use client';
import Link from 'next/link';
import { formatTimeRange } from '@/lib/format';

export default function EpgTable({ events, venues, weekStart }) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  if (!venues.length) {
    return <div className="agenda-empty">No live music venues in this town yet</div>;
  }

  return (
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
              <td className="venue-cell" style={{ borderLeft: `3px solid ${v.accent_color}` }}>
                <Link href={`/venues/${v.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="venue-name">{v.name}</div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-mid)', marginTop: 2 }}>
                    {v.address ? v.address.split(',').slice(-2, -1)[0]?.trim() : ''}
                  </div>
                </Link>
              </td>
              {days.map(day => {
                const dayStr = day.toISOString().slice(0, 10);
                const gigs = events.filter(e => e.venue_id === v.id && e.date.slice(0, 10) === dayStr);
                return (
                  <td key={day.toISOString()} className="gig-cell">
                    {gigs.length
                      ? gigs.map(g => (
                          <div className="gig" key={g.id}>
                            <div className="gig-performer">
                              <Link href={`/performers/${g.performer_id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                                {g.performer_name}
                              </Link>
                            </div>
                            <div className="gig-time">{formatTimeRange(g.start_time, g.end_time)}</div>
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
  );
}
