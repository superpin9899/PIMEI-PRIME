-- Eliminamos referencias a lotes (máximo 30 usuarios únicos por entidad)
alter table prime_users
  drop column if exists program_lot;

