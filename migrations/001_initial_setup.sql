-- Migración inicial: Crear función helper y tabla de control de migraciones
-- Esta migración debe ejecutarse PRIMERO desde el SQL Editor de Supabase

-- 1. Crear función helper para ejecutar SQL dinámicamente
CREATE OR REPLACE FUNCTION exec_sql(sql_query text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  EXECUTE sql_query;
END;
$$;

-- 2. Crear tabla de control de migraciones
CREATE TABLE IF NOT EXISTS cursor_migrations (
  id SERIAL PRIMARY KEY,
  filename TEXT NOT NULL UNIQUE,
  checksum TEXT NOT NULL,
  executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Crear índice para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_cursor_migrations_filename ON cursor_migrations(filename);

-- Comentario: Esta función permite que el script de migración ejecute SQL dinámicamente
-- IMPORTANTE: Esta función tiene SECURITY DEFINER, lo que le da permisos absolutos
-- Solo debe ser accesible con la Service Role Key

