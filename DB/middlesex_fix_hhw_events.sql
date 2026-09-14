-- Fix Middlesex County HHW/E-Waste event data: the previously inserted
-- row (id 16, single guessed date from a news article) is replaced with
-- the correct 2026 five-event schedule from the official county guide.

BEGIN;

DELETE FROM dropoff_centers WHERE id = 16;

INSERT INTO dropoff_centers (
  name, center_type, program_name, address_line1, address_line2, city, state, postal_code,
  country_code, latitude, longitude, phone, accepted_materials, is_active,
  is_temporary, event_date, jurisdiction_id
) VALUES
  (
    'Middlesex College HHW & Electronics Event', 'EWASTE_EVENT', '2026 Household Hazardous Waste & Electronics Recycling',
    '2600 Woodbridge Avenue', 'Mill Road entrance', 'Edison', 'NJ', '08837', 'US',
    40.5045258, -74.3675432, '732-745-4170',
    ARRAY['HOUSEHOLD_HAZARDOUS_WASTE', 'ELECTRONICS'], TRUE, TRUE, DATE '2026-03-15', 'jur_us_nj_middlesex_edison'
  ),
  (
    'Middlesex County Public Works HHW & Electronics Event', 'EWASTE_EVENT', '2026 Household Hazardous Waste & Electronics Recycling',
    '97 Apple Orchard Lane', NULL, 'North Brunswick', 'NJ', '08902', 'US',
    40.4281066, -74.4933080, '732-745-4170',
    ARRAY['HOUSEHOLD_HAZARDOUS_WASTE', 'ELECTRONICS'], TRUE, TRUE, DATE '2026-05-16', 'jur_us_nj_middlesex_northbrunswick'
  ),
  (
    'Old Bridge Recycling Center HHW & Electronics Event', 'EWASTE_EVENT', '2026 Household Hazardous Waste & Electronics Recycling',
    '1 Old Bridge Plaza', 'off Route 516', 'Old Bridge', 'NJ', '08857', 'US',
    40.4034213, -74.2979160, '732-745-4170',
    ARRAY['HOUSEHOLD_HAZARDOUS_WASTE', 'ELECTRONICS'], TRUE, TRUE, DATE '2026-06-28', 'jur_us_nj_middlesex_oldbridge'
  ),
  (
    'Middlesex County Public Works HHW & Electronics Event', 'EWASTE_EVENT', '2026 Household Hazardous Waste & Electronics Recycling',
    '750 Jernee Mill Road', NULL, 'Sayreville', 'NJ', '08872', 'US',
    40.4480514, -74.3548682, '732-745-4170',
    ARRAY['HOUSEHOLD_HAZARDOUS_WASTE', 'ELECTRONICS'], TRUE, TRUE, DATE '2026-09-19', 'jur_us_nj_middlesex_sayreville'
  ),
  (
    'Middlesex College HHW & Electronics Event', 'EWASTE_EVENT', '2026 Household Hazardous Waste & Electronics Recycling',
    '2600 Woodbridge Avenue', 'Mill Road entrance', 'Edison', 'NJ', '08837', 'US',
    40.5045258, -74.3675432, '732-745-4170',
    ARRAY['HOUSEHOLD_HAZARDOUS_WASTE', 'ELECTRONICS'], TRUE, TRUE, DATE '2026-11-15', 'jur_us_nj_middlesex_edison'
  );

COMMIT;
