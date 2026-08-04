# System Patterns

## Architecture
The application is built utilizing the **Next.js App Router** architecture. It implements client-side and server-side logic split natively supported by Next.js 13+.
- Real-time updates (e.g., new bookings) are achieved via **Supabase Realtime** (`postgres_changes` subscriptions).
- The Super Admin portal leverages Next.js Server Actions for authentication and custom logic.

## Folder Structure
```text
/app
  /api              # API routes
  /components       # Reusable React components (Sidebar, NotificationListener, etc.)
  /dashboard        # Lab Partner Portal routes (bookings, labprofile, tests)
  /super-admin      # Super Admin Portal routes (ads, billing, orders, riders, etc.)
  /payment          # Payment integration handling
  /privacy-policy   # Static legal pages
/lib
  supabase.ts       # Supabase client instantiation
/types
  index.ts          # Zod validation schemas and TypeScript interfaces
```

## Database Schema (Inferred from Codebase)
The system relies on a PostgreSQL database hosted on Supabase. Key tables include:
- **`profiles` / `app_settings` / `platform_settings`**: Platform and user configurations.
- **`labs`**: Information about registered lab partners (Name, Address, Logo, Verification status).
- **`lab_tests`**: Lab-specific catalog containing price, TAT, and active status.
- **`master_tests`**: A global registry of standard medical tests.
- **`bookings`**: Core transaction table holding patient details, total amounts, statuses, and assigned labs.
- **`booking_items`**: Sub-items linked to a booking (individual tests).
- **`notifications`**: System notifications.
- **`app_promotions` / `banners`**: Promotional assets managed by super-admin.
- **`payment_history` / `receipts` / `reports`**: Financial and medical record tracking.

## Design Patterns
- **Authentication:** OAuth via Supabase for Lab Partners (Google), and custom server-actions based auth for Super Admins.
- **Form Handling:** Uses `react-hook-form` paired with `zod` for robust client-side validation.
- **Styling:** TailwindCSS is used for utility-first responsive styling with custom color schemes for portals.
