# Risk Register

| ID | Risk | Probability (1-5) | Consequence (1-5) | Exposure |
|----|------|-------------------:|------------------:|---------:|
| R001 | Unauthorized access to patient records | 4 | 5 | 20 |
| R002 | Database failure / data loss | 3 | 5 | 15 |
| R003 | Wrong patient data entry | 3 | 4 | 12 |
| R004 | Delay in coding / delivery | 3 | 4 | 12 |
| R005 | Poor internet during demo | 3 | 3 | 9 |
|

Mitigations:
- Enforce RBAC and server-side checks.
- Regular backups for database; use Supabase backups or export.
- Input validation and confirmation dialogs for destructive actions.
- Timeboxing and incremental delivery for project tasks.
- Provide offline-friendly fallbacks for critical pages if required.

*** End of file
