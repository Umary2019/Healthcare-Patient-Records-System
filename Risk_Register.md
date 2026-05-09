# Risk Register

| ID | Risk | Probability (1-5) | Consequence (1-5) | Exposure | Mitigation |
|----|------|-------------------:|------------------:|---------:|------------|
| R001 | Unauthorized access to patient records | 4 | 5 | 20 | Enforce RBAC, row-level security, and server-side permission checks. |
| R002 | Database failure or data loss | 3 | 5 | 15 | Use regular backups, export verification, and recovery testing. |
| R003 | Wrong patient data entry | 3 | 4 | 12 | Add validation, confirmation dialogs, and searchable patient IDs. |
| R004 | Delay in coding or delivery | 3 | 4 | 12 | Timebox work and deliver in increments by role/module. |
| R005 | Poor internet during demo | 3 | 3 | 9 | Prepare local demo data and fallback screenshots or seed content. |
| R006 | Receptionist edits clinical data accidentally | 3 | 5 | 15 | Restrict form fields by role and hide diagnosis/prescription inputs. |
| R007 | Doctor or lab officer accesses unauthorized billing or user admin tools | 2 | 5 | 10 | Limit route access, API access, and dashboard actions by role. |
| R008 | Lab result integrity error before final submission | 3 | 4 | 12 | Allow draft updates, require review, and log final submission events. |
| R009 | Billing mismatch or unpaid invoice not tracked | 3 | 4 | 12 | Keep invoice status, receipts, and payment summaries synchronized. |

Mitigations:
- Enforce RBAC and server-side checks.
- Regular backups for database; use Supabase backups or export.
- Input validation and confirmation dialogs for destructive actions.
- Timeboxing and incremental delivery for project tasks.
- Provide offline-friendly fallbacks for critical pages if required.
