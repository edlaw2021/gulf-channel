// Meant to run on a schedule (e.g. a Vercel Cron Job hitting a small API
// route every 15-30 min), NOT on every page load. Polls upstream sources
// once, writes the result to weather_cache, and every page load just reads
// that cache — keeps the site fast and avoids hammering NOAA/a weather API.
import { query } from './db';

export async function refreshWeatherForTown(townId, lat, lng) {
  // TODO: replace with real calls —
  //   - Air temp: National Weather Service API (api.weather.gov), free, no key
  //   - Water temp: NOAA CO-OPS API, matched to the nearest station per town
  const airTemp = null;
  const waterTemp = null;

  await query(
    `INSERT INTO weather_cache (town_id, air_temp, water_temp, updated_at)
     VALUES ($1, $2, $3, now())
     ON CONFLICT (town_id) DO UPDATE
       SET air_temp = $2, water_temp = $3, updated_at = now()`,
    [townId, airTemp, waterTemp]
  );
}
