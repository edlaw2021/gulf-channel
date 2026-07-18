# The Gulf Channel

Next.js scaffold for the live-cam + local-music-calendar site, backed by
Postgres. This replaces the single-file HTML prototype's hardcoded JS arrays
with a real database, which is what fixes the "Kid Royal plays forever every
Monday" problem — events are now keyed by real calendar dates.

## Setup

1. **Create a Postgres database.** Easiest options: [Supabase](https://supabase.com),
   [Neon](https://neon.tech), or [Railway](https://railway.app) — any of them
   gives you a connection string in a couple of minutes on their free tier.

2. **Run the schema.** Paste the contents of `db/schema.sql` into your
   provider's SQL editor (or run it with `psql "$DATABASE_URL" -f db/schema.sql`).

3. **Seed sample data (optional).** Same idea with `db/seed.sql` — this loads
   the prototype's mock towns/venues/cameras plus Ka'Tiki's one real week of
   bookings, so you have something to look at immediately.

4. **Configure environment variables.**
   ```
   cp .env.local.example .env.local
   ```
   Fill in `DATABASE_URL` with your connection string.

5. **Install and run.**
   ```
   npm install
   npm run dev
   ```
   Visit `http://localhost:3000`.

## What's here vs. what's still a stub

This scaffold proves out the architecture — server fetches data from
Postgres, hands it to components as props, API routes are the only thing
that touch the database — but it is **not** a full port of every feature
from the HTML prototype. Specifically still to bring over:

- The map view (SVG county map + pins)
- The mobile day-agenda + swipe navigation
- Week prev/next with the slide animation
- Category filtering, search
- Venue info modal, camera detail modal
- The refresh button / hover-to-play click-catcher logic (partially stubbed in CamGrid)
- Water/air temp display (the `weather_cache` table and `/api/weather` route
  exist, but nothing renders it yet)
- Most of the component-specific CSS (only the shared design tokens are in
  `globals.css` — see the note at the bottom of that file)

## The weather cache job

`lib/weatherJob.js` is a stub — it's meant to be triggered on a schedule
(e.g. a Vercel Cron Job hitting an API route once every 15–30 minutes) to
poll NOAA/a weather API and write into `weather_cache`. The site should never
call those upstream services directly on a page load.

## Admin

`/admin` is a bare-bones form for adding real bookings (exactly the
Ka'Tiki-lineup-via-text-message workflow) — gated by a single shared
password in `.env.local`, not real authentication. Fine for one person
testing locally; replace before this is reachable by anyone else.
