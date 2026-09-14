-- Add cooking-oil hours (same day/time as paint at each site, per the
-- 2026 county guide) and Woodbridge's seasonal tire hours (previously
-- missing; East Brunswick and Sayreville tire hours already correct).
-- Source: Middlesex County 2026 Recycling and Solid Waste Guide.

BEGIN;

INSERT INTO center_hours (center_id, day_of_week, open_time, close_time, notes) VALUES
  (10, 6, TIME '08:00', TIME '12:00', 'Cooking oil drop-off'),
  (11, 5, TIME '08:00', TIME '12:00', 'Cooking oil drop-off'),
  (12, 6, TIME '08:00', TIME '12:00', 'Cooking oil drop-off'),
  (13, 5, TIME '08:00', TIME '12:00', 'Cooking oil drop-off'),
  (15, 6, TIME '08:00', TIME '12:00', 'Cooking oil drop-off');

-- Woodbridge tire recycling: seasonal hours, distinct from the paint/
-- cooking-oil Saturday 8am-12pm slot already on file.
INSERT INTO center_hours (center_id, day_of_week, open_time, close_time, notes) VALUES
  (15, 1, TIME '17:30', TIME '19:30', 'Tire recycling, April 1-November 30 only'),
  (15, 4, TIME '17:30', TIME '19:30', 'Tire recycling, April 1-November 30 only'),
  (15, 6, TIME '10:00', TIME '17:00', 'Tire recycling, April 1-November 30 only'),
  (15, 6, TIME '10:00', TIME '14:00', 'Tire recycling, December 1-March 31 only');

COMMIT;
