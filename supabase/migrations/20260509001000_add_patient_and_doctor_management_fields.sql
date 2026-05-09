-- Add fields required for patient registration and doctor profile management.

ALTER TABLE IF EXISTS public.patients
  ADD COLUMN IF NOT EXISTS blood_group text,
  ADD COLUMN IF NOT EXISTS insurance_provider text,
  ADD COLUMN IF NOT EXISTS insurance_number text,
  ADD COLUMN IF NOT EXISTS insurance_plan text,
  ADD COLUMN IF NOT EXISTS emergency_contact_name text,
  ADD COLUMN IF NOT EXISTS emergency_contact_phone text;

ALTER TABLE IF EXISTS public.doctors
  ADD COLUMN IF NOT EXISTS active boolean NOT NULL DEFAULT true;

CREATE INDEX IF NOT EXISTS patients_insurance_number_idx ON public.patients (insurance_number);