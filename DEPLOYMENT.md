# Vercel Deployment

This project is already configured for Vercel with:

- `buildCommand`: `npm run build`
- `outputDirectory`: `dist/client`
- SSR function entry: `api/ssr.js`

## Required Environment Variables

Set these in Vercel for Production, Preview, and Development as needed:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Use the same Supabase project URL and publishable key for the `VITE_` and non-`VITE_` variants.

## Deploy Steps

1. Push the repository to GitHub, GitLab, or Bitbucket.
2. Import the repo into Vercel.
3. Confirm the build settings are:
   - Framework preset: Vite or Other
   - Build command: `npm run build`
   - Output directory: `dist/client`
4. Add the environment variables listed above.
5. Deploy.

## Supabase Setup

Make sure the remote Supabase project has the schema and policies from `supabase/REMOTE_SETUP.sql` applied before or immediately after deployment.

## Smoke Test After Deploy

- Open the home page and confirm the app loads.
- Sign in with each role you need to verify.
- Confirm patient registration, appointments, records, and lab results load without runtime errors.
- Check that the app URL uses HTTPS and that Supabase requests resolve correctly.