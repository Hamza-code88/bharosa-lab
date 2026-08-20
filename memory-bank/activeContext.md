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

### 6. Super Admin Dynamic Terms & Conditions & System Settings
- **Terms & Conditions Control**: Added dynamic `terms_and_conditions` textarea field in Super Admin Settings (`app/super-admin/settings/page.tsx`) saved directly into Supabase `app_settings` (id = 1), powering mandatory user acceptance in the mobile app.
- **Push Notification Backend (`app/api/push/route.ts` & `lib/sendNotification.ts`)**: Integrated Expo Push Notification proxy (`https://exp.host/--/api/v2/push/send`) triggering high-priority status change alerts to patients whenever a lab accepts, processes, or completes an order.

## Next Steps
- Stand ready for the user's next set of features or enhancements.
- Maintain existing standards: no unrequested builds, preserve clean Navy/Emerald theme, direct channel routing, and no cluttered AI pill tags.
