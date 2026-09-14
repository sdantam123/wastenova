-- Middlesex County, NJ recycling drop-off centers
-- Source: https://www.middlesexcountynj.gov/government/departments/department-of-public-safety-and-health/office-of-health-services/solid-waste-management-program/recycling-programs-and-events
-- Coordinates geocoded via OpenStreetMap Nominatim.

BEGIN;

WITH new_centers AS (
  INSERT INTO dropoff_centers (
    name, center_type, program_name, address_line1, city, state, postal_code,
    country_code, latitude, longitude, phone, accepted_materials, is_active,
    is_temporary, event_date
  ) VALUES
    (
      'East Brunswick Recycling Center', 'MUNICIPAL_CENTER', 'Middlesex County Paint & Tire Drop-off',
      '357 Dunhams Corner Road', 'East Brunswick', 'NJ', '08816', 'US',
      40.4117959, -74.4467871, '732-745-4170',
      ARRAY['PAINT', 'TIRES'], TRUE, FALSE, NULL
    ),
    (
      'Monroe Township Recycling Drop-Off Center', 'MUNICIPAL_CENTER', 'Middlesex County Paint Drop-off',
      '76 Gravel Hill-Spotswood Road', 'Monroe Township', 'NJ', '08831', 'US',
      40.3173479, -74.4094008, '732-745-4170',
      ARRAY['PAPER', 'CARDBOARD', 'GLASS', 'METAL', 'PLASTIC', 'MOTOR_OIL', 'PAINT'], TRUE, FALSE, NULL
    ),
    (
      'Old Bridge Recycling Center', 'MUNICIPAL_CENTER', 'Middlesex County Paint & HHW Drop-off',
      '1 Old Bridge Plaza', 'Old Bridge', 'NJ', '08857', 'US',
      40.4034213, -74.2979160, '732-745-4170',
      ARRAY['PAINT', 'HOUSEHOLD_HAZARDOUS_WASTE'], TRUE, FALSE, NULL
    ),
    (
      'South Plainfield Recycling Center', 'MUNICIPAL_CENTER', 'Middlesex County Paint Drop-off',
      '882 Kenneth Avenue', 'South Plainfield', 'NJ', '07080', 'US',
      40.5673639, -74.4057677, '732-745-4170',
      ARRAY['PAINT'], TRUE, FALSE, NULL
    ),
    (
      'Sayreville Recycling Center (Fort Grumpy)', 'MUNICIPAL_CENTER', NULL,
      '3750 Bordentown Avenue', 'Sayreville', 'NJ', '08872', 'US',
      40.4340914, -74.3356975, '732-745-4170',
      ARRAY['PAPER', 'CARDBOARD', 'GLASS', 'METAL', 'PLASTIC'], TRUE, FALSE, NULL
    ),
    (
      'Woodbridge Public Works Recycling Drop-off', 'MUNICIPAL_CENTER', 'Middlesex County Paint Drop-off',
      '225 Smith Street', 'Keasbey', 'NJ', '08832', 'US',
      40.5148207, -74.3016884, '732-745-4170',
      ARRAY['PAINT'], TRUE, FALSE, NULL
    ),
    (
      'Middlesex College HHW Drop-off', 'EWASTE_EVENT', '2026 Household Hazardous Waste Drop-off',
      '2600 Woodbridge Avenue', 'Edison', 'NJ', '08818', 'US',
      40.5045258, -74.3675432, '732-727-6626',
      ARRAY['HOUSEHOLD_HAZARDOUS_WASTE'], TRUE, TRUE, DATE '2026-03-15'
    )
  RETURNING id, name
)
INSERT INTO center_hours (center_id, day_of_week, open_time, close_time, notes)
SELECT id, hrs.day_of_week, hrs.open_time, hrs.close_time, hrs.notes
FROM new_centers
JOIN LATERAL (
  VALUES
    -- East Brunswick: paint every Saturday 8-12; tires Mon-Sat 7:30-3:30
    ('East Brunswick Recycling Center', 6, TIME '08:00', TIME '12:00', 'Paint drop-off'),
    ('East Brunswick Recycling Center', 1, TIME '07:30', TIME '15:30', 'Tire recycling'),
    ('East Brunswick Recycling Center', 2, TIME '07:30', TIME '15:30', 'Tire recycling'),
    ('East Brunswick Recycling Center', 3, TIME '07:30', TIME '15:30', 'Tire recycling'),
    ('East Brunswick Recycling Center', 4, TIME '07:30', TIME '15:30', 'Tire recycling'),
    ('East Brunswick Recycling Center', 5, TIME '07:30', TIME '15:30', 'Tire recycling'),
    -- Monroe Township: every Friday 8-12
    ('Monroe Township Recycling Drop-Off Center', 5, TIME '08:00', TIME '12:00', 'Paint drop-off'),
    -- Old Bridge: every Saturday 8-12
    ('Old Bridge Recycling Center', 6, TIME '08:00', TIME '12:00', 'Paint drop-off'),
    -- South Plainfield: every Friday 8-12
    ('South Plainfield Recycling Center', 5, TIME '08:00', TIME '12:00', 'Paint drop-off'),
    -- Sayreville: Mon & Fri 7:30-1; 1st/3rd Sat 7-12
    ('Sayreville Recycling Center (Fort Grumpy)', 1, TIME '07:30', TIME '13:00', NULL),
    ('Sayreville Recycling Center (Fort Grumpy)', 5, TIME '07:30', TIME '13:00', NULL),
    ('Sayreville Recycling Center (Fort Grumpy)', 6, TIME '07:00', TIME '12:00', '1st and 3rd Saturday only'),
    -- Woodbridge: every Saturday 8-12
    ('Woodbridge Public Works Recycling Drop-off', 6, TIME '08:00', TIME '12:00', 'Paint drop-off')
    -- Middlesex College HHW: one-time event, hours captured via event_date on dropoff_centers, no center_hours row
) AS hrs(center_name, day_of_week, open_time, close_time, notes)
  ON hrs.center_name = new_centers.name;

COMMIT;
