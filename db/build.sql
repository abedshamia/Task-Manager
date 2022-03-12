BEGIN;

DROP TABLE IF EXISTS tasks CASCADE;

CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  description TEXT DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO tasks (name, completed, description) VALUES ('Learn SQL', false, 'Learn SQL'), ('Learn Postgres', true, 'Learn Postgres'), ('Learn MySQL', false, 'Learn MySQL');

COMMIT;

