CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(180) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS raw_data (
  id BIGSERIAL PRIMARY KEY,
  source_name VARCHAR(180) NOT NULL,
  source_type VARCHAR(40) NOT NULL,
  payload JSONB NOT NULL,
  uploaded_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
  uploaded_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS a3_registros (
  id BIGSERIAL PRIMARY KEY,
  codigo VARCHAR(50) NOT NULL UNIQUE,
  titulo VARCHAR(200) NOT NULL,
  descripcion_problema TEXT NOT NULL,
  causa_raiz TEXT,
  accion_correctiva TEXT,
  estado VARCHAR(30) NOT NULL DEFAULT 'abierto',
  prioridad VARCHAR(20) NOT NULL DEFAULT 'media',
  area VARCHAR(120) NOT NULL,
  created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
  raw_data_id BIGINT REFERENCES raw_data(id) ON DELETE SET NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  closed_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);
CREATE INDEX IF NOT EXISTS users_role_idx ON users(role);

CREATE INDEX IF NOT EXISTS raw_data_uploaded_by_idx ON raw_data(uploaded_by);
CREATE INDEX IF NOT EXISTS raw_data_uploaded_at_idx ON raw_data(uploaded_at);
CREATE INDEX IF NOT EXISTS raw_data_source_name_idx ON raw_data(source_name);

CREATE INDEX IF NOT EXISTS a3_registros_estado_idx ON a3_registros(estado);
CREATE INDEX IF NOT EXISTS a3_registros_prioridad_idx ON a3_registros(prioridad);
CREATE INDEX IF NOT EXISTS a3_registros_area_idx ON a3_registros(area);
CREATE INDEX IF NOT EXISTS a3_registros_created_by_idx ON a3_registros(created_by);
CREATE INDEX IF NOT EXISTS a3_registros_raw_data_id_idx ON a3_registros(raw_data_id);
CREATE INDEX IF NOT EXISTS a3_registros_created_at_idx ON a3_registros(created_at);
