-- Middlesex County, NJ municipal-level jurisdictions, from the 2026
-- Recycling and Solid Waste Guide's municipal contact table (back cover).
-- Plainsboro Township already exists; skipped here.

BEGIN;

INSERT INTO jurisdictions (
  id, country, country_code, state, state_code, county, township, postal_codes,
  parent_id, data_source, last_updated
) VALUES
  ('jur_us_nj_middlesex_carteret', 'United States', 'US', 'New Jersey', 'NJ', 'Middlesex County', 'Carteret', NULL, 'jur_us_nj_middlesex', 'seed', NOW()),
  ('jur_us_nj_middlesex_cranbury', 'United States', 'US', 'New Jersey', 'NJ', 'Middlesex County', 'Cranbury', ARRAY['08512'], 'jur_us_nj_middlesex', 'seed', NOW()),
  ('jur_us_nj_middlesex_dunellen', 'United States', 'US', 'New Jersey', 'NJ', 'Middlesex County', 'Dunellen', ARRAY['08812'], 'jur_us_nj_middlesex', 'seed', NOW()),
  ('jur_us_nj_middlesex_eastbrunswick', 'United States', 'US', 'New Jersey', 'NJ', 'Middlesex County', 'East Brunswick', ARRAY['08816'], 'jur_us_nj_middlesex', 'seed', NOW()),
  ('jur_us_nj_middlesex_edison', 'United States', 'US', 'New Jersey', 'NJ', 'Middlesex County', 'Edison', ARRAY['08817', '08818', '08820', '08837'], 'jur_us_nj_middlesex', 'seed', NOW()),
  ('jur_us_nj_middlesex_helmetta', 'United States', 'US', 'New Jersey', 'NJ', 'Middlesex County', 'Helmetta', ARRAY['08828'], 'jur_us_nj_middlesex', 'seed', NOW()),
  ('jur_us_nj_middlesex_highlandpark', 'United States', 'US', 'New Jersey', 'NJ', 'Middlesex County', 'Highland Park', ARRAY['08904'], 'jur_us_nj_middlesex', 'seed', NOW()),
  ('jur_us_nj_middlesex_jamesburg', 'United States', 'US', 'New Jersey', 'NJ', 'Middlesex County', 'Jamesburg', NULL, 'jur_us_nj_middlesex', 'seed', NOW()),
  ('jur_us_nj_middlesex_metuchen', 'United States', 'US', 'New Jersey', 'NJ', 'Middlesex County', 'Metuchen', NULL, 'jur_us_nj_middlesex', 'seed', NOW()),
  ('jur_us_nj_middlesex_middlesexborough', 'United States', 'US', 'New Jersey', 'NJ', 'Middlesex County', 'Middlesex Borough', ARRAY['08846'], 'jur_us_nj_middlesex', 'seed', NOW()),
  ('jur_us_nj_middlesex_milltown', 'United States', 'US', 'New Jersey', 'NJ', 'Middlesex County', 'Milltown', NULL, 'jur_us_nj_middlesex', 'seed', NOW()),
  ('jur_us_nj_middlesex_monroetownship', 'United States', 'US', 'New Jersey', 'NJ', 'Middlesex County', 'Monroe Township', ARRAY['08831'], 'jur_us_nj_middlesex', 'seed', NOW()),
  ('jur_us_nj_middlesex_newbrunswick', 'United States', 'US', 'New Jersey', 'NJ', 'Middlesex County', 'New Brunswick', ARRAY['08901'], 'jur_us_nj_middlesex', 'seed', NOW()),
  ('jur_us_nj_middlesex_northbrunswick', 'United States', 'US', 'New Jersey', 'NJ', 'Middlesex County', 'North Brunswick', ARRAY['08902'], 'jur_us_nj_middlesex', 'seed', NOW()),
  ('jur_us_nj_middlesex_oldbridge', 'United States', 'US', 'New Jersey', 'NJ', 'Middlesex County', 'Old Bridge', ARRAY['08857'], 'jur_us_nj_middlesex', 'seed', NOW()),
  ('jur_us_nj_middlesex_perthamboy', 'United States', 'US', 'New Jersey', 'NJ', 'Middlesex County', 'Perth Amboy', NULL, 'jur_us_nj_middlesex', 'seed', NOW()),
  ('jur_us_nj_middlesex_piscataway', 'United States', 'US', 'New Jersey', 'NJ', 'Middlesex County', 'Piscataway', NULL, 'jur_us_nj_middlesex', 'seed', NOW()),
  ('jur_us_nj_middlesex_sayreville', 'United States', 'US', 'New Jersey', 'NJ', 'Middlesex County', 'Sayreville', ARRAY['08872'], 'jur_us_nj_middlesex', 'seed', NOW()),
  ('jur_us_nj_middlesex_southamboy', 'United States', 'US', 'New Jersey', 'NJ', 'Middlesex County', 'South Amboy', NULL, 'jur_us_nj_middlesex', 'seed', NOW()),
  ('jur_us_nj_middlesex_southbrunswick', 'United States', 'US', 'New Jersey', 'NJ', 'Middlesex County', 'South Brunswick', ARRAY['08852'], 'jur_us_nj_middlesex', 'seed', NOW()),
  ('jur_us_nj_middlesex_southplainfield', 'United States', 'US', 'New Jersey', 'NJ', 'Middlesex County', 'South Plainfield', ARRAY['07080'], 'jur_us_nj_middlesex', 'seed', NOW()),
  ('jur_us_nj_middlesex_southriver', 'United States', 'US', 'New Jersey', 'NJ', 'Middlesex County', 'South River', NULL, 'jur_us_nj_middlesex', 'seed', NOW()),
  ('jur_us_nj_middlesex_spotswood', 'United States', 'US', 'New Jersey', 'NJ', 'Middlesex County', 'Spotswood', ARRAY['08884'], 'jur_us_nj_middlesex', 'seed', NOW()),
  ('jur_us_nj_middlesex_woodbridge', 'United States', 'US', 'New Jersey', 'NJ', 'Middlesex County', 'Woodbridge', ARRAY['08832'], 'jur_us_nj_middlesex', 'seed', NOW());

COMMIT;
