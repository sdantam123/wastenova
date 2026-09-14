-- Clear postal_codes on non-leaf jurisdictions (country/state/county levels).
-- postal_codes should only describe the ZIP codes directly within a
-- jurisdiction's own boundary, not a rollup copied from a child row.

BEGIN;

UPDATE jurisdictions
SET postal_codes = NULL
WHERE id IN ('jur_us', 'jur_us_nj', 'jur_us_nj_middlesex');

COMMIT;
