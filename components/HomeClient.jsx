'use client';
import { useEffect, useRef, useState } from 'react';
import TownPills from './TownPills';
import CategoryPills from './CategoryPills';
import CamGrid from './CamGrid';
import CamMap from './CamMap';
import EpgTable from './EpgTable';
import EpgMobileAgenda from './EpgMobileAgenda';
import WeekNav from './WeekNav';

function addDays(dateStr, days) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export default function HomeClient({ towns, cameras, venues, events: initialEvents, weather, initialWeekStart }) {
  const [activeTown, setActiveTown] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [view, setView] = useState('grid');
  const [weekStart, setWeekStart] = useState(initialWeekStart);
  const [events, setEvents] = useState(initialEvents);
  const contentRef = useRef(null);

  const cacheRef = useRef({ [initialWeekStart]: initialEvents });

  async function fetchWeek(weekStr) {
    if (cacheRef.current[weekStr]) return cacheRef.current[weekStr];
    const res = await fetch(`/api/events?week=${weekStr}`);
    if (!res.ok) return null;
    const data = await res.json();
    cacheRef.current[weekStr] = data;
    return data;
  }

  function prefetchNextWeek(fromWeek) {
    const next = addDays(fromWeek, 7);
    if (!cacheRef.current[next]) {
      fetchWeek(next);
    }
  }

  useEffect(() => {
    prefetchNextWeek(initialWeekStart);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredCameras = cameras.filter(c =>
    (!activeTown || c.town_id === activeTown) &&
    (!activeCategory || c.category === activeCategory)
  );
  const filteredVenues = venues.filter(v => !activeTown || v.town_id === activeTown);
  const filteredEvents = events.filter(e => filteredVenues.some(v => v.id === e.venue_id));

  async function changeWeek(delta) {
    const newWeek = addDays(weekStart, delta * 7);
    setWeekStart(newWeek);

    const cached = cacheRef.current[newWeek];
    if (cached) {
      setEvents(cached);
    } else {
      const data = await fetchWeek(newWeek);
      if (data) setEvents(data);
    }

    prefetchNextWeek(newWeek);
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
          <div className="music-heading" style={{ display: 'flex', flexDirection: 'column', marginBottom: '0.9rem' }}>
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
