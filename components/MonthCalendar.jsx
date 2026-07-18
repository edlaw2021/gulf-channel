'use client';
import { useState } from 'react';
import Link from 'next/link';
import { formatTimeRange } from '@/lib/format';

export default function MonthCalendar({ events }) {
  const [monthOffset, setMonthOffset] = useState(0);

  const today = new Date();
  const viewDate = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const startWeekday = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayStr = today.toISOString().slice(0, 10);

  const eventsByDate = {};
  events.forEach(e => {
    const key = e.date.slice(0, 10);
    (eventsByDate[key] = eventsByDate[key] || []).push(e);
  });

  const cells = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const monthLabel = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="cal-wrap">
      <div className="cal-header">
        <button className="week-nav-btn" onClick={() => setMonthOffset(m => m - 1)}>‹</button>
        <div className="cal-month-label">{monthLabel}</div>
        <button className="week-nav-btn" onClick={() => setMonthOffset(m => m + 1)}>›</button>
      </div>
      <div className="cal-grid">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
          <div key={d} className="cal-dow">{d}</div>
        ))}
        {cells.map((d, i) => {
          if (!d) return <div key={`empty-${i}`} className="cal-cell cal-empty" />;
          const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
          const dayEvents = eventsByDate[dateKey] || [];
          return (
            <div key={dateKey} className={`cal-cell${dateKey === todayStr ? ' cal-today' : ''}`}>
              <div className="cal-daynum">{d}</div>
              {dayEvents.length > 0 && (
                <div className="gig-stack">
                  {dayEvents.map(ev => (
                    <Link key={ev.id} href={ev.linkHref} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <div className="gig">
                        <div className="gig-performer">{ev.linkLabel}</div>
                        <div className="gig-time">{formatTimeRange(ev.start_time, ev.end_time)}</div>
                        <span className="gig-type">{ev.act_type}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {events.length === 0 && <div className="agenda-empty" style={{ marginTop: '0.8rem' }}>No shows on record yet</div>}
    </div>
  );
}
