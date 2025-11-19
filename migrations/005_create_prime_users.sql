-- Create table to almacenar los beneficiarios del programa PRIME
create table if not exists prime_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  email text not null unique,
  phone text,
  birthdate date,
  gender text check (gender in ('female','male','nonbinary','other')),
  province text check (province in ('Zaragoza','Huesca','Teruel')),
  program_lot text, -- Lote asignado (ej. ZAR-01)
  is_active boolean not null default true,
  percentage_progress numeric(5,2) not null default 0,
  is_woman boolean,
  receives_benefits boolean,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table prime_users is 'Participantes del programa PRIME (beneficiarios, no admins).';

create or replace function set_prime_users_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

create trigger handle_prime_users_updated_at
  before update on prime_users
  for each row
  execute procedure set_prime_users_updated_at();

-- RLS: habilitamos políticas basadas en roles (admin vs participante)
alter table prime_users enable row level security;

create policy "Admins pueden gestionar todos los usuarios" on prime_users
  for all
  using (
    exists(
      select 1
      from admin_profiles ap
      where ap.user_id = auth.uid()
        and ap.role = 'admin'
    )
  )
  with check (
    exists(
      select 1
      from admin_profiles ap
      where ap.user_id = auth.uid()
        and ap.role = 'admin'
    )
  );

create policy "Participantes leen su propio perfil" on prime_users
  for select
  using (user_id = auth.uid());

create policy "Participantes actualizan su propio perfil" on prime_users
  for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "Participantes crean su fila (autoregistro)" on prime_users
  for insert
  with check (user_id = auth.uid());

