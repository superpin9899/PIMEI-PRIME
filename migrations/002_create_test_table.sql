-- Crea tabla de prueba
CREATE TABLE IF NOT EXISTS test (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

