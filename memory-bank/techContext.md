# Tech Context

## Core Technologies
- **Framework:** Next.js 16.1.6 (App Router)
- **Library:** React 19.2.3 & React DOM 19.2.3
- **Language:** TypeScript 5+

## Backend / Database / BaaS
- **Supabase:** `@supabase/supabase-js` v2.97.0 (Authentication, PostgreSQL Database, Realtime Subscriptions, Storage)

## Styling & UI
- **TailwindCSS:** v4 (with `@tailwindcss/postcss`)
- **Icons:** `lucide-react`
- **Toasts/Alerts:** `react-hot-toast`
- **Progress Bar:** `nextjs-toploader`

## Forms & Validation
- **Form Management:** `react-hook-form`
- **Schema Validation:** `zod`
- **Resolvers:** `@hookform/resolvers`

## Analytics
- **Vercel Analytics:** `@vercel/analytics`

## Environment Variables
Expected environment variables (based on Supabase configuration in `lib/supabase.ts`):
- `NEXT_PUBLIC_SUPABASE_URL`: The Supabase project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: The anonymous public API key for Supabase.
