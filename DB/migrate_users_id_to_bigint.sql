-- Converts users.id from UUID to BIGINT GENERATED ALWAYS AS IDENTITY.
-- All affected tables (users, scan_history, user_notifications) are empty at
-- migration time, so this drops and recreates rather than doing a data-preserving
-- rebuild. If any of these tables gain rows before this runs, back them up first.

BEGIN;

DROP TABLE IF EXISTS user_notifications;
DROP TABLE IF EXISTS scan_history;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
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

CREATE TABLE scan_history (
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

CREATE TABLE user_notifications (
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

COMMIT;
