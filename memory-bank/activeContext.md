# Active Context

## Current State
The Bharosa Lab Partner and Super Admin Portals are actively implemented and functional. 
- **Lab Partner Portal** (`/dashboard`): Contains a functional layout for managing test bookings, lab profiles, and available tests. It utilizes Google OAuth for secure lab partner login.
- **Super Admin Portal** (`/super-admin`): A comprehensive administrative suite protected by custom server-action based authentication. It includes dashboards for ad management, billing, system orders, rider tracking, global settings, and support.

## Recent Work
- Integrated real-time notifications (`NotificationListener.tsx`) that leverage Supabase Postgres Changes to instantly alert lab partners via audio cues and toast notifications when new bookings are inserted.
- Complete implementation of the Next.js App router with strong typing using Zod validation schemas for forms.

## Immediate Focus
- Ensure stability across all real-time subscriptions.
- Continue expanding test coverage or refining UI/UX based on actual laboratory usage feedback.
- (If any new tasks are provided by the user, this section should be updated accordingly).
