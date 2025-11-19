create table if not exists user_training (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  provider text,
  start_date date,
  end_date date,
  description text,
  created_at timestamptz default now()
);

create table if not exists user_experience (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  company text not null,
  role text not null,
  start_date date,
  end_date date,
  description text,
  created_at timestamptz default now()
);

alter table user_training enable row level security;
alter table user_experience enable row level security;

create policy "Usuarios gestionan sus formaciones" on user_training
  for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "Usuarios gestionan su experiencia" on user_experience
  for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

