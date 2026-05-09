# System Design Document

Project: Healthcare Patient Records System — Group 12
Date: 2026-05-09
Version: 0.1

## 1. Overview

This document expands the SRS with architecture, data design, component-level design, and interface contracts. It complements `SRS.md` and focuses on implementation details aligned with the existing React + Supabase codebase.

## 2. Architectural Design

- Frontend: React + TypeScript (Vite). Routes under `src/routes` provide pages. `AuthProvider` handles auth state using Supabase client.
- Backend: Supabase Postgres with REST/JS client (`@supabase/supabase-js`). Server-side admin operations use `supabaseAdmin` in `src/integrations/supabase/client.server.ts`.
- Storage: Supabase Storage for uploaded reports.
- Auth: Supabase Auth for sign-up/sign-in; custom `user_roles` table to implement RBAC.

Authentication flow
- Client logs in via Supabase; `AuthProvider` subscribes to session and fetches roles from `user_roles`.
- Protected routes use `ProtectedRoute` which checks `useAuth()` for roles and loading.

## 3. Data Design

Entities (tables):
- `users` (managed by Supabase Auth) — use `profiles` table for public profile data.
- `profiles` (id(uid), full_name, created_at, active BOOL default true)
- `user_roles` (user_id, role) — roles: `admin`, `doctor`, `receptionist`, `patient`, `lab_officer`.
- `patients` (id, user_id?, full_name, gender, dob, age, phone, address, blood_group, insurance, emergency_contact_name, emergency_contact_phone, created_by, created_at)
- `doctors` (id, user_id?, full_name, specialization, phone, email)
- `medical_records` / `consultations` (id, patient_id, doctor_id, diagnosis, notes, prescription JSON, created_at)
- `prescriptions` (id, consultation_id, patient_id, doctor_id, drug_name, dosage, frequency, duration, instructions)
- `lab_results` (id, patient_id, consultation_id, test_name, result, remarks, lab_officer_id, test_date, created_at)
- `audit_logs` (id, actor_id, action, resource_type, resource_id, timestamp, details)

ER relationships
- `profiles` 1—* `patients` (via `user_id`)
- `patients` 1—* `consultations` and `lab_results`
- `consultations` 1—* `prescriptions`

## 4. Component-Level Design

- `AuthProvider` (`src/lib/auth-context.tsx`): manages session, fetches `user_roles` for RBAC.
- `ProtectedRoute` (`src/components/ProtectedRoute.tsx`): enforces route-level RBAC.
- `Admin` (`src/routes/admin.tsx`): user management UI; assign roles, activate/deactivate users.
- `Patients` (`src/routes/patients.tsx`): patient registration and editing.
- `Records` (`src/routes/records.tsx`): consultations and prescriptions.
- `LabResults` (`src/routes/lab-results.tsx`): CRUD for lab results.

## 5. API and Database Access Patterns

- Use `supabase` client for authenticated client-side queries; use `supabaseAdmin` for server-side admin operations in server-only routes.
- Protect sensitive operations with Postgres Row Level Security (RLS) policies when deploying to production.

## 6. UI Wireframes (brief)
- Dashboards per role (already implemented in `src/routes/dashboard.tsx`).
- Patient profile page with editable fields for patients.

## 7. Security Considerations
- Enforce RBAC both client-side and server-side (RLS or server middleware).
- Hash passwords via Supabase Auth.
- Use audit logs for important changes (role assignment, patient create/update/delete, prescription creation).

## 8. Implementation Plan and Tasks
- Finalize DB schema and migrations (create `profiles.active`, `user_roles`, `audit_logs`, `lab_results` tables).
- Add server-side functions to write `audit_logs` using `supabaseAdmin`.
- Add patient profile page and admin activate/deactivate controls.
- Write test cases and automated tests for core flows.

---

This SDD is a living document; expand diagrams and SQL DDL when migrating to production.
