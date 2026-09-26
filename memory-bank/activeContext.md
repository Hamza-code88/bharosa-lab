# Active Context

## Current State
The application is in a fully synchronized, production-ready state following a successful Next.js 16 (Turbopack) build where all 30 static and dynamic routes compiled with zero errors (Exit Code 0). The public healthcare portal, partner lab SaaS, and admin billing are fully unified.

## Recent Major Updates & Architectural Decisions

### 1. Brand Logo Asset & Typography Optimization
- **Natural Aspect Ratio**: Identified that `public/logo.png` is an authentic 677×369 landscape graphic. Replaced restrictive square wrappers with dynamic `h-11 sm:h-13 lg:h-15 w-auto object-contain` sizing in both `Navbar.tsx` and `Footer.tsx`.
- **Tagline Placement**: Removed separate duplicate "Bharosa Lab" text, allowing the full high-res brand artwork to take center stage, with the official slogan *"Where Trust Makes Life Easier"* placed cleanly underneath.

### 2. Complete Removal of Submission Forms (Direct Channel Routing)
- **`/doctors` Page**: Removed the doctor inquiry form; all doctor CTAs across the entire platform redirect directly to the dedicated practitioner portal: `https://bharosa-doctor.vercel.app/auth`.
- **`/partner-with-us` Page**: Removed inquiry form and state; replaced with 3 direct collaboration pathways:
  1. *Diagnostic Laboratories:* Direct link to `/login` for SaaS onboarding.
  2. *Medical Doctors:* Direct link to `https://bharosa-doctor.vercel.app/auth`.
  3. *Institutional / SDG Partners:* Direct WhatsApp & Helpline integration.
- **`/contact` Page**: Completely removed the contact submission form; replaced with direct, high-impact one-click cards for:
  - **Phone Helpline:** `03141811158` (`tel:03141811158`)
  - **WhatsApp Support:** `03141811158` (`https://wa.me/923141811158`)
  - **Official Email:** `bharosalabo@gmail.com` (`mailto:bharosalabo@gmail.com`)
  - **Instagram:** `@bharosa_lab` (`https://instagram.com/bharosa_lab`)
  - **Facebook:** `Bharosa Lab` (`https://facebook.com/BharosaLab`)

### 3. Clean UI & Removal of AI-Looking Eyebrow Badges
- Removed all small pill category tags (`CORE SERVICES`, `PATIENT JOURNEY`, `FOR PATIENTS & FAMILIES`, `PRACTICE MANAGEMENT`, etc.) and generic filler subtitle lines across all public pages (`/`, `/services`, `/doctors`, `/partner-labs`, `/partner-with-us`, `/about`, `/contact`, `/faq`).
- Headings are now clean, human-designed, and high-impact.

### 4. Strict Color Theme Unification
- Restrained color palette strictly to **Navy Blue (`#1E3A5F`, `#0B132B`)** and **SDG Emerald / Green / Teal (`#4C9F38`, `teal-600`, `emerald-600`)**.
- Eliminated extraneous pink, purple, and random multi-color gradients while preserving authentic UN SDG colors for SDG 3 (Green), SDG 9 (Orange), SDG 10 (Rose/Magenta), and SDG 17 (Navy).

### 7. Social Impact & UN SDG Alignment (Including SDG 1 Pledge)
- **SDG 1 (No Poverty - 2% Healthcare Pledge)**: Integrated UN SDG 1 into the official impact alignment on both Homepage (`app/page.tsx`) and About Page (`app/about/page.tsx`), officially documenting Bharosa Lab's pledge to allocate **2% of future platform revenue** towards sponsoring essential diagnostic tests and medical assistance for underprivileged families.
- **5-Pillar UN SDG Framework**:
  1. *SDG 1 (No Poverty - 2% Pledge)*
  2. *SDG 3 (Good Health & Well-Being - Primary Mission)*
  3. *SDG 9 (Industry, Innovation & Infrastructure - Pathology SaaS)*
  4. *SDG 10 (Reduced Inequalities - Home Phlebotomy Access)*
  5. *SDG 17 (Partnerships for the Goals - Lab & Doctor Network)*

### 9. Laboratory Intelligence & Visual Analytics Dashboard (`app/dashboard/page.tsx`)
- **Top 6 Grouped Executive KPI Cards**: Unified all core financial & operational metrics at the top (Total Billed, Commission Due, Clear Profit, Pending Orders, Published Tests, Unique Patients).
- **Clean Clinical Healthcare Theme**: Pure white medical cards (`bg-white border-slate-200`) with high-contrast bold dark slate typography (`text-slate-900`), vibrant emerald/teal/indigo chart bars, and full-width Top 5 Prescribed Diagnostic Tests demand breakdown.
- **Mobile Responsive & Touch-Optimized**: Full viewport adaptation, no horizontal scroll clipping, and tap-friendly tooltip inspection for mobile devices.

### 11. Multi-User Lab Access & Staff Invite Link System
- **Staff Invitation Mechanism**: Built dedicated team management portal (`app/dashboard/staff/page.tsx`). Lab owners can copy a one-click invite link (`/join-lab?code=...`) or share an 8-character alphanumeric code (`BL-XXXXXX`).
- **Staff Onboarding & Acceptance**: Created `/join-lab/page.tsx` with lab preview card, owner details, and an "Accept Invite & Access Portal" action.
- **Multi-Lab Context Switching**: Implemented `lib/activeLab.ts` and `components/dashboard/LabSwitcher.tsx` supporting seamless switching between owned and invited labs stored in `localStorage` without sharing owner account credentials.
- **Database Schema**: Created `supabase_staff_migration.sql` introducing `lab_staff` table, `invite_code` in `labs`, and full RLS policies.

### 12. Per-Lab Custom Commission Cut (%) Architecture
- **Negotiated Lab Commission Cuts**: Replaced the rigid single global commission percentage with per-lab customized cuts configurable in Super Admin Billing (`/super-admin/billing`).
- **Seamless Global Fallback**: Labs without a negotiated rate (`commission_percentage IS NULL`) automatically inherit the global default rate from `app_settings.commission_percentage`.
- **Live Recalculation & Portal Synchronization**:
  - Super Admin Billing table features an inline cut editor (`%`) with instant live recalculation of accrued dues upon saving.
  - Lab dashboard metrics (`app/dashboard/page.tsx`) display the lab's negotiated platform fee.
  - Rolling lock threshold check (`app/dashboard/layout.tsx`) and payment checkout dues (`app/payment/page.tsx`) accurately calculate against the customized rate.
  - Super Admin Dashboard Analytics (`app/super-admin/dashboard/page.tsx`) accurately computes platform lifetime commission and lab performance cuts across varying individual rates.
- **Database Migration**: Added `supabase_custom_commission.sql` adding `commission_percentage NUMERIC DEFAULT NULL` to the `labs` table.

## Next Steps
- Production deployment ready for Vercel / server hosting.
- Maintain existing standards: no unrequested builds, preserve clean Navy/Emerald theme, direct channel routing, and no cluttered AI pill tags.
