# Test Cases

This file contains example test cases following the required format.

## TC-001: Login test
- Summary: Verify user login with valid credentials.
- Related Requirement: FR-001
- Prerequisites: Test user exists with role assigned.
- Procedure: 1) Navigate to /auth 2) Enter email and password 3) Submit
- Test Data: testuser@example.com / password123
- Expected Result: User is authenticated and redirected to role dashboard.
- Actual Result: 
- Status: 

## TC-002: Patient registration
- Summary: Receptionist can register a patient.
- Related Requirement: FR-004
- Prerequisites: Receptionist account exists and is logged in.
- Procedure: 1) Go to /patients 2) Click Add patient 3) Fill required fields 4) Submit
- Test Data: Full name: John Doe; Age: 35; Gender: male; Phone: 08001234567
- Expected Result: New patient appears in patient list.
- Actual Result: 
- Status: 

## TC-003: Consultation entry
- Summary: Doctor can create a consultation record for a patient.
- Related Requirement: FR-007
- Prerequisites: Doctor account exists, patient exists.
- Procedure: 1) Go to /records 2) Click New record 3) Select patient and doctor 4) Enter diagnosis and notes 5) Save
- Test Data: Diagnosis: Flu; Notes: Symptomatic treatment
- Expected Result: New record appears in list and is linked to patient.
- Actual Result: 
- Status: 

## TC-004: Prescription entry
- Summary: Doctor can attach a prescription to a consultation.
- Related Requirement: FR-008
- Prerequisites: Consultation exists.
- Procedure: 1) Create record with prescription fields 2) Save
- Test Data: Paracetamol 500mg; Twice daily; 3 days
- Expected Result: Prescription visible in record details.
- Actual Result: 
- Status: 

## TC-005: Lab result entry
- Summary: Lab officer can add lab result.
- Related Requirement: FR-009
- Prerequisites: Lab officer account logged in; patient exists.
- Procedure: 1) Go to /lab-results 2) Click New result 3) Select patient, enter test and result 4) Save
- Expected Result: Lab result visible in list and linked to patient.
- Actual Result: 
- Status: 

## TC-006: Unauthorized access prevention
- Summary: Users cannot access restricted pages.
- Related Requirement: FR-011
- Prerequisites: Logged in as patient.
- Procedure: 1) Attempt to open /admin 2) Attempt to open /lab-results
- Expected Result: Access denied message displayed.
- Actual Result: 
- Status: 

## TC-007: Patient view own record
- Summary: Patient can view own records only.
- Related Requirement: FR-010
- Prerequisites: Patient account logged in with records.
- Procedure: 1) Login as patient 2) Go to /records and /profile
- Expected Result: Only the patient's records visible.
- Actual Result: 
- Status: 

*** End of file
