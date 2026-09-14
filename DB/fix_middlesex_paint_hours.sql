-- Middlesex County paint drop-off runs on a monthly cycle: each site is only
-- open on ONE specific week's Friday/Saturday of the month, 8am-12pm, per
-- source_docs/nj/Middlesex_county_Paint.png. The previously seeded "Paint
-- drop-off" rows for East Brunswick/Old Bridge/South Plainfield/Woodbridge
-- were missing the weekly-recurrence detail, and several sites (Sayreville,
-- Middlesex Borough, Dunellen, New Brunswick, Helmetta, Monroe, South
-- Brunswick) had no paint row at all.

BEGIN;

-- Remove any existing imprecise "Paint drop-off" hour rows so we can
-- reinsert them correctly (leaves tire/textile/cooking-oil rows untouched).
DELETE FROM center_hours
WHERE center_id IN (10, 11, 12, 13, 14, 15, 28, 29, 30, 31, 32)
  AND notes = 'Paint drop-off';

-- 1st Friday: Sayreville Recycling Center (Fort Grumpy)
INSERT INTO center_hours (center_id, day_of_week, open_time, close_time, notes)
VALUES (14, 5, '08:00:00', '12:00:00', 'Paint drop-off, 1st Friday of month');

-- 1st Saturday: Middlesex Borough Recycling Center, East Brunswick Recycling Center
INSERT INTO center_hours (center_id, day_of_week, open_time, close_time, notes)
VALUES
  (28, 6, '08:00:00', '12:00:00', 'Paint drop-off, 1st Saturday of month'),
  (10, 6, '08:00:00', '12:00:00', 'Paint drop-off, 1st Saturday of month');

-- 2nd Saturday: Dunellen Public Works, New Brunswick Public Works, Old Bridge Recycling Center
INSERT INTO center_hours (center_id, day_of_week, open_time, close_time, notes)
VALUES
  (29, 6, '08:00:00', '12:00:00', 'Paint drop-off, 2nd Saturday of month'),
  (30, 6, '08:00:00', '12:00:00', 'Paint drop-off, 2nd Saturday of month'),
  (12, 6, '08:00:00', '12:00:00', 'Paint drop-off, 2nd Saturday of month');

-- 3rd Saturday: South Plainfield Recycling Center, Helmetta (Behind Municipal Building), Monroe Public Works
INSERT INTO center_hours (center_id, day_of_week, open_time, close_time, notes)
VALUES
  (13, 6, '08:00:00', '12:00:00', 'Paint drop-off, 3rd Saturday of month'),
  (31, 6, '08:00:00', '12:00:00', 'Paint drop-off, 3rd Saturday of month'),
  (11, 6, '08:00:00', '12:00:00', 'Paint drop-off, 3rd Saturday of month');

-- 4th Saturday: Woodbridge Public Works, South Brunswick Recycling Center
INSERT INTO center_hours (center_id, day_of_week, open_time, close_time, notes)
VALUES
  (15, 6, '08:00:00', '12:00:00', 'Paint drop-off, 4th Saturday of month'),
  (32, 6, '08:00:00', '12:00:00', 'Paint drop-off, 4th Saturday of month');

COMMIT;
