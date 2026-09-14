-- Sample seed data for Global Recycle
-- Apply after schema.sql

BEGIN;

-- -----------------------------------------------------------------------------
-- Jurisdictions
-- -----------------------------------------------------------------------------
INSERT INTO jurisdictions (
  id, country, country_code, state, state_code, county, township, postal_codes,
  parent_id, data_source, last_updated
) VALUES
  (
    'jur_us',
    'United States',
    'US',
    NULL,
    NULL,
    NULL,
    NULL,
    ARRAY['07302', '07306', '07307', '95110', '95112'],
    NULL,
    'seed',
    NOW()
  ),
  (
    'jur_us_nj',
    'United States',
    'US',
    'New Jersey',
    'NJ',
    NULL,
    NULL,
    ARRAY['07302', '07306', '07307'],
    'jur_us',
    'seed',
    NOW()
  ),
  (
    'jur_us_nj_hudson_jerseycity',
    'United States',
    'US',
    'New Jersey',
    'NJ',
    'Hudson County',
    'Jersey City',
    ARRAY['07302', '07304', '07305', '07306', '07307'],
    'jur_us_nj',
    'seed',
    NOW()
  ),
  (
    'jur_us_ca_santaclara_sanjose',
    'United States',
    'US',
    'California',
    'CA',
    'Santa Clara County',
    'San Jose',
    ARRAY['95110', '95111', '95112', '95113', '95116'],
    'jur_us',
    'seed',
    NOW()
  );

-- -----------------------------------------------------------------------------
-- Recycling rules
-- -----------------------------------------------------------------------------
INSERT INTO recycling_rules (
  jurisdiction_id, material_name, material_code, category, is_accepted,
  preparation_steps, special_notes, effective_from
) VALUES
  (
    'jur_us_nj_hudson_jerseycity',
    'PET Plastic Bottles',
    '1',
    'CURBSIDE',
    TRUE,
    ARRAY['Empty contents', 'Rinse clean', 'Replace cap if local guidance allows'],
    'Bottles and jugs only.',
    DATE '2026-01-01'
  ),
  (
    'jur_us_nj_hudson_jerseycity',
    'Glass Bottles and Jars',
    NULL,
    'CURBSIDE',
    TRUE,
    ARRAY['Rinse clean', 'Remove lids and caps'],
    'No window glass or ceramics.',
    DATE '2026-01-01'
  ),
  (
    'jur_us_nj_hudson_jerseycity',
    'Plastic Bags',
    NULL,
    'NOT_RECYCLABLE',
    FALSE,
    ARRAY['Keep out of curbside recycling'],
    'Return to retail store film-plastic collection if available.',
    DATE '2026-01-01'
  ),
  (
    'jur_us_ca_santaclara_sanjose',
    'Mixed Paper',
    NULL,
    'CURBSIDE',
    TRUE,
    ARRAY['Keep dry and clean', 'Flatten boxes'],
    'Office paper, mail, and cardboard are accepted.',
    DATE '2026-01-01'
  ),
  (
    'jur_us_ca_santaclara_sanjose',
    'Household Batteries',
    NULL,
    'HAZARDOUS',
    TRUE,
    ARRAY['Tape terminals', 'Bring to approved drop-off center'],
    'Do not place in curbside bins.',
    DATE '2026-01-01'
  );

-- -----------------------------------------------------------------------------
-- Pickup schedules
-- -----------------------------------------------------------------------------
INSERT INTO pickup_schedules (
  jurisdiction_id, schedule_type, frequency, day_of_week, week_of_month,
  accepted_materials, preparation_notes, effective_from
) VALUES
  (
    'jur_us_nj_hudson_jerseycity',
    'RECYCLING',
    'WEEKLY',
    3,
    NULL,
    ARRAY['Mixed Recyclables'],
    'Place bins curbside by 7:00 AM.',
    DATE '2026-01-01'
  ),
  (
    'jur_us_nj_hudson_jerseycity',
    'TRASH',
    'WEEKLY',
    1,
    NULL,
    ARRAY['Trash'],
    'No yard waste in trash carts.',
    DATE '2026-01-01'
  ),
  (
    'jur_us_ca_santaclara_sanjose',
    'YARD_WASTE',
    'WEEKLY',
    2,
    NULL,
    ARRAY['Leaves', 'Grass clippings', 'Small branches'],
    'Use compostable bags or loose yard waste only.',
    DATE '2026-01-01'
  );

INSERT INTO schedule_exceptions (
  jurisdiction_id, exception_date, reason, new_date, cancelled
) VALUES
  (
    'jur_us_nj_hudson_jerseycity',
    DATE '2026-07-04',
    'Independence Day',
    DATE '2026-07-05',
    FALSE
  );

-- -----------------------------------------------------------------------------
-- Drop-off centers
-- -----------------------------------------------------------------------------
INSERT INTO dropoff_centers (
  id, name, center_type, program_name, address_line1, address_line2, city,
  state, postal_code, country_code, latitude, longitude, phone, website, email,
  accepted_materials, not_accepted, is_active, is_temporary, event_date
) VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    'Greenway Recycling Center',
    'MUNICIPAL_CENTER',
    NULL,
    '1420 Harbor Blvd',
    NULL,
    'San Jose',
    'CA',
    '95110',
    'US',
    37.3378000,
    -121.8873000,
    '+14085550101',
    'https://example.com/greenway',
    NULL,
    ARRAY['Plastic', 'Glass', 'Metal', 'Paper', 'Cardboard', 'Electronics'],
    ARRAY['Hazardous waste'],
    TRUE,
    FALSE,
    NULL
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'EcoHub Community Drop-off',
    'COUNTY_CENTER',
    NULL,
    '890 N First St',
    NULL,
    'San Jose',
    'CA',
    '95112',
    'US',
    37.3562000,
    -121.9005000,
    '+14085550202',
    'https://example.com/ecohub',
    NULL,
    ARRAY['Batteries', 'E-Waste', 'Paint', 'Motor Oil', 'Textiles'],
    ARRAY['General trash'],
    TRUE,
    FALSE,
    NULL
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'Hudson County Recycling Center',
    'COUNTY_CENTER',
    NULL,
    '2 Hackensack Plz',
    NULL,
    'Jersey City',
    'NJ',
    '07302',
    'US',
    40.7178000,
    -74.0431000,
    '+12015551234',
    'https://example.com/hudson-recycle',
    NULL,
    ARRAY['Electronics', 'Batteries', 'Textiles', 'Metal'],
    ARRAY['Food waste'],
    TRUE,
    FALSE,
    NULL
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    'DEA Drug Take-Back Pop-up',
    'EWASTE_EVENT',
    'DEA Drug Take-Back',
    '125 Grove St',
    NULL,
    'Jersey City',
    'NJ',
    '07302',
    'US',
    40.7151000,
    -74.0480000,
    NULL,
    NULL,
    NULL,
    ARRAY['Prescription drugs', 'OTC medication'],
    ARRAY['Sharps', 'Needles'],
    TRUE,
    TRUE,
    DATE '2026-10-10'
  );

INSERT INTO center_hours (
  center_id, day_of_week, open_time, close_time, notes
) VALUES
  ('11111111-1111-1111-1111-111111111111', 1, TIME '08:00', TIME '17:00', NULL),
  ('11111111-1111-1111-1111-111111111111', 2, TIME '08:00', TIME '17:00', NULL),
  ('11111111-1111-1111-1111-111111111111', 3, TIME '08:00', TIME '17:00', NULL),
  ('11111111-1111-1111-1111-111111111111', 4, TIME '08:00', TIME '17:00', NULL),
  ('11111111-1111-1111-1111-111111111111', 5, TIME '08:00', TIME '15:00', NULL),
  ('11111111-1111-1111-1111-111111111111', 6, TIME '09:00', TIME '13:00', 'Appointment recommended'),
  ('22222222-2222-2222-2222-222222222222', 1, TIME '07:00', TIME '16:00', NULL),
  ('22222222-2222-2222-2222-222222222222', 2, TIME '07:00', TIME '16:00', NULL),
  ('22222222-2222-2222-2222-222222222222', 3, TIME '07:00', TIME '16:00', NULL),
  ('22222222-2222-2222-2222-222222222222', 4, TIME '07:00', TIME '16:00', NULL),
  ('22222222-2222-2222-2222-222222222222', 5, TIME '07:00', TIME '16:00', NULL),
  ('33333333-3333-3333-3333-333333333333', 1, TIME '08:00', TIME '17:00', NULL),
  ('33333333-3333-3333-3333-333333333333', 2, TIME '08:00', TIME '17:00', NULL),
  ('33333333-3333-3333-3333-333333333333', 3, TIME '08:00', TIME '17:00', NULL),
  ('33333333-3333-3333-3333-333333333333', 4, TIME '08:00', TIME '17:00', NULL),
  ('33333333-3333-3333-3333-333333333333', 5, TIME '08:00', TIME '17:00', NULL),
  ('44444444-4444-4444-4444-444444444444', 6, NULL, NULL, 'One-day event only');

COMMIT;