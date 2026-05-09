
-- 1. Roles enum and table
create type public.app_role as enum ('admin', 'doctor', 'receptionist', 'patient');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
alter table public.user_roles enable row level security;

-- Security definer role helpers
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create or replace function public.is_staff(_user_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role in ('admin','doctor','receptionist')
  )
$$;

-- 2. Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

-- 3. Patients
create table public.patients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  full_name text not null,
  age integer check (age >= 0 and age <= 150),
  gender text check (gender in ('male','female','other')),
  phone text,
  address text,
  medical_history text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.patients enable row level security;
create index on public.patients (user_id);
create index on public.patients (full_name);

-- 4. Doctors
create table public.doctors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  full_name text not null,
  specialization text not null,
  phone text,
  email text,
  availability jsonb not null default '{}'::jsonb, -- e.g. {"mon":["09:00-13:00"], ...}
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.doctors enable row level security;
create index on public.doctors (user_id);

-- 5. Appointments
create type public.appointment_status as enum ('pending','approved','completed','cancelled');

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references public.patients(id) on delete cascade not null,
  doctor_id uuid references public.doctors(id) on delete cascade not null,
  scheduled_at timestamptz not null,
  status appointment_status not null default 'pending',
  reason text,
  notes text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.appointments enable row level security;
create index on public.appointments (patient_id);
create index on public.appointments (doctor_id);
create index on public.appointments (scheduled_at);

-- 6. Medical Records (includes prescription items as jsonb)
create table public.medical_records (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references public.patients(id) on delete cascade not null,
  doctor_id uuid references public.doctors(id) on delete set null,
  appointment_id uuid references public.appointments(id) on delete set null,
  diagnosis text,
  notes text,
  prescription jsonb not null default '[]'::jsonb, -- [{drug, dosage, instructions}]
  report_files jsonb not null default '[]'::jsonb, -- [{name, url, mime}]
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.medical_records enable row level security;
create index on public.medical_records (patient_id);

-- 7. Bills
create type public.payment_status as enum ('paid','unpaid');

create table public.bills (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references public.patients(id) on delete cascade not null,
  appointment_id uuid references public.appointments(id) on delete set null,
  services jsonb not null default '[]'::jsonb, -- [{name, qty, price}]
  total numeric(10,2) not null default 0,
  status payment_status not null default 'unpaid',
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.bills enable row level security;
create index on public.bills (patient_id);

-- 8. Updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

create trigger trg_profiles_updated before update on public.profiles for each row execute function public.set_updated_at();
create trigger trg_patients_updated before update on public.patients for each row execute function public.set_updated_at();
create trigger trg_doctors_updated before update on public.doctors for each row execute function public.set_updated_at();
create trigger trg_appointments_updated before update on public.appointments for each row execute function public.set_updated_at();
create trigger trg_records_updated before update on public.medical_records for each row execute function public.set_updated_at();
create trigger trg_bills_updated before update on public.bills for each row execute function public.set_updated_at();

-- 9. New user trigger -> profile + default 'patient' role
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name',''), coalesce(new.raw_user_meta_data->>'phone',''));
  insert into public.user_roles (user_id, role) values (new.id, 'patient');
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 10. RLS policies

-- user_roles
create policy "users insert own role" on public.user_roles for insert with check (auth.uid() = user_id and role in ('patient','doctor','receptionist','lab_officer'));
create policy "users see own roles" on public.user_roles for select using (auth.uid() = user_id);
create policy "admins see all roles" on public.user_roles for select using (public.has_role(auth.uid(),'admin'));
create policy "admins manage roles" on public.user_roles for all using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- profiles
create policy "users insert own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "view own profile" on public.profiles for select using (auth.uid() = id);
create policy "staff view all profiles" on public.profiles for select using (public.is_staff(auth.uid()));
create policy "update own profile" on public.profiles for update using (auth.uid() = id);
create policy "admin update any profile" on public.profiles for update using (public.has_role(auth.uid(),'admin'));

-- patients
create policy "staff view patients" on public.patients for select using (public.is_staff(auth.uid()));
create policy "patient view own" on public.patients for select using (auth.uid() = user_id);
create policy "staff insert patients" on public.patients for insert with check (public.is_staff(auth.uid()));
create policy "staff update patients" on public.patients for update using (public.is_staff(auth.uid()));
create policy "admin delete patients" on public.patients for delete using (public.has_role(auth.uid(),'admin'));

-- doctors
create policy "anyone authed view doctors" on public.doctors for select using (auth.uid() is not null);
create policy "admin manage doctors" on public.doctors for all using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create policy "doctor update self" on public.doctors for update using (auth.uid() = user_id);

-- appointments
create policy "staff view appointments" on public.appointments for select using (public.is_staff(auth.uid()));
create policy "patient view own appointments" on public.appointments for select
  using (exists (select 1 from public.patients p where p.id = appointments.patient_id and p.user_id = auth.uid()));
create policy "staff or patient create appointment" on public.appointments for insert with check (
  public.is_staff(auth.uid())
  or exists (select 1 from public.patients p where p.id = patient_id and p.user_id = auth.uid())
);
create policy "staff update appointments" on public.appointments for update using (public.is_staff(auth.uid()));
create policy "admin delete appointments" on public.appointments for delete using (public.has_role(auth.uid(),'admin'));

-- medical_records
create policy "staff view records" on public.medical_records for select using (public.is_staff(auth.uid()));
create policy "patient view own records" on public.medical_records for select
  using (exists (select 1 from public.patients p where p.id = medical_records.patient_id and p.user_id = auth.uid()));
create policy "doctor or admin insert records" on public.medical_records for insert with check (
  public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'doctor')
);
create policy "doctor or admin update records" on public.medical_records for update using (
  public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'doctor')
);
create policy "admin delete records" on public.medical_records for delete using (public.has_role(auth.uid(),'admin'));

-- bills
create policy "staff view bills" on public.bills for select using (public.is_staff(auth.uid()));
create policy "patient view own bills" on public.bills for select
  using (exists (select 1 from public.patients p where p.id = bills.patient_id and p.user_id = auth.uid()));
create policy "staff insert bills" on public.bills for insert with check (public.is_staff(auth.uid()));
create policy "staff update bills" on public.bills for update using (public.is_staff(auth.uid()));
create policy "admin delete bills" on public.bills for delete using (public.has_role(auth.uid(),'admin'));

-- 11. Storage bucket for medical reports (private)
insert into storage.buckets (id, name, public) values ('medical-reports','medical-reports', false)
on conflict (id) do nothing;

create policy "staff read reports" on storage.objects for select
  using (bucket_id = 'medical-reports' and public.is_staff(auth.uid()));
create policy "staff upload reports" on storage.objects for insert
  with check (bucket_id = 'medical-reports' and public.is_staff(auth.uid()));
create policy "staff update reports" on storage.objects for update
  using (bucket_id = 'medical-reports' and public.is_staff(auth.uid()));
create policy "staff delete reports" on storage.objects for delete
  using (bucket_id = 'medical-reports' and public.is_staff(auth.uid()));
