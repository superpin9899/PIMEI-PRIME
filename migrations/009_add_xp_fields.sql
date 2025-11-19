alter table prime_users
  add column if not exists xp_total numeric default 0 not null,
  add column if not exists level integer default 0 not null,
  add column if not exists xp_next_threshold numeric default 100 not null;

