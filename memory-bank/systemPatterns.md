# System Patterns

## System Architecture
The application is built on **Next.js 16** utilizing the App Router.
- **Frontend:** React 19, Tailwind CSS (v4), Lucide React for icons.
- **Backend:** Next.js Route Handlers (`app/api/*`) for server-side logic like Discord webhooks.
- **Database / Auth:** Supabase (PostgreSQL) handling user sessions, relational data, and Row Level Security (RLS). Note: RLS warnings are currently bypassed as a known architectural decision.

## Database Schema (Inferred)
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

## Key Folder Structure
- `/app/payment/page.tsx`: Handles lab-side payment uploads, 5-minute timer, and Discord webhook integration.
- `/app/super-admin/billing/page.tsx`: Admin interface for managing `app_settings`, reviewing labs, toggling active states, and viewing `payment_history`.
- `/app/api/payment/route.ts`: Proxies payment screenshot and form data to `DISCORD_PAYMENTS_WEBHOOK_URL`.
- `/lib/supabase.ts`: Supabase client initialization.
