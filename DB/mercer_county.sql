-- Mercer County, NJ jurisdiction and recycling drop-off locations.
-- Sources:
--   https://mcianj.org/index.asp?SEC=E53D24C5-818D-4560-BAAB-232663DAA76B
--   https://www.mercercounty.org/community/community-life/recycling-and-household-hazardous-waste-disposal
--   https://www.tapinto.net/towns/hamilton-slash-robbinsville/sections/green/articles/how-do-i-get-rid-of-mercer-county-improvement-authority-2026-household-hazardous-waste-and-electronics-recycling-events-begins-saturday
-- Coordinates geocoded via OpenStreetMap Nominatim.

BEGIN;

INSERT INTO jurisdictions (
  id, country, country_code, state, state_code, county, township, postal_codes,
  parent_id, data_source, last_updated
) VALUES (
  'jur_us_nj_mercer',
  'United States',
  'US',
  'New Jersey',
  'NJ',
  'Mercer County',
  NULL,
  NULL,
  'jur_us_nj',
  'seed',
  NOW()
);

WITH new_centers AS (
  INSERT INTO dropoff_centers (
    name, center_type, program_name, address_line1, city, state, postal_code,
    country_code, latitude, longitude, phone, accepted_materials, is_active,
    is_temporary, event_date, jurisdiction_id
  ) VALUES
    (
      'Mercer County Connection', 'COUNTY_CENTER', 'Recycling Bucket Distribution',
      '957 Highway 33', 'Hamilton', 'NJ', '08690', 'US',
      40.2274136, -74.6624145, '609-890-9800',
      ARRAY['RECYCLING_BUCKETS'], TRUE, FALSE, NULL, 'jur_us_nj_mercer'
    ),
    (
      'Dempster Fire Training Center HHW & Electronics Event', 'EWASTE_EVENT', '2026 Household Hazardous Waste and Electronics Recycling',
      '350 Lawrence Station Road', 'Lawrence Township', 'NJ', '08648', 'US',
      40.2751554, -74.6817976, '609-278-8086',
      ARRAY['HOUSEHOLD_HAZARDOUS_WASTE', 'ELECTRONICS'], TRUE, TRUE, DATE '2026-03-21', 'jur_us_nj_mercer'
    ),
    (
      'Dempster Fire Training Center HHW & Electronics Event', 'EWASTE_EVENT', '2026 Household Hazardous Waste and Electronics Recycling',
      '350 Lawrence Station Road', 'Lawrence Township', 'NJ', '08648', 'US',
      40.2751554, -74.6817976, '609-278-8086',
      ARRAY['HOUSEHOLD_HAZARDOUS_WASTE', 'ELECTRONICS'], TRUE, TRUE, DATE '2026-06-13', 'jur_us_nj_mercer'
    ),
    (
      'Dempster Fire Training Center HHW & Electronics Event', 'EWASTE_EVENT', '2026 Household Hazardous Waste and Electronics Recycling',
      '350 Lawrence Station Road', 'Lawrence Township', 'NJ', '08648', 'US',
      40.2751554, -74.6817976, '609-278-8086',
      ARRAY['HOUSEHOLD_HAZARDOUS_WASTE', 'ELECTRONICS'], TRUE, TRUE, DATE '2026-09-26', 'jur_us_nj_mercer'
    )
  RETURNING id, name
)
INSERT INTO center_hours (center_id, day_of_week, open_time, close_time, notes)
SELECT id, hrs.day_of_week, hrs.open_time, hrs.close_time, hrs.notes
FROM new_centers
JOIN LATERAL (
  VALUES
    -- Mercer County Connection: Mon/Wed/Fri 10-6, Tue/Thu 10-8, Sat 10-3
    ('Mercer County Connection', 1, TIME '10:00', TIME '18:00', NULL),
    ('Mercer County Connection', 2, TIME '10:00', TIME '20:00', NULL),
    ('Mercer County Connection', 3, TIME '10:00', TIME '18:00', NULL),
    ('Mercer County Connection', 4, TIME '10:00', TIME '20:00', NULL),
    ('Mercer County Connection', 5, TIME '10:00', TIME '18:00', NULL::VARCHAR),
    ('Mercer County Connection', 6, TIME '10:00', TIME '15:00', NULL::VARCHAR)
    -- Dempster Fire Training Center rows are one-time events; each date's
    -- own event_date on dropoff_centers is the source of truth, no
    -- center_hours rows needed.
) AS hrs(center_name, day_of_week, open_time, close_time, notes)
  ON hrs.center_name = new_centers.name;

COMMIT;
