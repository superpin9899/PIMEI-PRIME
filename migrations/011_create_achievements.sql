-- Tablas base para el sistema de logros (autogestionados y manuales)

do $$
begin
  create type achievement_rarity as enum ('common', 'rare', 'epic', 'legendary', 'celestial');
exception
  when duplicate_object then null;
end;
$$;

create table if not exists achievements (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  rarity achievement_rarity not null default 'common',
  rarity_color text generated always as (
    case rarity
      when 'common' then '#9CA3AF'       -- Gris
      when 'rare' then '#3B82F6'         -- Azul
      when 'epic' then '#8B5CF6'         -- Morado
      when 'legendary' then '#F97316'    -- Naranja
      when 'celestial' then '#FDE68A'    -- Arcoíris brillante (gradiente manejado en frontend)
    end
  ) stored,
  xp_reward integer not null default 0 check (xp_reward >= 0),
  auto_grant boolean not null default false,
  auto_grant_key text,
  auto_grant_config jsonb not null default '{}'::jsonb,
  manual_grant_allowed boolean not null default true,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

comment on table achievements is 'Catálogo de logros del ecosistema PRIME.';
comment on column achievements.auto_grant_key is 'Identificador que usa el backend para calcular logros automáticos.';

create table if not exists user_achievements (
  id uuid primary key default gen_random_uuid(),
  achievement_id uuid not null references achievements(id) on delete cascade,
  user_id uuid not null references prime_users(user_id) on delete cascade,
  unlocked_at timestamptz not null default now(),
  source text not null check (source in ('auto','manual')),
  granted_by uuid references admin_profiles(user_id),
  metadata jsonb not null default '{}'::jsonb,
  unique (achievement_id, user_id)
);

create index if not exists idx_user_achievements_user_id on user_achievements(user_id);
create index if not exists idx_user_achievements_achievement_id on user_achievements(achievement_id);

comment on table user_achievements is 'Relación de logros ya desbloqueados por cada participante.';
comment on column user_achievements.source is 'auto = calculado por reglas, manual = asignado por un técnico.';

alter table achievements enable row level security;
alter table user_achievements enable row level security;

drop policy if exists "Todos leen el catálogo de logros" on achievements;
create policy "Todos leen el catálogo de logros"
  on achievements
  for select
  using (true);

drop policy if exists "Admins gestionan el catálogo de logros" on achievements;
create policy "Admins gestionan el catálogo de logros"
  on achievements
  for all
  using (
    exists (
      select 1
      from admin_profiles ap
      where ap.user_id = auth.uid()
        and ap.role = 'admin'
    )
  )
  with check (
    exists (
      select 1
      from admin_profiles ap
      where ap.user_id = auth.uid()
        and ap.role = 'admin'
    )
  );

drop policy if exists "Participantes ven sus logros" on user_achievements;
create policy "Participantes ven sus logros"
  on user_achievements
  for select
  using (user_id = auth.uid());

drop policy if exists "Admins gestionan los logros de usuarios" on user_achievements;
create policy "Admins gestionan los logros de usuarios"
  on user_achievements
  for all
  using (
    exists (
      select 1
      from admin_profiles ap
      where ap.user_id = auth.uid()
        and ap.role = 'admin'
    )
  )
  with check (
    exists (
      select 1
      from admin_profiles ap
      where ap.user_id = auth.uid()
        and ap.role = 'admin'
    )
  );

