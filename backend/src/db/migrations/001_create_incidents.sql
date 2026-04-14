CREATE TABLE IF NOT EXISTS incidents (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  area VARCHAR(120) NOT NULL,
  problem_description TEXT NOT NULL,
  root_cause TEXT,
  corrective_action TEXT,
  status VARCHAR(30) NOT NULL DEFAULT 'open',
  priority VARCHAR(20) NOT NULL DEFAULT 'medium',
  owner VARCHAR(120),
  due_date DATE,
  closed_at TIMESTAMP,
  ai_summary TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS incidents_status_idx ON incidents(status);
CREATE INDEX IF NOT EXISTS incidents_area_idx ON incidents(area);
CREATE INDEX IF NOT EXISTS incidents_priority_idx ON incidents(priority);
