# Software Requirements Specification (SRS)

Project: Healthcare Patient Records System
Group: Group 12
Date: 2026-05-09
Version: 1.0

## Revision History

- 1.0 — 2026-05-09 — Initial SRS draft

## Table of Contents

1. Introduction
2. Overall Description
3. Functional Requirements
4. Non-Functional Requirements
5. System Interfaces and Architecture (high-level)
6. Data Design and Entities
7. Use Cases
8. Security and Information Hiding
9. Test Cases and Validation
10. Constraints, Assumptions, and Dependencies
11. Appendices

## 1. Introduction

1.1 Purpose

This SRS describes the requirements for an Electronic Healthcare Patient Records System for Group 12. The system will manage patient registration, medical history, consultations, prescriptions, lab results, and secure role-based access to records.

1.2 Scope

The system will provide role-based dashboards for Admin, Receptionist/Records Officer, Doctor, Lab Officer, and Patient. It will allow secure login, patient registration, consultation recording, prescription creation, lab result management, search, reporting, and audit logging.

1.3 Definitions, acronyms, abbreviations

- SRS: Software Requirements Specification
- RBAC: Role-Based Access Control
- API: Application Programming Interface

## 2. Overall Description

2.1 Product Perspective

This is a web-based client-server application with a frontend UI, backend API, and database. Authentication and authorization protect all sensitive routes.

2.2 User Classes and Characteristics

- Admin: manages users, permissions, doctors, receptionists, billing oversight, dashboards, and system reports.
- Receptionist/Records Officer: registers patients, updates biodata, searches records, manages appointments, and handles invoices.
- Doctor: views patient history, records consultations, creates prescriptions, requests and reviews lab results, and manages appointments.
- Lab Officer: reviews lab requests, records and corrects lab results, and maintains lab history.
- Patient: views own profile, appointments, prescriptions, lab reports, invoices, and payment status.

2.3 Operating Environment

Modern web browsers (Chrome, Firefox, Edge) and a server environment running the chosen web stack (Node.js/TypeScript in this codebase). Database (Postgres, Supabase, or similar) on server.

2.4 Design and Implementation Constraints

- Must implement secure authentication and RBAC.
- Use password hashing and secure storage for credentials.
- Input validation on all user inputs.
- Maintain an audit log of important activities.

## 3. Functional Requirements

Each requirement has an identifier (FR-XXX) for traceability.

FR-001 — Authentication
- The system shall allow authorized users to log in with email/username and password.
- The system shall hash passwords in storage.

FR-002 — Role-Based Dashboards and Redirect
- Upon login, the system shall redirect users to a dashboard specific to their role (Admin, Receptionist, Doctor, Lab Officer, Patient).

FR-003 — User Management (Admin)
- The Admin shall be able to create, view, update, activate/deactivate, and delete user accounts.
- The Admin shall manage role permissions.

FR-004 — Patient Registration (Receptionist)
- The system shall allow a Receptionist to register a new patient with a unique Patient ID and the required demographic details: full name, gender, date of birth/age, phone number, address, blood group, insurance details, emergency contact.
- The system shall validate required fields and prevent duplicate patient records.

FR-005 — Patient Search and List
- The system shall allow authorized users (Admin, Receptionist, Doctor, Lab Officer) to search patients by name, Patient ID, phone number, and basic filters.

FR-006 — Medical History Management
- The system shall store medical history entries including chronic conditions, allergies, previous treatments, past illnesses, family medical history, and notes.

FR-007 — Consultation Recording (Doctor)
- The system shall allow a Doctor to add a consultation record linked to a Patient and Doctor, with symptoms, diagnosis, treatment plan, doctor's note, consultation date, and follow-up date.

FR-008 — Prescription Management (Doctor)
- The system shall allow a Doctor to create prescriptions linked to a consultation and patient. Each prescription shall include drug name, dosage, frequency, duration, and special instructions.

FR-009 — Lab Results Management (Lab Officer)
- The system shall allow a Lab Officer to record lab tests and results linked to a Patient and (optionally) consultation. Each entry includes test name, result, remarks, lab officer and test date.

FR-010 — Patient Self-Service (Patient)
- The system shall allow a Patient to view their own profile, consultation history, prescriptions, lab results, and medical history.

FR-011 — Protected Routes and Access Control
- The system shall restrict page and API access based on user role and permissions.

FR-012 — Audit Logging
- The system shall record important system activities (logins, record creation, updates, deletions) in an `AuditLogs` entity with actor, action, timestamp, and affected resource.

FR-013 — Logout
- The system shall allow users to log out and invalidate session tokens.

FR-014 — Reporting
- The system shall generate summary reports for Admin (patient counts, activity logs, basic metrics).

FR-015 — Admin Dashboard and System Overview
- The system shall provide the Admin with a dashboard showing total patients, doctors, receptionists, appointments, medical records, prescriptions, lab reports, invoices, and recent system activities.

FR-016 — User and Role Administration
- The Admin shall be able to create users, view users, update users, deactivate users, assign roles, manage doctors, manage receptionists, and manage patient portal accounts.

FR-017 — Doctor Profile Management
- The Admin shall be able to add doctor profiles, update specialization, update availability, view schedules, and deactivate doctor profiles.

FR-018 — Billing Oversight
- The Admin and authorized front-desk staff shall be able to view invoices, payment status, unpaid balances, and financial summaries.

FR-019 — Receptionist Dashboard and Patient Registration
- The system shall provide a Receptionist dashboard showing today’s appointments, recently registered patients, pending appointments, payment status summary, and quick actions.
- The system shall allow a Receptionist to register patients with full name, gender, date of birth or age, phone number, address, blood group, insurance details, emergency contact name, emergency contact phone, and patient ID.

FR-020 — Receptionist Patient Data Maintenance
- The system shall allow a Receptionist to update patient biodata including phone number, address, emergency contact, insurance information, and personal details.
- The system shall prevent the Receptionist from editing diagnosis, prescriptions, or lab interpretations.

FR-021 — Appointment and Invoice Management
- The system shall allow Receptionists and authorized users to book, approve, reschedule, cancel, and track appointment status.
- The system shall allow Receptionists to generate invoices, update payment status, issue receipts, and track pending payments.

FR-022 — Doctor Dashboard and Patient Clinical View
- The system shall provide a Doctor dashboard showing today’s appointments, assigned patients, recent consultations, pending lab reports, and quick access to medical records.
- The system shall allow Doctors to view patient details, medical history, chronic conditions, allergies, previous treatments, previous consultations, prescriptions, and lab reports.

FR-023 — Medical History and Consultation Entry
- The system shall allow Doctors to view and update chronic conditions, allergies, past illnesses, previous treatments, family medical history, and medical notes.
- The system shall allow Doctors to record consultation details including patient complaints, symptoms, diagnosis, treatment plan, doctor’s note, consultation date, and follow-up date.

FR-024 — Prescription and Lab Workflow
- The system shall allow Doctors to create prescriptions including drug name, dosage, frequency, duration, instructions, patient name, doctor name, and consultation reference.
- The system shall allow Doctors to request lab tests and review lab reports.
- The system shall allow Lab Officers to view lab requests, add lab results, update results before final submission, and view lab result history.

FR-025 — Patient Self-Service and Information Hiding
- The system shall provide Patients with a dashboard showing personal profile, upcoming appointments, recent consultations, prescriptions, lab reports, invoices, and payment status.
- The system shall allow Patients to view only their own profile, medical history, consultation history, prescriptions, lab reports, invoices, and payment receipts.
- The system shall restrict patients from accessing other patients’ records and all administrative functions.

FR-026 — Security and Access Control
- The system shall enforce role-based access control so that Admin, Receptionist, Doctor, Lab Officer, and Patient can only access modules permitted by their roles.
- The system shall prevent unauthorized users from accessing restricted routes, records, or actions.

## 4. Non-Functional Requirements

NFR-001 — Security
- Use HTTPS for all communications in production.
- Use secure password hashing (e.g., bcrypt/argon2).
- Implement RBAC and least privilege.

NFR-002 — Usability
- The UI shall be simple and follow accessible patterns.

NFR-003 — Reliability
- Database transactions shall ensure data integrity for critical operations.

NFR-004 — Performance
- Pages with patient lists shall paginate results and load within acceptable latency (<2s for typical queries).

NFR-005 — Maintainability
- Code shall be modular and documented; use clear separation of concerns.

NFR-006 — Scalability
- Design shall allow future modules (appointments, billing, notifications).

NFR-007 — Availability
- Target availability during working hours; design for future high-availability deployment.

## 5. System Interfaces and Architecture (high-level)

- Frontend: React/TypeScript application (existing workspace structure).
- Backend: REST/JSON API or serverless functions providing authentication, patient, consultation, prescription, lab results, and user management endpoints.
- Database: Relational DB (Postgres) or Supabase-managed Postgres.
- Authentication: Session cookies or JWT with secure refresh flow.

## 6. Data Design and Entities

Recommended entities (tables):

- Users (id, name, email, hashed_password, role, active, created_at, updated_at)
- Patients (patient_id, first_name, last_name, gender, dob, phone, address, blood_group, insurance, emergency_contact_name, emergency_contact_phone, created_by, created_at)
- MedicalHistory (id, patient_id, type, details, recorded_by, recorded_at)
- Consultations (id, patient_id, doctor_id, symptoms, diagnosis, treatment_plan, notes, consultation_date, followup_date)
- Prescriptions (id, consultation_id, patient_id, doctor_id, drug_name, dosage, frequency, duration, instructions, created_at)
- LabResults (id, patient_id, consultation_id, test_name, result, remarks, lab_officer_id, test_date)
- AuditLogs (id, actor_id, action, resource_type, resource_id, timestamp, details)

Data dictionary and field descriptions should be expanded during System Design.

## 7. Use Cases (brief)

UC-01: User Login
- Actor: Any user
- Precondition: Registered account
- Flow: Provide credentials → system authenticates → redirect to role dashboard

UC-02: Register Patient
- Actor: Receptionist
- Flow: Fill patient form → validate → create patient with unique Patient ID → success

UC-03: Record Consultation
- Actor: Doctor
- Flow: Open patient → create consultation record → optionally create prescription → save

UC-04: Record Lab Result
- Actor: Lab Officer
- Flow: Select patient or consultation → enter test details → save result

UC-05: Patient View Own Records
- Actor: Patient
- Flow: Login → view profile → view consultations, prescriptions, lab results

## 8. Security and Information Hiding

- Enforce RBAC at API and UI layers.
- Validate all inputs server-side and client-side.
- Hash and never display passwords.
- Use parameterized queries or ORM to prevent SQL injection.
- Keep sensitive fields access-limited so each role sees only the minimum data required for the workflow.
- Receptionists may manage demographics, appointments, and billing data but must not edit diagnosis, prescriptions, or lab interpretation.
- Doctors may manage clinical data but must not manage user accounts or system settings.
- Lab Officers may manage lab requests and lab results but must not change prescriptions, consultations, or billing control.
- Patients may view only their own records, invoices, and results.

## 9. Test Cases and Validation

Provide test cases in the required format; example identifiers below:

- TC-001: Login test (Related: FR-001)
- TC-002: Patient registration (Related: FR-004)
- TC-003: Patient search (Related: FR-005)
- TC-004: Consultation entry (Related: FR-007)
- TC-005: Prescription entry (Related: FR-008)
- TC-006: Lab result entry (Related: FR-009)
- TC-007: Unauthorized access prevention (Related: FR-011)
- TC-008: Patient view own record (Related: FR-010)

Each test case shall include: Test Case ID, Summary, Related Requirement, Prerequisites, Procedure, Test Data, Expected Result, Actual Result, Status.

## 10. Constraints, Assumptions, and Dependencies

- Assumes an internet-connected environment for hosted deployments.
- Assumes a relational database available (Postgres/Supabase).
- Assumes users have secure workstations and follow password policies.

## 11. Appendices

- ER diagram and data dictionary: to be produced in System Design Document. Minimal ER summary:

  - `Users` 1 — * `Consultations` (doctor_id)
  - `Patients` 1 — * `Consultations`
  - `Consultations` 1 — * `Prescriptions`
  - `Patients` 1 — * `LabResults`

---

This SRS is a baseline; update and expand the data dictionary, ER diagrams, sequence diagrams, and detailed use-case flows in the System Design Document.
