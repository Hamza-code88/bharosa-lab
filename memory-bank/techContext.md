# Tech Context

## Technology Stack
- **Framework:** Next.js 16.1.6 (App Router)
- **Library:** React 19.2.3, React DOM 19.2.3
- **Styling:** Tailwind CSS (v4 PostCSS)
- **Icons:** Lucide React
- **Forms & Validation:** React Hook Form, Zod, @hookform/resolvers
- **Database & Auth:** @supabase/supabase-js (^2.97.0)
- **Analytics:** @vercel/analytics

## Environment Variables
Located in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anon key.
- `SUPER_ADMIN_USERNAME`: Admin login credentials.
- `SUPER_ADMIN_PASSWORD`: Admin login credentials.
- `DISCORD_WEBHOOK_URL`: General webhook for system alerts.
- `DISCORD_PAYMENTS_WEBHOOK_URL`: Dedicated webhook for sending payment proofs and automated email templates.

## Build Details
- Next.js 16 build is successful.
- Supabase RLS policies are active, but any warnings raised during setup or testing are intentionally left alone for now based on project decisions.
