-- Add document_type and category_key to source_documents so image assets
-- (e.g. a county curbside recycling infographic) can be tracked alongside
-- PDF guides, and optionally scoped to a specific category (e.g. 'curbside')
-- rather than shown for every category in a jurisdiction.

BEGIN;

ALTER TABLE source_documents
  ADD COLUMN IF NOT EXISTS document_type VARCHAR(20) NOT NULL DEFAULT 'PDF',
  ADD COLUMN IF NOT EXISTS category_key VARCHAR(50);

ALTER TABLE source_documents
  ADD CONSTRAINT source_documents_document_type_chk CHECK (
    document_type IN ('PDF', 'IMAGE')
  );

CREATE INDEX IF NOT EXISTS idx_source_documents_category
  ON source_documents(category_key);

COMMIT;
