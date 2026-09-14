-- Change pickup_schedules.id from UUID to auto-incrementing BIGINT,
-- and rebuild the table so id is physically the first column
-- (Postgres has no ALTER TABLE ... REORDER COLUMN).
-- No other table has a foreign key to pickup_schedules.id.

BEGIN;

CREATE TABLE pickup_schedules_new (
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

INSERT INTO pickup_schedules_new (
  jurisdiction_id, schedule_type, frequency, day_of_week, week_of_month,
  accepted_materials, preparation_notes, effective_from, effective_to, created_at
)
SELECT
  jurisdiction_id, schedule_type, frequency, day_of_week, week_of_month,
  accepted_materials, preparation_notes, effective_from, effective_to, created_at
FROM pickup_schedules
ORDER BY created_at;

DROP TABLE pickup_schedules;
ALTER TABLE pickup_schedules_new RENAME TO pickup_schedules;

ALTER INDEX pickup_schedules_new_pkey RENAME TO pickup_schedules_pkey;
ALTER TABLE pickup_schedules RENAME CONSTRAINT pickup_schedules_new_jurisdiction_id_fkey TO pickup_schedules_jurisdiction_id_fkey;

COMMIT;
