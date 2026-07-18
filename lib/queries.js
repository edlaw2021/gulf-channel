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

// Performers are just an identity (name) to reuse across bookings — act_type
// is NOT here, because the same act can perform solo one night and as a
// full band another (e.g. an artist who plays solo with a looper pedal
// some shows, and as a trio under the same name other shows). That varies
// per booking, so it lives on `events`, not on the performer.
export async function getPerformers() {
  const { rows } = await query('SELECT * FROM performers ORDER BY name');
  return rows;
}

export async function addPerformer({ name }) {
  const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const { rows } = await query(
    `INSERT INTO performers (id, name) VALUES ($1, $2)
     ON CONFLICT (id) DO UPDATE SET name = $2
     RETURNING *`,
    [id, name]
  );
  return rows[0];
}

// The query that replaces the old day-of-week template: real events for a
// real 7-day window, optionally narrowed to one town.
export async function getEventsForWeek(startDate, townId) {
  const { rows } = await query(
    `SELECT e.id, e.venue_id, e.date, e.start_time, e.end_time, e.act_type, e.source, e.verified_at,
            p.name AS performer_name,
            v.name AS venue_name, v.accent_color, v.logo_url, v.town_id
     FROM events e
     JOIN performers p ON p.id = e.performer_id
     JOIN venues v ON v.id = e.venue_id
     WHERE e.date BETWEEN $1::date AND $1::date + 6
       AND ($2::text IS NULL OR v.town_id = $2)
     ORDER BY e.date, e.start_time`,
    [startDate, townId || null]
  );
  return rows.map(row => ({
    ...row,
    date: row.date instanceof Date ? row.date.toISOString().slice(0, 10) : row.date,
  }));
}

export async function addEvent({ venueId, performerId, actType, date, startTime, endTime }) {
  const { rows } = await query(
    `INSERT INTO events (venue_id, performer_id, act_type, date, start_time, end_time, source, verified_at)
     VALUES ($1, $2, $3, $4, $5, $6, 'manual', now())
     RETURNING *`,
    [venueId, performerId, actType, date, startTime, endTime]
  );
  return rows[0];
}

export async function getWeatherCache() {
  const { rows } = await query('SELECT * FROM weather_cache');
  return rows;
}
