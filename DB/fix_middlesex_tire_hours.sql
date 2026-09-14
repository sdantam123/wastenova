-- Fixes Middlesex County tire drop-off data per source_docs/nj/Middlesex_county_Tires.png:
--   - East Brunswick Recycling Center: Mon-Sat 7:30am-3:30pm
--   - Sayreville Recycling Center (Fort Grumpy): Mon & Fri 7:30am-1pm; 1st & 3rd Saturday 7am-12pm
--   - Woodbridge Public Works: Mon-Sat 8am-2pm (NOT seasonal - that schedule belongs to Plainsboro)
--   - Plainsboro Conservation Center: Apr1-Nov30 (Mon & Thu 5:30-7:30pm, Sat 10am-5pm);
--                                     Dec1-Mar31 (Sat 10am-2pm)
-- Previously, Woodbridge and Plainsboro's tire schedules were cross-mixed, Sayreville
-- was missing TIRES in accepted_materials (so it never appeared under the Tire
-- category), and Woodbridge was also missing TIRES in accepted_materials.

BEGIN;

-- Ensure all four centers are tagged as accepting tires.
UPDATE dropoff_centers
SET accepted_materials = array_append(accepted_materials, 'TIRES')
WHERE id IN (14, 15)  -- Sayreville, Woodbridge
  AND NOT ('TIRES' = ANY(accepted_materials));

-- Remove existing tire-hour rows for these four centers so we can reinsert
-- them correctly.
DELETE FROM center_hours
WHERE center_id IN (10, 14, 15, 5)
  AND notes ILIKE 'Tire recycling%';

-- East Brunswick Recycling Center: Mon-Sat 7:30am-3:30pm
INSERT INTO center_hours (center_id, day_of_week, open_time, close_time, notes)
VALUES
  (10, 1, '07:30:00', '15:30:00', 'Tire recycling'),
  (10, 2, '07:30:00', '15:30:00', 'Tire recycling'),
  (10, 3, '07:30:00', '15:30:00', 'Tire recycling'),
  (10, 4, '07:30:00', '15:30:00', 'Tire recycling'),
  (10, 5, '07:30:00', '15:30:00', 'Tire recycling'),
  (10, 6, '07:30:00', '15:30:00', 'Tire recycling');

-- Sayreville Recycling Center (Fort Grumpy): Mon & Fri 7:30am-1pm; 1st & 3rd Saturday 7am-12pm
INSERT INTO center_hours (center_id, day_of_week, open_time, close_time, notes)
VALUES
  (14, 1, '07:30:00', '13:00:00', 'Tire recycling'),
  (14, 5, '07:30:00', '13:00:00', 'Tire recycling'),
  (14, 6, '07:00:00', '12:00:00', 'Tire recycling, 1st and 3rd Saturday only');

-- Woodbridge Public Works: Mon-Sat 8am-2pm
INSERT INTO center_hours (center_id, day_of_week, open_time, close_time, notes)
VALUES
  (15, 1, '08:00:00', '14:00:00', 'Tire recycling'),
  (15, 2, '08:00:00', '14:00:00', 'Tire recycling'),
  (15, 3, '08:00:00', '14:00:00', 'Tire recycling'),
  (15, 4, '08:00:00', '14:00:00', 'Tire recycling'),
  (15, 5, '08:00:00', '14:00:00', 'Tire recycling'),
  (15, 6, '08:00:00', '14:00:00', 'Tire recycling');

-- Plainsboro Recycling & Conservation Center:
--   Apr 1-Nov 30: Mon & Thu 5:30-7:30pm, Sat 10am-5pm
--   Dec 1-Mar 31: Sat 10am-2pm
INSERT INTO center_hours (center_id, day_of_week, open_time, close_time, notes)
VALUES
  (5, 1, '17:30:00', '19:30:00', 'Tire recycling, April 1-November 30 only'),
  (5, 4, '17:30:00', '19:30:00', 'Tire recycling, April 1-November 30 only'),
  (5, 6, '10:00:00', '17:00:00', 'Tire recycling, April 1-November 30 only'),
  (5, 6, '10:00:00', '14:00:00', 'Tire recycling, December 1-March 31 only');

COMMIT;
