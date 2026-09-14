-- Global Recycle database schema
-- PostgreSQL 16

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS postgis;

-- -----------------------------------------------------------------------------
-- users
-- -----------------------------------------------------------------------------
-- password_hash stores a bcrypt digest only (via pgcrypto's crypt()/gen_salt('bf')).
-- Never write plaintext passwords to this column; application code must hash
-- on the way in, e.g.:
--   INSERT INTO users (external_id, auth_provider, password_hash)
--   VALUES ($1, $2, crypt($3, gen_salt('bf')));
-- and verify with:
--   SELECT id FROM users WHERE email = $1 AND password_hash = crypt($2, password_hash);
CREATE TABLE IF NOT EXISTS users (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  external_id   VARCHAR(255) UNIQUE NOT NULL,
  auth_provider VARCHAR(20) NOT NULL,
  name          VARCHAR(255),
  email         VARCHAR(255),
  password_hash VARCHAR(255),
  address       VARCHAR(500),
  postal_code   VARCHAR(20),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT users_auth_provider_chk CHECK (auth_provider IN ('apple', 'google', 'password'))
);

-- -----------------------------------------------------------------------------
-- jurisdictions
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS jurisdictions (
  id            VARCHAR(100) PRIMARY KEY,
  country       VARCHAR(100) NOT NULL,
  country_code  CHAR(2) NOT NULL,
  state         VARCHAR(100),
  state_code    VARCHAR(10),
  county        VARCHAR(100),
  township      VARCHAR(100),
  postal_codes  TEXT[],
  parent_id     VARCHAR(100) REFERENCES jurisdictions(id),
  data_source   VARCHAR(255),
  last_updated  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_jurisdictions_country_state
  ON jurisdictions(country_code, state_code);

-- -----------------------------------------------------------------------------
-- recycling_rules
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS recycling_rules (
  id                BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  jurisdiction_id   VARCHAR(100) NOT NULL REFERENCES jurisdictions(id),
  material_name     VARCHAR(255) NOT NULL,
  material_code     VARCHAR(20),
  category          VARCHAR(50) NOT NULL,
  is_accepted       BOOLEAN NOT NULL DEFAULT true,
  preparation_steps TEXT[],
  rejection_reason  TEXT,
  special_notes     TEXT,
  effective_from    DATE,
  effective_to      DATE,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (jurisdiction_id, material_name),
  CONSTRAINT recycling_rules_category_chk CHECK (
    category IN (
      'CURBSIDE',
      'DROPOFF_CENTER',
      'MEDICAL_DROPOFF',
      'HAZARDOUS',
      'COMPOST',
      'NOT_RECYCLABLE',
      'REUSE'
    )
  )
);

CREATE INDEX IF NOT EXISTS idx_rules_jurisdiction
  ON recycling_rules(jurisdiction_id);

CREATE INDEX IF NOT EXISTS idx_rules_category
  ON recycling_rules(category);

-- -----------------------------------------------------------------------------
-- pickup_schedules
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pickup_schedules (
  id                 BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  jurisdiction_id    VARCHAR(100) NOT NULL REFERENCES jurisdictions(id),
  schedule_type      VARCHAR(50) NOT NULL,
  frequency          VARCHAR(20) NOT NULL,
  day_of_week        SMALLINT,
  week_of_month      SMALLINT,
  accepted_materials TEXT[],
  preparation_notes  TEXT,
  effective_from     DATE NOT NULL,
  effective_to       DATE,
  created_at         TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT pickup_schedules_schedule_type_chk CHECK (
    schedule_type IN ('RECYCLING', 'TRASH', 'YARD_WASTE', 'BULK_PICKUP')
  ),
  CONSTRAINT pickup_schedules_frequency_chk CHECK (
    frequency IN ('WEEKLY', 'BIWEEKLY', 'MONTHLY')
  ),
  CONSTRAINT pickup_schedules_day_of_week_chk CHECK (day_of_week IS NULL OR day_of_week BETWEEN 0 AND 6),
  CONSTRAINT pickup_schedules_week_of_month_chk CHECK (week_of_month IS NULL OR week_of_month BETWEEN 1 AND 5)
);

-- -----------------------------------------------------------------------------
-- schedule_exceptions
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS schedule_exceptions (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  jurisdiction_id  VARCHAR(100) NOT NULL REFERENCES jurisdictions(id),
  exception_date   DATE NOT NULL,
  reason           VARCHAR(255),
  new_date         DATE,
  cancelled        BOOLEAN DEFAULT FALSE,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT schedule_exceptions_date_chk CHECK (
    new_date IS NULL OR new_date >= exception_date
  )
);

CREATE INDEX IF NOT EXISTS idx_schedule_exceptions_jurisdiction_date
  ON schedule_exceptions(jurisdiction_id, exception_date);

-- -----------------------------------------------------------------------------
-- dropoff_centers
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS dropoff_centers (
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
  jurisdiction_id    VARCHAR(100) REFERENCES jurisdictions(id),
  created_at         TIMESTAMPTZ DEFAULT NOW(),
  updated_at         TIMESTAMPTZ DEFAULT NOW(),
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

CREATE INDEX IF NOT EXISTS idx_centers_location
  ON dropoff_centers USING GIST (
    ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)
  );

CREATE INDEX IF NOT EXISTS idx_centers_country
  ON dropoff_centers(country_code);

CREATE INDEX IF NOT EXISTS idx_centers_active
  ON dropoff_centers(is_active);

CREATE INDEX IF NOT EXISTS idx_centers_jurisdiction
  ON dropoff_centers(jurisdiction_id);

-- -----------------------------------------------------------------------------
-- center_hours
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS center_hours (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  center_id   BIGINT NOT NULL REFERENCES dropoff_centers(id) ON DELETE CASCADE,
  day_of_week SMALLINT NOT NULL,
  open_time   TIME,
  close_time  TIME,
  notes       VARCHAR(255),
  CONSTRAINT center_hours_day_of_week_chk CHECK (day_of_week BETWEEN 0 AND 6),
  CONSTRAINT center_hours_time_chk CHECK (
    (open_time IS NULL AND close_time IS NULL)
    OR (open_time IS NOT NULL AND close_time IS NOT NULL AND open_time < close_time)
  )
);

CREATE INDEX IF NOT EXISTS idx_center_hours_center_day
  ON center_hours(center_id, day_of_week);

-- -----------------------------------------------------------------------------
-- recycling_programs
-- -----------------------------------------------------------------------------
-- Take-back / mail-in / manufacturer recycling programs for materials that
-- don't have a single physical drop-off site (e.g. TerraCycle mail-in
-- programs, retail chain take-back bins). Distinct from dropoff_centers,
-- which models a single physical address; a program may have zero, one,
-- or many associated locations (see program_locations).
CREATE TABLE IF NOT EXISTS recycling_programs (
  id                 BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  material_category  VARCHAR(100) NOT NULL,
  program_name       VARCHAR(255) NOT NULL,
  organization       VARCHAR(255) NOT NULL,
  program_type       VARCHAR(20) NOT NULL,
  accepts            TEXT[],
  not_accepted       TEXT[],
  how_it_works       TEXT,
  incentive          VARCHAR(255),
  website            VARCHAR(500),
  jurisdiction_id    VARCHAR(100) REFERENCES jurisdictions(id),
  is_active          BOOLEAN DEFAULT TRUE,
  created_at         TIMESTAMPTZ DEFAULT NOW(),
  updated_at         TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT recycling_programs_program_type_chk CHECK (
    program_type IN ('MAIL_IN', 'RETAIL_TAKEBACK', 'LOCAL_EVENT', 'MUNICIPAL')
  )
);

CREATE INDEX IF NOT EXISTS idx_programs_material_category
  ON recycling_programs(material_category);

CREATE INDEX IF NOT EXISTS idx_programs_jurisdiction
  ON recycling_programs(jurisdiction_id);

-- -----------------------------------------------------------------------------
-- program_locations
-- -----------------------------------------------------------------------------
-- Physical locations tied to a recycling_programs row (e.g. the specific
-- malls/stores where a retail take-back program has a bin). A program with
-- no rows here is mail-in only.
CREATE TABLE IF NOT EXISTS program_locations (
  id             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  program_id     BIGINT NOT NULL REFERENCES recycling_programs(id) ON DELETE CASCADE,
  location_name  VARCHAR(255) NOT NULL,
  address_line1  VARCHAR(255),
  city           VARCHAR(100),
  state          VARCHAR(100),
  postal_code    VARCHAR(20),
  notes          VARCHAR(255),
  -- Set only for one-off dated events (e.g. a single-day paper shredding
  -- event at this location); NULL for standing/ongoing locations.
  event_date     DATE,
  latitude       NUMERIC(9,7),
  longitude      NUMERIC(10,7)
);

CREATE INDEX IF NOT EXISTS idx_program_locations_program
  ON program_locations(program_id);

-- -----------------------------------------------------------------------------
-- source_documents
-- -----------------------------------------------------------------------------
-- Provenance record for official guides/PDFs/images that seed data was
-- transcribed from (e.g. county recycling guides). The file itself lives
-- on disk (see file_path); this table does not store file bytes.
CREATE TABLE IF NOT EXISTS source_documents (
  id                BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title             VARCHAR(255) NOT NULL,
  file_path         VARCHAR(500) NOT NULL,
  document_type     VARCHAR(20) NOT NULL DEFAULT 'PDF',
  category_key      VARCHAR(50),
  source_url        VARCHAR(500),
  jurisdiction_id   VARCHAR(100) REFERENCES jurisdictions(id),
  publication_year  SMALLINT,
  file_size_bytes   BIGINT,
  notes             TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT source_documents_document_type_chk CHECK (
    document_type IN ('PDF', 'IMAGE')
  )
);

CREATE INDEX IF NOT EXISTS idx_source_documents_jurisdiction
  ON source_documents(jurisdiction_id);

CREATE INDEX IF NOT EXISTS idx_source_documents_category
  ON source_documents(category_key);

-- -----------------------------------------------------------------------------
-- scan_history
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS scan_history (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  jurisdiction_id    VARCHAR(100) REFERENCES jurisdictions(id),
  scanned_at         TIMESTAMPTZ DEFAULT NOW(),
  image_key          VARCHAR(500),
  objects            JSONB NOT NULL,
  items_count        SMALLINT NOT NULL,
  recyclable_count   SMALLINT NOT NULL,
  CONSTRAINT scan_history_counts_chk CHECK (
    items_count >= 0 AND recyclable_count >= 0 AND recyclable_count <= items_count
  )
);

CREATE INDEX IF NOT EXISTS idx_history_user
  ON scan_history(user_id, scanned_at DESC);

-- -----------------------------------------------------------------------------
-- user_notifications
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_notifications (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  jurisdiction_id  VARCHAR(100) REFERENCES jurisdictions(id),
  apns_token       VARCHAR(512),
  notify_recycling  BOOLEAN DEFAULT TRUE,
  notify_yard_waste BOOLEAN DEFAULT TRUE,
  notify_bulk      BOOLEAN DEFAULT FALSE,
  reminder_time    TIME DEFAULT '20:00:00',
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, jurisdiction_id)
);

CREATE INDEX IF NOT EXISTS idx_user_notifications_user
  ON user_notifications(user_id);

CREATE INDEX IF NOT EXISTS idx_user_notifications_jurisdiction
  ON user_notifications(jurisdiction_id);
