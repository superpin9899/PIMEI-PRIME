create or replace function compute_xp_threshold(user_level integer)
returns numeric
language sql
immutable
as $$
  select 100 * power(user_level + 1, 2);
$$;

create or replace function add_experience(target_user uuid, amount numeric)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_level integer;
  current_xp numeric;
  next_threshold numeric;
  xp_gain numeric := greatest(amount, 0);
begin
  select level, xp_total
  into current_level, current_xp
  from prime_users
  where user_id = target_user
  for update;

  if not found then
    raise exception 'User % not found in prime_users', target_user;
  end if;

  current_level := coalesce(current_level, 0);
  current_xp := coalesce(current_xp, 0) + xp_gain;

  loop
    next_threshold := compute_xp_threshold(current_level);
    exit when current_xp < next_threshold;
    current_level := current_level + 1;
  end loop;

  update prime_users
  set xp_total = current_xp,
      level = current_level,
      xp_next_threshold = compute_xp_threshold(current_level)
  where user_id = target_user;

  return jsonb_build_object(
    'user_id', target_user,
    'xp_total', current_xp,
    'level', current_level,
    'xp_next_threshold', compute_xp_threshold(current_level)
  );
end;
$$;

