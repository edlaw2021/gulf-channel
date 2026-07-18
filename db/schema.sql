-- Gulf Channel schema
-- Run this once against a fresh Postgres database (Supabase/Neon/Railway all
-- give you a SQL editor or a connection string you can run this against with
-- psql). Order matters because of foreign keys.

CREATE TABLE towns (
  id          TEXT PRIMARY KEY,        -- slug, e.g. 'madeira-beach'
  name        TEXT NOT NULL,           -- display name, e.g. 'Madeira Beach'
  initials    TEXT NOT NULL,           -- e.g. 'MB' — used for the map/pill badges
  color       TEXT NOT NULL,           -- hex accent color for this town
  sort_order  INT NOT NULL             -- north-to-south order along Gulf Blvd
);

CREATE TABLE venues (
  id            TEXT PRIMARY KEY,
  town_id       TEXT NOT NULL REFERENCES towns(id),
  name          TEXT NOT NULL,
  address       TEXT,
  category      TEXT,                 -- e.g. 'Tiki beach bar & live music'
  rating        NUMERIC(2,1),
  hours         TEXT,
  logo_url      TEXT,
  accent_color  TEXT,
  initials      TEXT
);

CREATE TABLE cameras (
  id          TEXT PRIMARY KEY,
  town_id     TEXT NOT NULL REFERENCES towns(id),
  name        TEXT NOT NULL,
  loc         TEXT,
  category    TEXT NOT NULL,          -- 'beach' | 'pier' | 'ramp' | 'dune' | 'boardwalk'
  status      TEXT NOT NULL DEFAULT 'online',
  embed_url   TEXT,                   -- null = uses a placeholder scene, not a real feed
  source      TEXT,                   -- attribution, e.g. 'FOX13 Tampa Bay via WetMet'
  flag        TEXT,                   -- beach-conditions flag color, if applicable
  map_x       INT,
  map_y       INT
);

-- The table that actually fixes the "Kid Royal plays forever every Monday"
-- problem: real calendar dates instead of a repeating day-of-week template.
CREATE TABLE events (
  id              SERIAL PRIMARY KEY,
  venue_id        TEXT NOT NULL REFERENCES venues(id),
  date            DATE NOT NULL,
  start_time      TIME,
  end_time        TIME,
  performer_name  TEXT NOT NULL,
  act_type        TEXT CHECK (act_type IN ('solo','duo','band')),
  source          TEXT DEFAULT 'manual',   -- 'manual' | 'scraped' | 'venue-provided'
  verified_at     TIMESTAMPTZ
);
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_venue ON events(venue_id);

-- Polled on a schedule by lib/weatherJob.js — the site always reads from here,
-- never hits NOAA/a weather API directly on page load.
CREATE TABLE weather_cache (
  town_id     TEXT PRIMARY KEY REFERENCES towns(id),
  water_temp  NUMERIC,
  air_temp    NUMERIC,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
