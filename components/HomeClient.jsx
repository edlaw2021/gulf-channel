'use client';
import { useRef, useState } from 'react';
import TownPills from './TownPills';
import CategoryPills from './CategoryPills';
import CamGrid from './CamGrid';
import CamMap from './CamMap';
import EpgTable from './EpgTable';
import EpgMobileAgenda from './EpgMobileAgenda';
import WeekNav from './WeekNav';

// Client-side orchestrator: holds filter + week state, and filters the
// already-fetched data in memory. For a dataset this size that's simpler
// and faster than re-querying the API on every pill click — if the number
// of cameras/events grows a lot, swap this for server-side filtering via
// API query params instead (the routes already support ?town=).
function addDays(dateStr, days) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export default function HomeClient({ towns, cameras, venues, events, weather, initialWeekStart }) {
  const [activeTown, setActiveTown] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [view, setView] = useState('grid');
  const [weekStart, setWeekStart] = useState(initialWeekStart);
  const contentRef = useRef(null);

  const filteredCameras = cameras.filter(c =>
    (!activeTown || c.town_id === activeTown) &&
    (!activeCategory || c.category === activeCategory)
  );
  const filteredVenues = venues.filter(v => !activeTown || v.town_id === activeTown);
  const filteredEvents = events.filter(e => filteredVenues.some(v => v.id === e.venue_id));

  function changeWeek(delta) {
    setWeekStart(prev => addDays(prev, delta * 7));
    // NOTE: this scaffold doesn't re-fetch events for the new week yet —
    // wire this up to `fetch('/api/events?week=' + newWeek)` and setEvents()
    // once you're pulling from a growing events table instead of the initial
    // server-rendered week.
  }

  return (
    <>
      <div className="controls">
        <TownPills towns={towns} onSelect={setActiveTown} />
      </div>
      <div className="controls" style={{ justifyContent: 'flex-end' }}>
        <div className="right-col">
          <div className="view-toggle">
            <button className={view === 'grid' ? 'active' : ''} onClick={() => setView('grid')}>Grid</button>
            <button className={view === 'map' ? 'active' : ''} onClick={() => setView('map')}>Map</button>
          </div>
          <CategoryPills onSelect={setActiveCategory} />
        </div>
      </div>

      <main>
        {view === 'grid'
          ? <CamGrid cameras={filteredCameras} weather={weather} />
          : <CamMap cameras={filteredCameras} />}

        <section className="music-section">
          <div className="music-heading" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.9rem' }}>
            <div className="music-title" style={{ fontFamily: 'var(--display)', fontWeight: 600, fontSize: 20 }}>
              Live Music This Week
            </div>
            <WeekNav weekStart={weekStart} onChangeWeek={changeWeek} contentRef={contentRef} />
          </div>

          <div className="epg-clip">
            <div className="epg-week-content" ref={contentRef}>
              <div className="epg-desktop-only">
                <EpgTable events={filteredEvents} venues={filteredVenues} weekStart={weekStart} />
              </div>
              <EpgMobileAgenda events={filteredEvents} weekStart={weekStart} onChangeWeek={changeWeek} />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
