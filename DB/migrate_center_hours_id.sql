-- Change center_hours.id from UUID to auto-incrementing BIGINT, and
-- rebuild the table so columns are physically ordered per schema.sql
-- (id, center_id, day_of_week, open_time, close_time, notes).
-- No other table has a foreign key to center_hours.id.

BEGIN;

CREATE TABLE center_hours_new (
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

INSERT INTO center_hours_new (center_id, day_of_week, open_time, close_time, notes)
SELECT center_id, day_of_week, open_time, close_time, notes
FROM center_hours
ORDER BY center_id, day_of_week;

DROP TABLE center_hours;
ALTER TABLE center_hours_new RENAME TO center_hours;

ALTER INDEX center_hours_new_pkey RENAME TO center_hours_pkey;
ALTER TABLE center_hours RENAME CONSTRAINT center_hours_new_center_id_fkey TO center_hours_center_id_fkey;

CREATE INDEX IF NOT EXISTS idx_center_hours_center_day
  ON center_hours(center_id, day_of_week);

COMMIT;
