-- CareRecords / Healthcare Patient Records System
-- Paste this whole script into the Supabase SQL editor for project ciozzjjkbigbxmzfhyub.
-- It creates the schema the app expects and is safe to run on a fresh or partially provisioned project.

-- 1) Enums
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'doctor', 'receptionist', 'patient', 'lab_officer');
  ELSE
    BEGIN
      ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'lab_officer';
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'appointment_status') THEN
    CREATE TYPE public.appointment_status AS ENUM ('pending', 'approved', 'completed', 'cancelled');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
    CREATE TYPE public.payment_status AS ENUM ('paid', 'unpaid');
  END IF;
END $$;

-- 2) Core tables
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  phone text,
  avatar_url text,
  active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name text NOT NULL,
  age integer CHECK (age >= 0 AND age <= 150),
  gender text CHECK (gender IN ('male', 'female', 'other')),
  phone text,
  address text,
  medical_history text,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS patients_user_id_idx ON public.patients (user_id);
CREATE INDEX IF NOT EXISTS patients_full_name_idx ON public.patients (full_name);

CREATE TABLE IF NOT EXISTS public.doctors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name text NOT NULL,
  specialization text NOT NULL,
  phone text,
  email text,
  availability jsonb NOT NULL DEFAULT '{}'::jsonb,
  bio text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS doctors_user_id_idx ON public.doctors (user_id);

CREATE TABLE IF NOT EXISTS public.appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  doctor_id uuid REFERENCES public.doctors(id) ON DELETE CASCADE NOT NULL,
  scheduled_at timestamptz NOT NULL,
  status appointment_status NOT NULL DEFAULT 'pending',
  reason text,
  notes text,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS appointments_patient_id_idx ON public.appointments (patient_id);
CREATE INDEX IF NOT EXISTS appointments_doctor_id_idx ON public.appointments (doctor_id);
CREATE INDEX IF NOT EXISTS appointments_scheduled_at_idx ON public.appointments (scheduled_at);

CREATE TABLE IF NOT EXISTS public.medical_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  doctor_id uuid REFERENCES public.doctors(id) ON DELETE SET NULL,
  appointment_id uuid REFERENCES public.appointments(id) ON DELETE SET NULL,
  diagnosis text,
  notes text,
  prescription jsonb NOT NULL DEFAULT '[]'::jsonb,
  report_files jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS medical_records_patient_id_idx ON public.medical_records (patient_id);

CREATE TABLE IF NOT EXISTS public.bills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  appointment_id uuid REFERENCES public.appointments(id) ON DELETE SET NULL,
  services jsonb NOT NULL DEFAULT '[]'::jsonb,
  total numeric(10,2) NOT NULL DEFAULT 0,
  status payment_status NOT NULL DEFAULT 'unpaid',
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.bills ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS bills_patient_id_idx ON public.bills (patient_id);

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  action text NOT NULL,
  resource_type text,
  resource_id text,
  details jsonb,
  timestamp timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.lab_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES public.patients(id) ON DELETE CASCADE,
  consultation_id uuid REFERENCES public.medical_records(id) ON DELETE SET NULL,
  test_name text NOT NULL,
  result text NOT NULL,
  remarks text,
  lab_officer_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  test_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.lab_results ENABLE ROW LEVEL SECURITY;

-- 3) Helper functions
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.ensure_unique_patient_phone()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.phone IS NOT NULL AND btrim(NEW.phone) <> '' THEN
    IF EXISTS (
      SELECT 1
      FROM public.patients p
      WHERE p.phone = NEW.phone
        AND p.id <> COALESCE(NEW.id, gen_random_uuid())
    ) THEN
      RAISE EXCEPTION 'Patient phone number already exists';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

CREATE OR REPLACE FUNCTION public.is_staff(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('admin', 'doctor', 'receptionist')
  );
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public
AS $$
DECLARE
  requested_role text;
  final_role public.app_role;
  display_name text;
  phone_number text;
  specialization text;
  patient_age integer;
  patient_gender text;
  patient_address text;
BEGIN
  display_name := coalesce(NEW.raw_user_meta_data->>'full_name', '');
  phone_number := coalesce(NEW.raw_user_meta_data->>'phone', '');
  specialization := coalesce(NEW.raw_user_meta_data->>'specialization', 'General Practice');
  patient_age := CASE
    WHEN coalesce(NEW.raw_user_meta_data->>'age', '') ~ '^[0-9]+$' THEN (NEW.raw_user_meta_data->>'age')::integer
    ELSE NULL
  END;
  patient_gender := nullif(coalesce(NEW.raw_user_meta_data->>'gender', ''), '');
  patient_address := nullif(coalesce(NEW.raw_user_meta_data->>'address', ''), '');

  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (NEW.id, display_name, phone_number)
  ON CONFLICT (id) DO UPDATE
    SET full_name = EXCLUDED.full_name,
        phone = EXCLUDED.phone;

  requested_role := coalesce(NEW.raw_user_meta_data->>'role', 'patient');

  IF requested_role IN ('patient', 'doctor', 'receptionist', 'lab_officer') THEN
    final_role := requested_role::public.app_role;
  ELSE
    final_role := 'patient'::public.app_role;
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, final_role)
  ON CONFLICT (user_id, role) DO NOTHING;

  IF final_role = 'patient' THEN
    INSERT INTO public.patients (user_id, full_name, age, gender, phone, address, created_by)
    VALUES (NEW.id, display_name, patient_age, patient_gender, phone_number, patient_address, NEW.id)
    ON CONFLICT DO NOTHING;
  ELSIF final_role = 'doctor' THEN
    INSERT INTO public.doctors (user_id, full_name, specialization, phone, email)
    VALUES (NEW.id, display_name, specialization, phone_number, NEW.email)
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.sync_role_record()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public
AS $$
DECLARE
  profile_name text;
  profile_phone text;
  profile_email text;
  patient_age integer;
  patient_gender text;
  patient_address text;
BEGIN
  SELECT
    p.full_name,
    p.phone,
    au.email,
    CASE
      WHEN coalesce(au.raw_user_meta_data->>'age', '') ~ '^[0-9]+$' THEN (au.raw_user_meta_data->>'age')::integer
      ELSE NULL
    END,
    nullif(coalesce(au.raw_user_meta_data->>'gender', ''), ''),
    nullif(coalesce(au.raw_user_meta_data->>'address', ''), '')
  INTO profile_name, profile_phone, profile_email, patient_age, patient_gender, patient_address
  FROM auth.users au
  LEFT JOIN public.profiles p ON p.id = au.id
  WHERE au.id = NEW.user_id;

  IF NEW.role = 'patient' THEN
    INSERT INTO public.patients (user_id, full_name, age, gender, phone, address, created_by)
    SELECT NEW.user_id, coalesce(profile_name, 'Patient'), patient_age, patient_gender, profile_phone, patient_address, NEW.user_id
    WHERE NOT EXISTS (SELECT 1 FROM public.patients WHERE user_id = NEW.user_id);
  ELSIF NEW.role = 'doctor' THEN
    INSERT INTO public.doctors (user_id, full_name, specialization, phone, email)
    SELECT NEW.user_id, coalesce(profile_name, 'Doctor'), 'General Practice', profile_phone, profile_email
    WHERE NOT EXISTS (SELECT 1 FROM public.doctors WHERE user_id = NEW.user_id);
  END IF;

  RETURN NEW;
END;
$$;

-- 4) Triggers
DROP TRIGGER IF EXISTS trg_profiles_updated ON public.profiles;
CREATE TRIGGER trg_profiles_updated
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_patients_updated ON public.patients;
CREATE TRIGGER trg_patients_updated
BEFORE UPDATE ON public.patients
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_patients_unique_phone ON public.patients;
CREATE TRIGGER trg_patients_unique_phone
BEFORE INSERT OR UPDATE ON public.patients
FOR EACH ROW EXECUTE FUNCTION public.ensure_unique_patient_phone();

DROP TRIGGER IF EXISTS trg_doctors_updated ON public.doctors;
CREATE TRIGGER trg_doctors_updated
BEFORE UPDATE ON public.doctors
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_appointments_updated ON public.appointments;
CREATE TRIGGER trg_appointments_updated
BEFORE UPDATE ON public.appointments
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_records_updated ON public.medical_records;
CREATE TRIGGER trg_records_updated
BEFORE UPDATE ON public.medical_records
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_bills_updated ON public.bills;
CREATE TRIGGER trg_bills_updated
BEFORE UPDATE ON public.bills
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_user_roles_sync ON public.user_roles;
CREATE TRIGGER trg_user_roles_sync
AFTER INSERT OR UPDATE ON public.user_roles
FOR EACH ROW EXECUTE FUNCTION public.sync_role_record();

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Backfill rows for any users that already exist in auth.users.
INSERT INTO public.profiles (id, full_name, phone)
SELECT
  u.id,
  coalesce(u.raw_user_meta_data->>'full_name', ''),
  coalesce(u.raw_user_meta_data->>'phone', '')
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL;

INSERT INTO public.patients (user_id, full_name, age, gender, phone, address, created_by)
SELECT
  u.id,
  coalesce(p.full_name, u.raw_user_meta_data->>'full_name', ''),
  CASE
    WHEN coalesce(u.raw_user_meta_data->>'age', '') ~ '^[0-9]+$' THEN (u.raw_user_meta_data->>'age')::integer
    ELSE NULL
  END,
  nullif(coalesce(u.raw_user_meta_data->>'gender', ''), ''),
  coalesce(p.phone, u.raw_user_meta_data->>'phone', ''),
  nullif(coalesce(u.raw_user_meta_data->>'address', ''), ''),
  u.id
FROM auth.users u
JOIN public.user_roles r ON r.user_id = u.id AND r.role = 'patient'
LEFT JOIN public.patients pt ON pt.user_id = u.id
LEFT JOIN public.profiles p ON p.id = u.id
WHERE pt.id IS NULL;

INSERT INTO public.doctors (user_id, full_name, specialization, phone, email)
SELECT
  u.id,
  coalesce(p.full_name, u.raw_user_meta_data->>'full_name', 'Doctor'),
  coalesce(u.raw_user_meta_data->>'specialization', 'General Practice'),
  coalesce(p.phone, u.raw_user_meta_data->>'phone', ''),
  u.email
FROM auth.users u
JOIN public.user_roles r ON r.user_id = u.id AND r.role = 'doctor'
LEFT JOIN public.doctors d ON d.user_id = u.id
LEFT JOIN public.profiles p ON p.id = u.id
WHERE d.id IS NULL;

-- 5) RLS policies
DROP POLICY IF EXISTS "users insert own role" ON public.user_roles;
DROP POLICY IF EXISTS "users see own roles" ON public.user_roles;
DROP POLICY IF EXISTS "admins see all roles" ON public.user_roles;
DROP POLICY IF EXISTS "admins manage roles" ON public.user_roles;
CREATE POLICY "users insert own role" ON public.user_roles
  FOR INSERT WITH CHECK (auth.uid() = user_id AND role IN ('patient', 'doctor', 'receptionist', 'lab_officer'));
CREATE POLICY "users see own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "admins see all roles" ON public.user_roles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins manage roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "users insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "view own profile" ON public.profiles;
DROP POLICY IF EXISTS "staff view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "update own profile" ON public.profiles;
DROP POLICY IF EXISTS "admin update any profile" ON public.profiles;
CREATE POLICY "users insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "staff view all profiles" ON public.profiles
  FOR SELECT USING (public.is_staff(auth.uid()));
CREATE POLICY "update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "admin update any profile" ON public.profiles
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "staff view patients" ON public.patients;
DROP POLICY IF EXISTS "patient view own" ON public.patients;
DROP POLICY IF EXISTS "staff insert patients" ON public.patients;
DROP POLICY IF EXISTS "staff update patients" ON public.patients;
DROP POLICY IF EXISTS "admin delete patients" ON public.patients;
DROP POLICY IF EXISTS "patient insert own" ON public.patients;
CREATE POLICY "staff view patients" ON public.patients
  FOR SELECT USING (public.is_staff(auth.uid()));
CREATE POLICY "patient view own" ON public.patients
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "staff insert patients" ON public.patients
  FOR INSERT WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "staff update patients" ON public.patients
  FOR UPDATE USING (public.is_staff(auth.uid()));
CREATE POLICY "admin delete patients" ON public.patients
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "patient insert own" ON public.patients
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "anyone authed view doctors" ON public.doctors;
DROP POLICY IF EXISTS "admin manage doctors" ON public.doctors;
DROP POLICY IF EXISTS "doctor update self" ON public.doctors;
DROP POLICY IF EXISTS "staff insert doctors" ON public.doctors;
CREATE POLICY "anyone authed view doctors" ON public.doctors
  FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "admin manage doctors" ON public.doctors
  FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "doctor update self" ON public.doctors
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "staff insert doctors" ON public.doctors
  FOR INSERT WITH CHECK (public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "staff view appointments" ON public.appointments;
DROP POLICY IF EXISTS "patient view own appointments" ON public.appointments;
DROP POLICY IF EXISTS "staff or patient create appointment" ON public.appointments;
DROP POLICY IF EXISTS "staff update appointments" ON public.appointments;
DROP POLICY IF EXISTS "admin delete appointments" ON public.appointments;
CREATE POLICY "staff view appointments" ON public.appointments
  FOR SELECT USING (public.is_staff(auth.uid()));
CREATE POLICY "patient view own appointments" ON public.appointments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.patients p
      WHERE p.id = appointments.patient_id AND p.user_id = auth.uid()
    )
  );
CREATE POLICY "staff or patient create appointment" ON public.appointments
  FOR INSERT WITH CHECK (
    public.is_staff(auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.patients p
      WHERE p.id = patient_id AND p.user_id = auth.uid()
    )
  );
CREATE POLICY "staff update appointments" ON public.appointments
  FOR UPDATE USING (public.is_staff(auth.uid()));
CREATE POLICY "admin delete appointments" ON public.appointments
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "staff view records" ON public.medical_records;
DROP POLICY IF EXISTS "patient view own records" ON public.medical_records;
DROP POLICY IF EXISTS "doctor or admin insert records" ON public.medical_records;
DROP POLICY IF EXISTS "doctor or admin update records" ON public.medical_records;
DROP POLICY IF EXISTS "admin delete records" ON public.medical_records;
CREATE POLICY "staff view records" ON public.medical_records
  FOR SELECT USING (public.is_staff(auth.uid()));
CREATE POLICY "patient view own records" ON public.medical_records
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.patients p
      WHERE p.id = medical_records.patient_id AND p.user_id = auth.uid()
    )
  );
CREATE POLICY "doctor or admin insert records" ON public.medical_records
  FOR INSERT WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'doctor')
  );
CREATE POLICY "doctor or admin update records" ON public.medical_records
  FOR UPDATE USING (
    public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'doctor')
  );
CREATE POLICY "admin delete records" ON public.medical_records
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "staff view bills" ON public.bills;
DROP POLICY IF EXISTS "patient view own bills" ON public.bills;
DROP POLICY IF EXISTS "staff insert bills" ON public.bills;
DROP POLICY IF EXISTS "staff update bills" ON public.bills;
DROP POLICY IF EXISTS "admin delete bills" ON public.bills;
CREATE POLICY "staff view bills" ON public.bills
  FOR SELECT USING (public.is_staff(auth.uid()));
CREATE POLICY "patient view own bills" ON public.bills
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.patients p
      WHERE p.id = bills.patient_id AND p.user_id = auth.uid()
    )
  );
CREATE POLICY "staff insert bills" ON public.bills
  FOR INSERT WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "staff update bills" ON public.bills
  FOR UPDATE USING (public.is_staff(auth.uid()));
CREATE POLICY "admin delete bills" ON public.bills
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "admin view audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "admin insert audit logs" ON public.audit_logs;
CREATE POLICY "admin view audit logs" ON public.audit_logs
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin insert audit logs" ON public.audit_logs
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "staff view lab results" ON public.lab_results;
DROP POLICY IF EXISTS "patient view own lab results" ON public.lab_results;
DROP POLICY IF EXISTS "staff insert lab results" ON public.lab_results;
DROP POLICY IF EXISTS "staff update lab results" ON public.lab_results;
DROP POLICY IF EXISTS "admin delete lab results" ON public.lab_results;
CREATE POLICY "staff view lab results" ON public.lab_results
  FOR SELECT USING (public.is_staff(auth.uid()));
CREATE POLICY "patient view own lab results" ON public.lab_results
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.patients p
      WHERE p.id = lab_results.patient_id AND p.user_id = auth.uid()
    )
  );
CREATE POLICY "staff insert lab results" ON public.lab_results
  FOR INSERT WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "staff update lab results" ON public.lab_results
  FOR UPDATE USING (public.is_staff(auth.uid()));
CREATE POLICY "admin delete lab results" ON public.lab_results
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- 6) Storage bucket for medical reports
INSERT INTO storage.buckets (id, name, public)
VALUES ('medical-reports', 'medical-reports', false)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "staff read reports" ON storage.objects;
DROP POLICY IF EXISTS "staff upload reports" ON storage.objects;
DROP POLICY IF EXISTS "staff update reports" ON storage.objects;
DROP POLICY IF EXISTS "staff delete reports" ON storage.objects;
CREATE POLICY "staff read reports" ON storage.objects
  FOR SELECT USING (bucket_id = 'medical-reports' AND public.is_staff(auth.uid()));
CREATE POLICY "staff upload reports" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'medical-reports' AND public.is_staff(auth.uid()));
CREATE POLICY "staff update reports" ON storage.objects
  FOR UPDATE USING (bucket_id = 'medical-reports' AND public.is_staff(auth.uid()));
CREATE POLICY "staff delete reports" ON storage.objects
  FOR DELETE USING (bucket_id = 'medical-reports' AND public.is_staff(auth.uid()));
