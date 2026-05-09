# Test Cases

## TC-001: Login and role redirect
- Summary: Verify user login and redirect to the correct dashboard.
- Related Requirement: FR-001, FR-002
- Prerequisites: Test users exist for admin, receptionist, doctor, lab officer, and patient roles.
- Procedure: 1) Navigate to /auth 2) Enter valid credentials 3) Submit
- Test Data: Role-based test account and password
- Expected Result: User is authenticated and redirected to the matching role dashboard.
- Actual Result: 
- Status: 

## TC-002: Admin overview and role management
- Summary: Admin can view overview metrics and update a user role.
- Related Requirement: FR-015, FR-016, FR-026
- Prerequisites: Admin account exists and is logged in.
- Procedure: 1) Open /admin 2) Review dashboard summary 3) Search for a user 4) Assign a role 5) Deactivate and reactivate a user
- Test Data: Existing user account with no role or with a different role
- Expected Result: Admin sees system totals and can change user access with audit logging.
- Actual Result: 
- Status: 

## TC-003: Receptionist patient registration
- Summary: Receptionist can register a patient with demographics and insurance details.
- Related Requirement: FR-004, FR-019
- Prerequisites: Receptionist account exists and is logged in.
- Procedure: 1) Go to /patients 2) Click Add patient 3) Fill required fields 4) Submit
- Test Data: Full name, gender, age, phone, address, blood group, insurance details, emergency contact
- Expected Result: New patient appears in the patient list with a unique patient ID.
- Actual Result: 
- Status: 

## TC-004: Receptionist biodata update restriction
- Summary: Receptionist can update biodata but not diagnosis or prescriptions.
- Related Requirement: FR-020, FR-026
- Prerequisites: Receptionist account and existing patient record.
- Procedure: 1) Open a patient profile 2) Update phone and address 3) Attempt to edit diagnosis or prescription fields
- Test Data: New phone number and address
- Expected Result: Biodata changes are saved, while clinical fields are blocked.
- Actual Result: 
- Status: 

## TC-005: Appointment and invoice handling
- Summary: Receptionist can manage appointments and billing tasks.
- Related Requirement: FR-021, FR-018
- Prerequisites: Receptionist account logged in; patient appointment exists.
- Procedure: 1) Open appointments 2) Book or reschedule an appointment 3) Generate an invoice 4) Update payment status
- Test Data: Appointment date and invoice amount
- Expected Result: Appointment status updates and invoice/payment data are recorded.
- Actual Result: 
- Status: 

## TC-006: Doctor consultation and prescription entry
- Summary: Doctor can record a consultation and create a prescription.
- Related Requirement: FR-007, FR-008, FR-022, FR-023, FR-024
- Prerequisites: Doctor account exists, patient exists.
- Procedure: 1) Open /records 2) Create consultation 3) Enter symptoms, diagnosis, and treatment plan 4) Add prescription 5) Save
- Test Data: Diagnosis, dosage, frequency, duration
- Expected Result: Consultation and prescription are linked to the patient and consultation reference.
- Actual Result: 
- Status: 

## TC-007: Lab request and result workflow
- Summary: Doctor requests a lab test and lab officer records the result.
- Related Requirement: FR-024
- Prerequisites: Doctor account and lab officer account exist; consultation exists.
- Procedure: 1) Doctor requests lab test 2) Lab officer opens /lab-results 3) Add result and remarks 4) Save
- Test Data: Test name, result, report date, remarks
- Expected Result: Lab result is stored and visible in the patient history.
- Actual Result: 
- Status: 

## TC-008: Patient self-service visibility
- Summary: Patient can view only their own records, invoices, and reports.
- Related Requirement: FR-010, FR-025, FR-026
- Prerequisites: Patient account logged in with at least one consultation, prescription, lab report, and invoice.
- Procedure: 1) Login as patient 2) Open /profile 3) Open /records 4) Open /billing
- Test Data: Own patient account
- Expected Result: Only the patient’s own data is visible and no other records can be accessed.
- Actual Result: 
- Status: 

## TC-009: Unauthorized access prevention
- Summary: Restricted pages reject users without sufficient permission.
- Related Requirement: FR-011, FR-026
- Prerequisites: Logged in as patient.
- Procedure: 1) Attempt to open /admin 2) Attempt to edit another user’s record 3) Attempt to access clinical admin functions
- Expected Result: Access denied message displayed and the action is blocked.
- Actual Result: 
- Status: 

*** End of file
