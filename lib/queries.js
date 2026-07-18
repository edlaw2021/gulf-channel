// All the shaped queries the app needs. API routes call these instead of
// writing raw SQL inline — keeps the actual query logic in one place.
import { query } from './db';

export async function getTowns() {
  const { rows } = await query('SELECT * FROM towns ORDER BY sort_order');
  return rows;
}

export async function getCameras(townId) {
  const { rows } = await query(
    `SELECT * FROM cameras WHERE ($1::text IS NULL OR town_id = $1) ORDER BY name`,
    [townId || null]
  );
  return rows;
}

export async function getVenues(townId) {
  const { rows } = await query(
    `SELECT * FROM venues WHERE ($1::text IS NULL OR town_id = $1) ORDER BY name`,
    [townId || null]
  );
  return rows;
}

// The query that replaces the old day-of-week template: real events for a
// real 7-day window, optionally narrowed to one town.
export async function getEventsForWeek(startDate, townId) {
  const { rows } = await query(
    `SELECT e.*, v.name AS venue_name, v.accent_color, v.logo_url, v.town_id
     FROM events e
     JOIN venues v ON v.id = e.venue_id
     WHERE e.date BETWEEN $1::date AND $1::date + 6
       AND ($2::text IS NULL OR v.town_id = $2)
     ORDER BY e.date, e.start_time`,
    [startDate, townId || null]
  );
  return rows;
}

export async function addEvent({ venueId, date, startTime, endTime, performerName, actType }) {
  const { rows } = await query(
    `INSERT INTO events (venue_id, date, start_time, end_time, performer_name, act_type, source, verified_at)
     VALUES ($1, $2, $3, $4, $5, $6, 'manual', now())
     RETURNING *`,
    [venueId, date, startTime, endTime, performerName, actType]
  );
  return rows[0];
}

export async function getWeatherCache() {
  const { rows } = await query('SELECT * FROM weather_cache');
  return rows;
}
