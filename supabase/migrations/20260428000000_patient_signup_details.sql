create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  requested_role text;
  final_role public.app_role;
  display_name text;
  phone_number text;
  specialization text;
  patient_age integer;
  patient_gender text;
  patient_address text;
begin
  display_name := coalesce(new.raw_user_meta_data->>'full_name', '');
  phone_number := coalesce(new.raw_user_meta_data->>'phone', '');
  specialization := coalesce(new.raw_user_meta_data->>'specialization', 'General Practice');
  patient_age := case
    when coalesce(new.raw_user_meta_data->>'age', '') ~ '^[0-9]+$' then (new.raw_user_meta_data->>'age')::integer
    else null
  end;
  patient_gender := nullif(coalesce(new.raw_user_meta_data->>'gender', ''), '');
  patient_address := nullif(coalesce(new.raw_user_meta_data->>'address', ''), '');

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
    insert into public.patients (user_id, full_name, age, gender, phone, address, created_by)
    values (new.id, display_name, patient_age, patient_gender, phone_number, patient_address, new.id)
    on conflict do nothing;
  elsif final_role = 'doctor' then
    insert into public.doctors (user_id, full_name, specialization, phone, email)
    values (new.id, display_name, specialization, phone_number, new.email)
    on conflict do nothing;
  end if;

  return new;
end
$$;

create or replace function public.sync_role_record()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  profile_name text;
  profile_phone text;
  profile_email text;
  patient_age integer;
  patient_gender text;
  patient_address text;
begin
  select
    p.full_name,
    p.phone,
    au.email,
    case
      when coalesce(au.raw_user_meta_data->>'age', '') ~ '^[0-9]+$' then (au.raw_user_meta_data->>'age')::integer
      else null
    end,
    nullif(coalesce(au.raw_user_meta_data->>'gender', ''), ''),
    nullif(coalesce(au.raw_user_meta_data->>'address', ''), '')
    into profile_name, profile_phone, profile_email, patient_age, patient_gender, patient_address
  from auth.users au
  left join public.profiles p on p.id = au.id
  where au.id = new.user_id;

  if new.role = 'patient' then
    insert into public.patients (user_id, full_name, age, gender, phone, address, created_by)
    select new.user_id, coalesce(profile_name, 'Patient'), patient_age, patient_gender, profile_phone, patient_address, new.user_id
    where not exists (select 1 from public.patients where user_id = new.user_id);
  elsif new.role = 'doctor' then
    insert into public.doctors (user_id, full_name, specialization, phone, email)
    select new.user_id, coalesce(profile_name, 'Doctor'), 'General Practice', profile_phone, profile_email
    where not exists (select 1 from public.doctors where user_id = new.user_id);
  end if;

  return new;
end
$$;

insert into public.patients (user_id, full_name, age, gender, phone, address, created_by)
select
  u.id,
  coalesce(p.full_name, u.raw_user_meta_data->>'full_name', ''),
  case
    when coalesce(u.raw_user_meta_data->>'age', '') ~ '^[0-9]+$' then (u.raw_user_meta_data->>'age')::integer
    else null
  end,
  nullif(coalesce(u.raw_user_meta_data->>'gender', ''), ''),
  coalesce(p.phone, u.raw_user_meta_data->>'phone', ''),
  nullif(coalesce(u.raw_user_meta_data->>'address', ''), ''),
  u.id
from auth.users u
join public.user_roles r on r.user_id = u.id and r.role = 'patient'
left join public.patients pt on pt.user_id = u.id
left join public.profiles p on p.id = u.id
where pt.id is null;