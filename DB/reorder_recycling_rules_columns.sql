-- Rebuild recycling_rules so id is physically the first column again
-- (Postgres has no ALTER TABLE ... REORDER COLUMN; a prior DROP/ADD
-- of id appended it at the end). Data, indexes, and constraints preserved.

BEGIN;

CREATE TABLE recycling_rules_new (
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

INSERT INTO recycling_rules_new (
  id, jurisdiction_id, material_name, material_code, category, is_accepted,
  preparation_steps, rejection_reason, special_notes, effective_from,
  effective_to, created_at, updated_at
) OVERRIDING SYSTEM VALUE
SELECT
  id, jurisdiction_id, material_name, material_code, category, is_accepted,
  preparation_steps, rejection_reason, special_notes, effective_from,
  effective_to, created_at, updated_at
FROM recycling_rules
ORDER BY id;

SELECT setval(
  pg_get_serial_sequence('recycling_rules_new', 'id'),
  COALESCE((SELECT max(id) FROM recycling_rules_new), 0) + 1,
  false
);

DROP TABLE recycling_rules;
ALTER TABLE recycling_rules_new RENAME TO recycling_rules;

ALTER INDEX recycling_rules_new_pkey RENAME TO recycling_rules_pkey;
ALTER INDEX recycling_rules_new_jurisdiction_id_material_name_key
  RENAME TO recycling_rules_jurisdiction_id_material_name_key;

CREATE INDEX IF NOT EXISTS idx_rules_jurisdiction
  ON recycling_rules(jurisdiction_id);

CREATE INDEX IF NOT EXISTS idx_rules_category
  ON recycling_rules(category);

COMMIT;
