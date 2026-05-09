-- Migration: add audit_logs and lab_results and profiles.active

-- Add active column to profiles (if not exists)
ALTER TABLE IF EXISTS profiles
  ADD COLUMN IF NOT EXISTS active boolean DEFAULT true;

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  actor_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  action text NOT NULL,
  resource_type text,
  resource_id text,
  details jsonb,
  timestamp timestamptz DEFAULT now()
);

-- Create lab_results table
CREATE TABLE IF NOT EXISTS lab_results (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  consultation_id uuid REFERENCES medical_records(id) ON DELETE SET NULL,
  test_name text NOT NULL,
  result text NOT NULL,
  remarks text,
  lab_officer_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  test_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create user_roles table if missing
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  role text NOT NULL,
  created_at timestamptz DEFAULT now()
);
