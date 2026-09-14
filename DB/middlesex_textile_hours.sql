-- Textile recycling rotation hours (8am-12pm, monthly cadence per site).
-- Source: Middlesex County 2026 Recycling and Solid Waste Guide, Textile
-- Recycling section. day_of_week uses the closest weekly slot (5=Friday,
-- 6=Saturday); the notes column carries the "which week of month" detail
-- since center_hours has no monthly-cadence column, matching the existing
-- pattern used for Sayreville's "1st and 3rd Saturday only" tire hours.

BEGIN;

INSERT INTO center_hours (center_id, day_of_week, open_time, close_time, notes) VALUES
  (14, 5, TIME '08:00', TIME '12:00', 'Textile recycling, 1st Friday of month'),
  (28, 6, TIME '08:00', TIME '12:00', 'Textile recycling, 1st Saturday of month'),
  (10, 6, TIME '08:00', TIME '12:00', 'Textile recycling, 1st Saturday of month'),
  (29, 6, TIME '08:00', TIME '12:00', 'Textile recycling, 2nd Saturday of month'),
  (30, 6, TIME '08:00', TIME '12:00', 'Textile recycling, 2nd Saturday of month'),
  (12, 6, TIME '08:00', TIME '12:00', 'Textile recycling, 2nd Saturday of month'),
  (13, 6, TIME '08:00', TIME '12:00', 'Textile recycling, 3rd Saturday of month'),
  (31, 6, TIME '08:00', TIME '12:00', 'Textile recycling, 3rd Saturday of month'),
  (11, 6, TIME '08:00', TIME '12:00', 'Textile recycling, 3rd Saturday of month'),
  (15, 6, TIME '08:00', TIME '12:00', 'Textile recycling, 4th Saturday of month'),
  (32, 6, TIME '08:00', TIME '12:00', 'Textile recycling, 4th Saturday of month');

COMMIT;
