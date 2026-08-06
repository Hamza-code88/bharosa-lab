# Project Brief

## Purpose and Scope
Bharosa Lab (Lab-Ghar) is a multi-tenant laboratory management system built with Next.js 16 and Supabase. It enables diagnostic labs to seamlessly register, manage test catalogs, process bookings, and handle patient records.

The platform provides a sophisticated billing and commission architecture allowing Super Admins to monetize the system via registration fees and percentage-based commissions. Labs have a trial period and are prompted via automated systems when limits are exceeded.

## Core Features
- **Lab Management:** Multi-tenant dashboard for individual labs.
- **Payment & Billing:** 
  - Dynamic commission threshold limits and registration fees via `app_settings`.
  - Seamless Hostinger-style checkout UI (`payment/page.tsx`) with a 5-minute countdown timer for verification pending state.
  - Super Admin Billing UI to review payments, manually approve, toggle activation statuses, and view payment ledgers.
- **Notification Systems:** Discord Webhook integrations for instant notification of payment receipts, including automated email templates for admin convenience.
- **Authentication & Security:** Powered by Supabase Auth with RLS (Row Level Security). RLS policies are implemented, and minor warnings are intentionally ignored for now based on project decisions.
