create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  requested_role text;
  final_role public.app_role;
  display_name text;
  phone_number text;
  specialization text;
begin
  display_name := coalesce(new.raw_user_meta_data->>'full_name', '');
  phone_number := coalesce(new.raw_user_meta_data->>'phone', '');
  specialization := coalesce(new.raw_user_meta_data->>'specialization', 'General Practice');

  insert into public.profiles (id, full_name, phone)
  values (new.id, display_name, phone_number)
  on conflict (id) do update
    set full_name = excluded.full_name,
        phone = excluded.phone;

  requested_role := coalesce(new.raw_user_meta_data->>'role', 'patient');

  if requested_role in ('patient','doctor','receptionist') then
    final_role := requested_role::public.app_role;
  else
    final_role := 'patient'::public.app_role;
  end if;

  insert into public.user_roles (user_id, role) values (new.id, final_role)
  on conflict (user_id, role) do nothing;

  if final_role = 'patient' then
    insert into public.patients (user_id, full_name, phone, created_by)
    values (new.id, display_name, phone_number, new.id)
    on conflict do nothing;
  elsif final_role = 'doctor' then
    insert into public.doctors (user_id, full_name, specialization, phone, email)
    values (new.id, display_name, specialization, phone_number, new.email)
    on conflict do nothing;
  end if;

  return new;
end
$$;

-- Backfill missing profiles for existing auth users.
insert into public.profiles (id, full_name, phone)
select
  u.id,
  coalesce(u.raw_user_meta_data->>'full_name', ''),
  coalesce(u.raw_user_meta_data->>'phone', '')
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null;

-- Backfill missing patient records for users with the patient role.
insert into public.patients (user_id, full_name, phone, created_by)
select
  u.id,
  coalesce(p.full_name, u.raw_user_meta_data->>'full_name', ''),
  coalesce(p.phone, u.raw_user_meta_data->>'phone', ''),
  u.id
from auth.users u
join public.user_roles r on r.user_id = u.id and r.role = 'patient'
left join public.patients pt on pt.user_id = u.id
left join public.profiles p on p.id = u.id
where pt.id is null;

-- Backfill missing doctor records for users with the doctor role.
insert into public.doctors (user_id, full_name, specialization, phone, email)
select
  u.id,
  coalesce(p.full_name, u.raw_user_meta_data->>'full_name', 'Doctor'),
  coalesce(u.raw_user_meta_data->>'specialization', 'General Practice'),
  coalesce(p.phone, u.raw_user_meta_data->>'phone'),
  u.email
from auth.users u
join public.user_roles r on r.user_id = u.id and r.role = 'doctor'
left join public.doctors d on d.user_id = u.id
left join public.profiles p on p.id = u.id
where d.id is null;

-- Allow users to self-materialize their own records when needed.
create policy "patient insert own" on public.patients for insert with check (auth.uid() = user_id);
create policy "doctor insert own" on public.doctors for insert with check (auth.uid() = user_id);

create or replace function public.sync_role_record()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  profile_name text;
  profile_phone text;
  profile_email text;
begin
  select p.full_name, p.phone, au.email
    into profile_name, profile_phone, profile_email
  from auth.users au
  left join public.profiles p on p.id = au.id
  where au.id = new.user_id;

  if new.role = 'patient' then
    insert into public.patients (user_id, full_name, phone, created_by)
    select new.user_id, coalesce(profile_name, 'Patient'), profile_phone, new.user_id
    where not exists (select 1 from public.patients where user_id = new.user_id);
  elsif new.role = 'doctor' then
    insert into public.doctors (user_id, full_name, specialization, phone, email)
    select new.user_id, coalesce(profile_name, 'Doctor'), 'General Practice', profile_phone, profile_email
    where not exists (select 1 from public.doctors where user_id = new.user_id);
  end if;

  return new;
end
$$;

drop trigger if exists trg_user_roles_sync on public.user_roles;
create trigger trg_user_roles_sync
after insert or update on public.user_roles
for each row execute function public.sync_role_record();

-- Recreate the trigger so future signups create the linked records too.
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();