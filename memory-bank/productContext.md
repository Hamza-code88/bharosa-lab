# Product Context

## Target Audience
The application serves two primary user personas:
1. **Lab Owners / Managers:** Seeking to digitize their laboratory operations, track patient bookings, and manage test inventories. They require an easy-to-use platform with transparent billing and straightforward payment mechanisms.
2. **Platform Super Admins:** The owners of Bharosa Lab, needing tools to oversee all registered labs, enforce commission limits, approve manual payments (Easypaisa, JazzCash, SadaPay), and track billing history.

## Problem Solved
Traditional lab management systems are single-tenant, expensive, or lack integrated billing. Lab-Ghar provides a unified SaaS solution:
- It eliminates the friction of manual follow-ups for commission collection by automatically locking the lab's dashboard when thresholds are met.
- Provides an intuitive Hostinger-style secure checkout for labs to upload payment proofs.
- Bridges the gap between admin review and user notification via automated Discord webhook alerts equipped with pre-formatted email templates.

## User Experience Highlights
- **Labs:** Get a clean dashboard, 30-day trials, and a transparent payment page with real-time countdown timers.
- **Admins:** A consolidated Super Admin Billing panel (`super-admin/billing/page.tsx`) offering ledger history, search functionality, toggle switches for portal access, and settings modal for app-wide commission rates and bank details.
