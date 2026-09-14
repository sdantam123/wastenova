-- Link dropoff_centers to the jurisdictions hierarchy so county-run
-- programs can be identified as available to all residents of that
-- county, not just those within a fixed search radius of the site.

BEGIN;

ALTER TABLE dropoff_centers
  ADD COLUMN jurisdiction_id VARCHAR(100) REFERENCES jurisdictions(id);

CREATE INDEX IF NOT EXISTS idx_centers_jurisdiction
  ON dropoff_centers(jurisdiction_id);

-- San Jose, CA (city-run)
UPDATE dropoff_centers
SET jurisdiction_id = 'jur_us_ca_santaclara_sanjose'
WHERE id IN (1, 2);

-- Jersey City, NJ (city-run)
UPDATE dropoff_centers
SET jurisdiction_id = 'jur_us_nj_hudson_jerseycity'
WHERE id IN (3, 4);

-- Plainsboro Township, NJ (municipal-run)
UPDATE dropoff_centers
SET jurisdiction_id = 'jur_us_nj_middlesex_plainsborotownship'
WHERE id IN (5, 6);

-- Middlesex County, NJ county-run paint/HHW/tire drop-off program
-- (sourced from the county's own recycling programs page; open to
-- all county residents regardless of which township hosts the site)
UPDATE dropoff_centers
SET jurisdiction_id = 'jur_us_nj_middlesex',
    center_type = 'COUNTY_CENTER'
WHERE id IN (10, 11, 12, 13, 14, 15, 16);

COMMIT;
