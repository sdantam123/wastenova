-- Mercer County, NJ township-level jurisdictions, needed to attach
-- municipal recycling programs to the correct place in the hierarchy.
-- Source: Beyond the Bucket (Mercer County Planning Dept, Sept 2019/2020),
-- "County, Municipal and Local Programs" section.

BEGIN;

INSERT INTO jurisdictions (
  id, country, country_code, state, state_code, county, township, postal_codes,
  parent_id, data_source, last_updated
) VALUES
  ('jur_us_nj_mercer_eastwindsor', 'United States', 'US', 'New Jersey', 'NJ', 'Mercer County', 'East Windsor', NULL, 'jur_us_nj_mercer', 'seed', NOW()),
  ('jur_us_nj_mercer_ewing', 'United States', 'US', 'New Jersey', 'NJ', 'Mercer County', 'Ewing', NULL, 'jur_us_nj_mercer', 'seed', NOW()),
  ('jur_us_nj_mercer_hamilton', 'United States', 'US', 'New Jersey', 'NJ', 'Mercer County', 'Hamilton', NULL, 'jur_us_nj_mercer', 'seed', NOW()),
  ('jur_us_nj_mercer_hightstownborough', 'United States', 'US', 'New Jersey', 'NJ', 'Mercer County', 'Hightstown Borough', NULL, 'jur_us_nj_mercer', 'seed', NOW()),
  ('jur_us_nj_mercer_hopewellborough', 'United States', 'US', 'New Jersey', 'NJ', 'Mercer County', 'Hopewell Borough', NULL, 'jur_us_nj_mercer', 'seed', NOW()),
  ('jur_us_nj_mercer_hopewelltownship', 'United States', 'US', 'New Jersey', 'NJ', 'Mercer County', 'Hopewell Township', NULL, 'jur_us_nj_mercer', 'seed', NOW()),
  ('jur_us_nj_mercer_lawrencetownship', 'United States', 'US', 'New Jersey', 'NJ', 'Mercer County', 'Lawrence Township', ARRAY['08648'], 'jur_us_nj_mercer', 'seed', NOW()),
  ('jur_us_nj_mercer_penningtonborough', 'United States', 'US', 'New Jersey', 'NJ', 'Mercer County', 'Pennington Borough', NULL, 'jur_us_nj_mercer', 'seed', NOW()),
  ('jur_us_nj_mercer_princeton', 'United States', 'US', 'New Jersey', 'NJ', 'Mercer County', 'Princeton', NULL, 'jur_us_nj_mercer', 'seed', NOW()),
  ('jur_us_nj_mercer_robbinsvilletownship', 'United States', 'US', 'New Jersey', 'NJ', 'Mercer County', 'Robbinsville Township', NULL, 'jur_us_nj_mercer', 'seed', NOW()),
  ('jur_us_nj_mercer_westwindsor', 'United States', 'US', 'New Jersey', 'NJ', 'Mercer County', 'West Windsor', NULL, 'jur_us_nj_mercer', 'seed', NOW()),
  ('jur_us_nj_mercer_trenton', 'United States', 'US', 'New Jersey', 'NJ', 'Mercer County', 'Trenton', NULL, 'jur_us_nj_mercer', 'seed', NOW());

COMMIT;
