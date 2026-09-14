-- Add Middlesex County, NJ as a county-level jurisdiction and re-parent
-- Plainsboro Township under it (was previously a direct child of the state).

BEGIN;

INSERT INTO jurisdictions (
  id, country, country_code, state, state_code, county, township, postal_codes,
  parent_id, data_source, last_updated
) VALUES (
  'jur_us_nj_middlesex',
  'United States',
  'US',
  'New Jersey',
  'NJ',
  'Middlesex County',
  NULL,
  ARRAY['08536'],
  'jur_us_nj',
  'seed',
  NOW()
);

UPDATE jurisdictions
SET parent_id = 'jur_us_nj_middlesex'
WHERE id = 'jur_us_nj_middlesex_plainsborotownship';

COMMIT;
