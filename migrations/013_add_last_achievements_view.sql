alter table prime_users
  add column if not exists last_achievements_view_at timestamptz;

