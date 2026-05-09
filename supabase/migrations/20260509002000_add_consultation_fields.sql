-- Add consultation detail fields required by the doctor workflow.

ALTER TABLE IF EXISTS public.medical_records
  ADD COLUMN IF NOT EXISTS symptoms text,
  ADD COLUMN IF NOT EXISTS treatment_plan text,
  ADD COLUMN IF NOT EXISTS followup_date timestamptz;