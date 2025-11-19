-- Create admin profiles table linked to Supabase auth.users
create table if not exists admin_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  role text not null default 'admin',
  created_at timestamptz not null default now()
);

comment on table admin_profiles is 'Stores metadata for administrator accounts linked to Supabase auth.users.';

