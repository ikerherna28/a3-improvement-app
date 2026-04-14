ALTER TABLE raw_data
ADD COLUMN IF NOT EXISTS content_hash VARCHAR(64),
ADD COLUMN IF NOT EXISTS original_filename VARCHAR(255),
ADD COLUMN IF NOT EXISTS record_key VARCHAR(120);

CREATE UNIQUE INDEX IF NOT EXISTS raw_data_content_hash_uidx ON raw_data(content_hash);
CREATE INDEX IF NOT EXISTS raw_data_source_type_idx ON raw_data(source_type);
CREATE INDEX IF NOT EXISTS raw_data_record_key_idx ON raw_data(record_key);
