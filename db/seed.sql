-- Sample seed data, carried over from the prototype's hardcoded arrays.
-- Good for local testing; replace with real data before this goes live.

INSERT INTO towns (id, name, initials, color, sort_order) VALUES
  ('clearwater-beach',    'Clearwater Beach',    'CB',  '#2C7A75', 1),
  ('indian-rocks-beach',  'Indian Rocks Beach',  'IRB', '#CC6B49', 2),
  ('indian-shores',       'Indian Shores',       'IS',  '#7A8B4F', 3),
  ('the-redingtons',      'The Redingtons',      'TR',  '#E0A62E', 4),
  ('madeira-beach',       'Madeira Beach',       'MB',  '#6B4C93', 5),
  ('treasure-island',     'Treasure Island',     'TI',  '#5C8DBF', 6),
  ('st-pete-beach',       'St Pete Beach',       'STP', '#B5541F', 7);

INSERT INTO venues (id, town_id, name, address, category, rating, hours, logo_url, accent_color, initials) VALUES
  ('crabby-bills', 'indian-rocks-beach', 'Crabby Bill''s', '401 Gulf Blvd, Indian Rocks Beach, FL', 'Seafood restaurant & bar', 4.3, '11am – 11pm', NULL, '#CC6B49', 'CB'),
  ('ricky-ts', 'madeira-beach', 'Ricky T''s', 'Gulf Blvd, Madeira Beach, FL', 'Bar & grill, live music venue', 4.5, '11am – 2am', NULL, '#2C7A75', 'RT'),
  ('saltwater-hippie', 'madeira-beach', 'Saltwater Hippie', '104 Gulf Blvd, Redington Beach, FL', 'Beach bar & live music', 4.6, '12pm – 12am', 'https://www.saltwaterhippie.com/uploads/b/b7a242d0-f43f-11e9-8879-0fa33be52c44/icon_180x180_ios_MjY0OT.png?width=144', '#6B4C93', 'SH'),
  ('hurricane-eddies-cb', 'clearwater-beach', 'Hurricane Eddie''s', '483 Mandalay Ave. Suite 118, Clearwater Beach, FL', 'Sports bar & grill', 4.2, '11am – 3am', 'https://hurricaneeddies.com/wp-content/uploads/2020/06/cropped-alogotest-130x134.png', '#2E6F8E', 'HE'),
  ('hurricane-eddies-irb', 'indian-rocks-beach', 'Hurricane Eddie''s', '1407 Gulf Blvd, Indian Rocks Beach, FL', 'Sports bar & grill', 4.0, '10am – 2am', 'https://hurricaneeddies.com/wp-content/uploads/2020/06/cropped-alogotest-130x134.png', '#2E6F8E', 'HE'),
  ('katiki', 'treasure-island', 'Ka''Tiki Sunset Beach', '8803 W Gulf Blvd, Treasure Island, FL', 'Tiki beach bar & live music', 4.4, '9am – 2am', 'https://lirp.cdn-website.com/8fb92e26/dms3rep/multi/opt/LOGO+float-1920w.png', '#D9822B', 'KT');

INSERT INTO cameras (id, town_id, name, loc, category, status, embed_url, source, flag, map_x, map_y) VALUES
  ('CAM-014', 'clearwater-beach', 'Clearwater Beach', 'Pier 60, Access 3', 'beach', 'online', 'https://api.wetmet.net/widgets/stream/frame.php?uid=46c43b249bb215a31ab5e441f83df8a6', 'FOX13 Tampa Bay via WetMet', 'yellow', 150, 320),
  ('CAM-021', 'indian-rocks-beach', 'Indian Rocks Beach', 'Gulf Blvd Access 8', 'beach', 'online', NULL, NULL, 'green', 170, 360),
  ('CAM-002', 'clearwater-beach', 'Founders Pier', 'Downtown Waterfront', 'pier', 'online', NULL, NULL, 'green', 280, 250),
  ('CAM-031', 'clearwater-beach', 'Harbor Pier 60', 'South Jetty', 'pier', 'offline', NULL, NULL, 'green', 300, 290),
  ('CAM-007', 'indian-shores', 'Redfish Point Ramp', 'Intracoastal Landing', 'ramp', 'online', NULL, NULL, 'green', 420, 150),
  ('CAM-009', 'treasure-island', 'Boardwalk Plaza', 'Main Promenade', 'boardwalk', 'online', NULL, NULL, 'green', 250, 220),
  ('CAM-018', 'st-pete-beach', 'Sunset Boardwalk', 'West Promenade', 'boardwalk', 'online', NULL, NULL, 'green', 200, 200),
  ('CAM-044', 'indian-shores', 'Heron Marsh Dune Trail', 'Wetlands Preserve', 'dune', 'online', NULL, NULL, 'purple', 460, 280),
  ('CAM-005', 'the-redingtons', 'Redington Beach', 'Gulf Blvd Access 12', 'beach', 'offline', NULL, NULL, 'red', 110, 270),
  ('CAM-027', 'madeira-beach', 'Oyster Bay Ramp', 'Public Boat Launch', 'ramp', 'online', NULL, NULL, 'green', 440, 190),
  ('CAM-012', 'the-redingtons', 'Egret Dune Overlook', 'Coastal Preserve', 'dune', 'online', NULL, NULL, 'green', 480, 130),
  ('CAM-038', 'st-pete-beach', 'St Pete Beach', 'Gulf Blvd Access 20', 'beach', 'online', NULL, NULL, 'red', 130, 340),
  ('CAM-051', 'madeira-beach', 'Hubbard''s Marina', 'John''s Pass Boardwalk', 'ramp', 'online', 'https://www.youtube.com/embed/fRF0QhYAvfM?autoplay=1&mute=1&rel=0', 'Hubbard''s Marina', 'green', 455, 205);

-- Real Ka'Tiki lineup for the week of July 13, 2026, exactly as sent by the
-- venue — a working example of what "source: manual, verified_at: now()"
-- data looks like versus everything else in this file, which is placeholder.
INSERT INTO events (venue_id, date, start_time, end_time, performer_name, act_type, source, verified_at) VALUES
  ('katiki', '2026-07-17', '19:00', '23:00', 'Danny Bub Combo', 'band', 'manual', now()),
  ('katiki', '2026-07-18', '13:00', '17:00', 'Shoeless Soul', 'band', 'manual', now()),
  ('katiki', '2026-07-18', '19:00', '23:00', 'Nightbreakers', 'band', 'manual', now()),
  ('katiki', '2026-07-19', '13:00', '17:00', 'Sandy Bottom Boys', 'band', 'manual', now()),
  ('katiki', '2026-07-19', '18:00', '22:00', 'Cornfused', 'band', 'manual', now()),
  ('katiki', '2026-07-20', '18:00', '22:00', 'Kid Royal & The Holy Smokes', 'band', 'manual', now());
