ALTER TABLE a3_registros
ADD COLUMN IF NOT EXISTS pareto_data JSONB;

CREATE TABLE IF NOT EXISTS a3_raw_data_rel (
  id BIGSERIAL PRIMARY KEY,
  a3_id BIGINT NOT NULL REFERENCES a3_registros(id) ON DELETE CASCADE,
  raw_data_id BIGINT NOT NULL REFERENCES raw_data(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (a3_id, raw_data_id)
);

CREATE INDEX IF NOT EXISTS a3_raw_data_rel_a3_id_idx ON a3_raw_data_rel(a3_id);
CREATE INDEX IF NOT EXISTS a3_raw_data_rel_raw_data_id_idx ON a3_raw_data_rel(raw_data_id);
CREATE INDEX IF NOT EXISTS a3_registros_estado_upper_idx ON a3_registros(estado);
