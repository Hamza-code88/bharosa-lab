# Active Context

## Current State
The application is in a highly functional state following the successful Next.js 16 build. The public marketing site, billing, lab partner portal, and super administration workflows are fully operational and synchronized.

## Recent Updates
- **Payment UI (`payment/page.tsx`):**
  - Designed a Hostinger-style secure checkout page.
  - Integrated a 5-minute countdown timer that runs when payment is pending review.
  - Implemented dynamic rendering of bank details (Easypaisa, JazzCash, SadaPay) fetched from global `app_settings`.
- **Discord Webhook Integration (`api/payment/route.ts`):**
  - File uploads and payment details are sent directly to `DISCORD_PAYMENTS_WEBHOOK_URL`.
  - Added an automated email template generator directly inside the Discord message for admins to easily copy/paste to the client.
- **Super Admin Billing UI (`super-admin/billing/page.tsx`):**
  - Added a Billing Settings modal to globally configure `app_settings` (thresholds, bank details, fees).
  - Built a comprehensive data table displaying lab statuses (Auto-Blocked, Active, Inactive).
  - Added a Payment Ledger / History modal for tracking past cleared payments per lab.
- **Supabase & Environment:**
  - Decided to leave Supabase RLS policy warnings alone for the time being.
  - Successfully migrated and built under Next.js 16 without errors.
- **Bug Fixes & Workflow Enhancements (Post-Build):**
  - **Payment Redirect Loop Fix:** Modified `payment/page.tsx` to handle manually locked accounts gracefully and decoupled Commission checks from Registration checks.
  - **Client-Side Routing Fix:** Updated `dashboard/layout.tsx` to depend on `usePathname()` so manual locks/unlocks take effect instantly without a hard refresh.
  - **Dedicated Registrations Page:** Created `super-admin/registrations/page.tsx` for handling 30-day trial status, manual locks, and registration fee approvals independently from commission billing.
  - **AI Email Generation:** Integrated Groq API (`llama-3.3-70b-versatile`) in `/api/payment/route.ts` to dynamically generate highly professional, customized payment approval emails sent to Discord.
  - **Payment UI Refinements:** Fixed text visibility on sender name input (`text-gray-900`), persisted the 5-minute timer using `localStorage`, and added a "Cancel & Re-upload" button for lab owners stuck on the timer screen.
  - **Admin Billing Controls:** Added "Reject" and "Revert Last Approval" buttons to correctly manage fraudulent payments while ensuring `registration_status` and `payment_status` are fully cleared so labs don't get trapped in pending screens.
  - **Automated Locking (Cron):** Implemented `/api/cron/auto-lock/route.ts` and `vercel.json` to run hourly and automatically set `is_active = false` for labs whose trial has expired or who exceed the commission limit. This ensures the Patient App automatically hides these labs.
- **Official Bharosa Lab Multi-Page Website & Partner Login:**
  - Designed and deployed the official public-facing website on the root `/` route.
  - Built dedicated pages: `/services`, `/doctors`, `/partner-labs`, `/partner-with-us`, `/about`, `/contact`, `/faq`, `/terms`, `/privacy-policy`.
  - Moved the Google OAuth Partner Login screen to `/login` with clean links to and from the public website.
  - Maintained 100% English professional tone with SDG alignments (SDG 3, 9, 10, 17) and responsible medical framing.
- **Navbar & Doctor Portal Updates:**
  - Increased Navbar brand logo sizing and proportions with responsive typography across all screen sizes.
  - Replaced plain text in the top micro-bar with interactive, clickable Instagram, Facebook, and WhatsApp icons and direct phone links.
  - Added official multi-color Google Play Store vector icon to the primary "Download App" CTA buttons.
  - Completely removed the doctor registration inquiry form from `/doctors` and replaced all doctor CTAs across the entire platform (Navbar, Hero Slides, Homepage, Services, Footer) with direct redirects to the dedicated practitioner portal: `https://bharosa-doctor.vercel.app/auth`.
  - Verified Next.js 16 build passing with 30/30 static and dynamic routes compiled successfully.

## Next Steps
- Continue addressing any user feedback on the newly created website pages and layout.
- Prepare for production deployment and finalize domain setup.
