-- Change recycling_rules.id from UUID to auto-incrementing BIGINT.
-- No other table has a foreign key to recycling_rules.id, so this is
-- a self-contained column swap; existing rows get fresh sequential ids.

BEGIN;

ALTER TABLE recycling_rules DROP CONSTRAINT recycling_rules_pkey;
ALTER TABLE recycling_rules DROP COLUMN id;
ALTER TABLE recycling_rules ADD COLUMN id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY;

COMMIT;
