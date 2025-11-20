-- Logro: Empieza la aventura

insert into achievements (
  slug,
  title,
  description,
  rarity,
  xp_reward,
  auto_grant,
  auto_grant_key,
  manual_grant_allowed,
  is_active,
  created_at
)
values (
  'empieza-la-aventura',
  'Empieza la aventura',
  'Has añadido 1 acción formativa y 1 experiencia profesional',
  'common',
  110,
  true,
  'first_training_experience',
  true,
  true,
  now()
)
on conflict (slug) do update
set
  title = excluded.title,
  description = excluded.description,
  rarity = excluded.rarity,
  xp_reward = excluded.xp_reward,
  auto_grant = excluded.auto_grant,
  auto_grant_key = excluded.auto_grant_key,
  manual_grant_allowed = excluded.manual_grant_allowed,
  is_active = excluded.is_active;

create or replace function try_unlock_empieza_aventura()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  ach_id uuid;
begin
  select id into ach_id from achievements where slug = 'empieza-la-aventura' limit 1;
  if ach_id is null then
    return new;
  end if;

  if exists (
    select 1
    from user_achievements
    where achievement_id = ach_id
      and user_id = new.user_id
  ) then
    return new;
  end if;

  if exists (select 1 from user_training where user_id = new.user_id limit 1)
     and exists (select 1 from user_experience where user_id = new.user_id limit 1) then
    begin
      insert into user_achievements (
        id,
        achievement_id,
        user_id,
        unlocked_at,
        source,
        granted_by,
        metadata
      )
      values (
        gen_random_uuid(),
        ach_id,
        new.user_id,
        now(),
        'auto',
        null,
        jsonb_build_object('auto_grant_key', 'first_training_experience')
      )
      on conflict do nothing;
    exception
      when unique_violation then
        null;
    end;

    perform add_experience(new.user_id, 110);
  end if;

  return new;
end;
$$;

drop trigger if exists trg_empieza_aventura_training on user_training;
create trigger trg_empieza_aventura_training
  after insert on user_training
  for each row
  execute procedure try_unlock_empieza_aventura();

drop trigger if exists trg_empieza_aventura_experience on user_experience;
create trigger trg_empieza_aventura_experience
  after insert on user_experience
  for each row
  execute procedure try_unlock_empieza_aventura();


