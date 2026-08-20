# System Patterns

## System Architecture
The application is built on **Next.js 16** utilizing the App Router and Turbopack.
- **Frontend:** React 19, Tailwind CSS (v4), Lucide React for vector icons.
- **Backend:** Next.js Route Handlers (`app/api/*`) for webhooks, cron jobs, and server-side automation.
- **Database / Auth:** Supabase (PostgreSQL) handling user sessions, relational data, and Row Level Security (RLS). Note: RLS warnings are currently bypassed as a known architectural decision.

## Database Schema
1. **`labs`**
   - `id`, `owner_id`, `name`, `city`, `logo_url`
   - `payment_status` ('cleared', 'submitted', etc.)
   - `registration_status` ('pending_approval', 'cleared')
   - `is_active`, `is_registered_paid`
   - `last_cleared_date`, `last_paid_amount`
   - `payment_method`, `sender_name`, `payment_screenshot`
2. **`bookings`**
   - `id`, `lab_id`, `total_amount`, `status` ('Completed', etc.), `created_at`
3. **`app_settings`**
   - `id` (usually 1)
   - `registration_fee`, `commission_percentage`, `commission_threshold`
   - `easypaisa_number`, `easypaisa_title`
   - `jazzcash_number`, `jazzcash_title`
   - `sadapay_number`, `sadapay_title`
4. **`payment_history`**
   - `id`, `lab_id`, `amount_cleared`, `cleared_at`

## Route Architecture & Key Folders
- **Public Healthcare Portal (`app/`):**
  - `/` (Home): Synchronized dynamic hero smartphone mockups, services overview, patient journey, partner lab preview, doctors showcase, and SDG alignments.
  - `/services`: Deep-dive into lab tests, home phlebotomy, digital PDF reports, tele-doctor consultations, and lab SaaS workspace.
  - `/doctors`: Information on doctor capabilities with direct redirection to `https://bharosa-doctor.vercel.app/auth`.
  - `/partner-labs`: 10 core advantages and interactive workflow diagram for pathology lab onboarding.
  - `/partner-with-us`: 3 collaboration tracks (Labs, Doctors, Institutional) with direct contact channels.
  - `/about`: Mission, Vision, and 4-Pillar ecosystem overview.
  - `/contact`: Direct communication cards for Phone (`03141811158`), WhatsApp (`03141811158`), Email (`bharosalabo@gmail.com`), Instagram (`@bharosa_lab`), and Facebook (`Bharosa Lab`).
  - `/faq`: Searchable accordion knowledge base powered by `lib/faqData.ts`.
  - `/terms` & `/privacy-policy`: Official legal and positioning notices.
- **Partner Laboratory Portal (`app/dashboard/*`, `app/login`):**
  - `/login`: Dedicated Google OAuth gateway for lab managers.
  - `/dashboard`: Real-time order analytics, test management (`/dashboard/tests`), bookings management (`/dashboard/bookings`), and profile editor (`/dashboard/labprofile`).
- **Super Administration & Billing (`app/super-admin/*`):**
  - `/super-admin/billing`: Commission ledger, manual approval toggles, lab locking, and global settings modal.
  - `/super-admin/registrations`: 30-day trial status management, manual locks, and initial registration fee approvals.
- **Server Endpoints & Automation (`app/api/*`):**
  - `/api/payment`: Handles screenshot file proxying to Discord with Groq AI-generated email templates.
  - `/api/cron/auto-lock`: Automated hourly job configured via `vercel.json` to lock expired/indebted labs and hide them from the mobile app.
