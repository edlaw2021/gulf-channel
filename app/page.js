import { getTowns, getCameras, getVenues, getEventsForWeek, getWeatherCache } from '@/lib/queries';
import HomeClient from '@/components/HomeClient';
export const dynamic = 'force-dynamic';

// Server component: all initial data is fetched here, server-side, before
// anything reaches the browser. Filtering/view-toggling/week-nav state then
// lives in HomeClient (a client component), which starts from this data.
function mondayOfCurrentWeek() {
  const d = new Date();
  const day = (d.getDay() + 6) % 7; // Mon=0..Sun=6
  d.setDate(d.getDate() - day);
  return d.toISOString().slice(0, 10);
}

export default async function HomePage() {
  const week = mondayOfCurrentWeek();
  const [towns, cameras, venues, events, weather] = await Promise.all([
    getTowns(),
    getCameras(null),
    getVenues(null),
    getEventsForWeek(week, null),
    getWeatherCache(),
  ]);

  return (
    <HomeClient
      towns={towns}
      cameras={cameras}
      venues={venues}
      events={events}
      weather={weather}
      initialWeekStart={week}
    />
  );
}
