-- Change dropoff_centers.id from UUID to auto-incrementing BIGINT
-- (first column), and update center_hours.center_id to match.
-- A UUID -> new-id mapping is built first so the FK relationship
-- survives the rebuild; center_hours.id (its own PK) is untouched.

BEGIN;

CREATE TABLE dropoff_centers_new (
  id                 BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name               VARCHAR(255) NOT NULL,
  center_type        VARCHAR(50) NOT NULL,
  program_name       VARCHAR(255),
  address_line1      VARCHAR(255) NOT NULL,
  address_line2      VARCHAR(255),
  city               VARCHAR(100) NOT NULL,
  state              VARCHAR(100),
  postal_code        VARCHAR(20),
  country_code       CHAR(2) NOT NULL,
  latitude           DECIMAL(10, 7) NOT NULL,
  longitude          DECIMAL(10, 7) NOT NULL,
  phone              VARCHAR(30),
  website            VARCHAR(500),
  email              VARCHAR(255),
  accepted_materials  TEXT[] NOT NULL,
  not_accepted       TEXT[],
  is_active          BOOLEAN DEFAULT TRUE,
  is_temporary       BOOLEAN DEFAULT FALSE,
  event_date         DATE,
  created_at         TIMESTAMPTZ DEFAULT NOW(),
  updated_at         TIMESTAMPTZ DEFAULT NOW(),
  old_id             UUID,
  CONSTRAINT dropoff_centers_center_type_chk CHECK (
    center_type IN (
      'COUNTY_CENTER',
      'MUNICIPAL_CENTER',
      'RETAIL_DROPOFF',
      'PHARMACY_DROPBOX',
      'EWASTE_EVENT'
    )
  ),
  CONSTRAINT dropoff_centers_event_date_chk CHECK (
    (is_temporary = false AND event_date IS NULL) OR (is_temporary = true AND event_date IS NOT NULL)
  ),
  CONSTRAINT dropoff_centers_country_code_chk CHECK (char_length(country_code) = 2)
);

INSERT INTO dropoff_centers_new (
  name, center_type, program_name, address_line1, address_line2, city, state,
  postal_code, country_code, latitude, longitude, phone, website, email,
  accepted_materials, not_accepted, is_active, is_temporary, event_date,
  created_at, updated_at, old_id
)
SELECT
  name, center_type, program_name, address_line1, address_line2, city, state,
  postal_code, country_code, latitude, longitude, phone, website, email,
  accepted_materials, not_accepted, is_active, is_temporary, event_date,
  created_at, updated_at, id
FROM dropoff_centers
ORDER BY created_at;

-- Repoint center_hours at the new integer ids using the old_id mapping.
ALTER TABLE center_hours ADD COLUMN new_center_id BIGINT;

UPDATE center_hours ch
SET new_center_id = dcn.id
FROM dropoff_centers_new dcn
WHERE dcn.old_id = ch.center_id;

ALTER TABLE center_hours DROP CONSTRAINT center_hours_center_id_fkey;
ALTER TABLE center_hours DROP COLUMN center_id;
ALTER TABLE center_hours RENAME COLUMN new_center_id TO center_id;
ALTER TABLE center_hours ALTER COLUMN center_id SET NOT NULL;
ALTER TABLE center_hours ADD CONSTRAINT center_hours_center_id_fkey
  FOREIGN KEY (center_id) REFERENCES dropoff_centers_new(id) ON DELETE CASCADE;

ALTER TABLE dropoff_centers_new DROP COLUMN old_id;

DROP TABLE dropoff_centers;
ALTER TABLE dropoff_centers_new RENAME TO dropoff_centers;

ALTER INDEX dropoff_centers_new_pkey RENAME TO dropoff_centers_pkey;

CREATE INDEX IF NOT EXISTS idx_centers_location
  ON dropoff_centers USING GIST (
    ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)
  );

CREATE INDEX IF NOT EXISTS idx_centers_country
  ON dropoff_centers(country_code);

CREATE INDEX IF NOT EXISTS idx_centers_active
  ON dropoff_centers(is_active);

CREATE INDEX IF NOT EXISTS idx_center_hours_center_day
  ON center_hours(center_id, day_of_week);

COMMIT;
