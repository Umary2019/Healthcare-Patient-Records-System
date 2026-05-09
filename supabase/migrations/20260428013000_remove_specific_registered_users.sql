do $$
declare
  deleted_users integer := 0;
  deleted_profiles integer := 0;
  deleted_patients integer := 0;
  deleted_doctors integer := 0;
  deleted_appointments integer := 0;
  deleted_records integer := 0;
  deleted_bills integer := 0;
begin
  create temporary table _target_names(name text) on commit drop;
  insert into _target_names(name)
  values
    ('Amina nuhu'),
    ('Salim Fusami'),
    ('Abdallah Abubakar'),
    ('Umar Abubakar');

  create temporary table _target_user_ids(id uuid primary key) on commit drop;
  insert into _target_user_ids(id)
  select distinct u.id
  from auth.users u
  left join public.profiles p on p.id = u.id
  where lower(trim(coalesce(p.full_name, u.raw_user_meta_data->>'full_name', ''))) in (
    select lower(trim(name)) from _target_names
  );

  create temporary table _target_patient_ids(id uuid primary key) on commit drop;
  insert into _target_patient_ids(id)
  select distinct p.id
  from public.patients p
  where lower(trim(coalesce(p.full_name, ''))) in (select lower(trim(name)) from _target_names)
     or p.user_id in (select id from _target_user_ids);

  create temporary table _target_doctor_ids(id uuid primary key) on commit drop;
  insert into _target_doctor_ids(id)
  select distinct d.id
  from public.doctors d
  where lower(trim(coalesce(d.full_name, ''))) in (select lower(trim(name)) from _target_names)
     or d.user_id in (select id from _target_user_ids);

  delete from public.medical_records mr
  where mr.patient_id in (select id from _target_patient_ids)
     or mr.doctor_id in (select id from _target_doctor_ids);
  get diagnostics deleted_records = row_count;

  delete from public.bills b
  where b.patient_id in (select id from _target_patient_ids);
  get diagnostics deleted_bills = row_count;

  delete from public.appointments a
  where a.patient_id in (select id from _target_patient_ids)
     or a.doctor_id in (select id from _target_doctor_ids);
  get diagnostics deleted_appointments = row_count;

  delete from public.patients p
  where p.id in (select id from _target_patient_ids)
     or lower(trim(coalesce(p.full_name, ''))) in (select lower(trim(name)) from _target_names);
  get diagnostics deleted_patients = row_count;

  delete from public.doctors d
  where d.id in (select id from _target_doctor_ids)
     or lower(trim(coalesce(d.full_name, ''))) in (select lower(trim(name)) from _target_names);
  get diagnostics deleted_doctors = row_count;

  delete from public.profiles p
  where p.id in (select id from _target_user_ids)
     or lower(trim(coalesce(p.full_name, ''))) in (select lower(trim(name)) from _target_names);
  get diagnostics deleted_profiles = row_count;

  delete from auth.users u
  where u.id in (select id from _target_user_ids)
     or lower(trim(coalesce(u.raw_user_meta_data->>'full_name', ''))) in (select lower(trim(name)) from _target_names);
  get diagnostics deleted_users = row_count;

  raise notice 'Deleted users: %', deleted_users;
  raise notice 'Deleted profiles: %', deleted_profiles;
  raise notice 'Deleted patients: %', deleted_patients;
  raise notice 'Deleted doctors: %', deleted_doctors;
  raise notice 'Deleted appointments: %', deleted_appointments;
  raise notice 'Deleted medical_records: %', deleted_records;
  raise notice 'Deleted bills: %', deleted_bills;
end
$$;
