# Project: Relavo - Day 5 Implementation Task

You are an expert full-stack developer. Your task is to implement the "Day 5" features for Relavo: AI Email Drafter, Real-time Alerts, and Weekly Digest.

## Task 1: Connect the AI Email Drafter UI
The `EmailDraftModal` component already exists but is not being triggered.
1.  **File**: `frontend/src/pages/ClientDetailPage.jsx`
    - In the header (near "Log Interaction"), add a "Draft Email" button with a `Mail` icon.
    - Use `setEmailModalOpen(true)` when clicked.
2.  **File**: `frontend/src/pages/AlertsPage.jsx`
    - This page needs to import `EmailDraftModal` and `useState` for its visibility.
    - Map the "Take AI Action" button in each alert card to open the `EmailDraftModal` for that specific client.
    - You will need to fetch the full client object or pass the `alert.client_id` to the modal.

## Task 2: Real-time Alerts Badge
Make the sidebar alert badge update instantly when new alerts arrive.
1.  **File**: `frontend/src/hooks/useAlerts.js`
    - Use `supabase.channel` to subscribe to `postgres_changes` on the `alerts` table.
    - On any `INSERT` or `UPDATE` event, call the `fetchAlerts()` function to sync the UI.

## Task 3: Weekly Digest Email System
Implement an automated weekly summary for the user.
1.  **File**: `backend/package.json`
    - Add `resend` and `node-cron` to dependencies.
2.  **File**: `backend/src/services/email.service.js` (Create if missing)
    - Implement a basic service to send emails using Resend (use `process.env.RESEND_API_KEY`).
    - Include a function `sendWeeklyDigest(userEmail, atRiskClients)` that renders a clean HTML/Text summary.
3.  **File**: `backend/src/index.js`
    - Add a `node-cron` schedule for every Monday at 8:00 AM (`0 8 * * 1`).
    - The job should:
        1. Fetch all users from the `profiles` table.
        2. For each user, find clients with `health_score < 60`.
        3. Compose a summary of "At-Risk Revenue" (sum of monthly revenue for these clients).
        4. Send the email via `emailService`.

## Task 4: UI Refinement
1.  **File**: `frontend/src/components/layout/Sidebar.jsx`
    - Ensure the Alerts `NavItem` correctly reflects the `unreadCount` from the hook. (Note: This might already be done, but double-check the badge logic).

## Guidelines:
- Follow the existing design system (Vanilla CSS + Tailwind-like utilities defined in `App.css` or `index.css`).
- Use the `api` services defined in `frontend/src/services/api.js`.
- Maintain error handling for all AI and Email service calls.
- Ensure all new environment variables are added to `.env.example`.
