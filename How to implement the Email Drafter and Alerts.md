# How to implement the Email Drafter and Alerts

This document provides a technical walkthrough for implementing the "Day 5" features: the AI Email Drafter and the fully operational Alerts system.

## 1. AI Email Drafter

The goal is to allow users to generate a personalized re-engagement email for at-risk clients with a single click.

### Architectural Flow
1. **Frontend**: The user clicks a "Draft Email" button (either on the Client Detail page or from an Alert).
2. **Modal**: `EmailDraftModal.jsx` opens, allowing the user to select a **Tone** (Warm, Professional, Direct).
3. **Backend API**: Calling `POST /api/ai/draft-email` with `clientId` and `tone`.
4. **Context Gathering**: The backend fetches:
   - Client details (Name, contact person)
   - Latest health score & AI insight
   - Recent touchpoints (last 3)
   - Overdue invoice count
5. **AI Processing**: The `ai-service` (Python) uses Claude/OpenRouter to draft the email based on this context.
6. **Interaction**: The user can **Copy to Clipboard** or **Regenerate** with a different tone.

### Key Files
- `frontend/src/components/clients/EmailDraftModal.jsx`: The UI for the drafter.
- `backend/src/routes/ai.routes.js`: The API endpoint that orchestrates context gathering.
- `ai-service/src/services/drafter.py`: The Python service containing the AI prompt logic.

### Missing Implementation Steps
- [ ] **Add Trigger Button**: Add a "Draft Email" button to the header of `ClientDetailPage.jsx`.
- [ ] **Alert Integration**: In `AlertsPage.jsx`, update the "Take AI Action" button to open the `EmailDraftModal` for the respective client.

---

## 2. Smart Alerts System

Fully operational alerts that categorize risks and provide actionable suggestions.

### Current Implementation
- **Generation**: Alerts are automatically generated in `backend/src/services/health.service.js` whenever a health score is (re)calculated.
- **Persistence**: Saved in the `alerts` table in Supabase.
- **Filtering**: `AlertsPage.jsx` supports filtering by `unread`, `high`, `medium`, and `low` severity.
- **Actions**: Users can "Mark as Read" or "Dismiss" (delete) alerts.

### Real-time Alerts Badge
To make the sidebar badge real-time:
1. **Supabase Realtime**: Use the `supabase.channel()` API in `useAlerts` hook to listen for `INSERT` or `UPDATE` events on the `alerts` table.
2. **State Sync**: When a change is detected, re-fetch the unread count or update the local `alerts` state.

```javascript
/* Example Realtime setup in useAlerts.js */
useEffect(() => {
  const channel = supabase
    .channel('public:alerts')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'alerts' }, () => {
      fetchAlerts();
    })
    .subscribe();

  return () => supabase.removeChannel(channel);
}, []);
```

---

## 3. Weekly Digest Email (Node-Cron)

A summary email sent every Monday morning to the account manager.

### Required Setup
1. **Install Dependencies**:
   ```bash
   cd backend
   npm install resend node-cron
   ```
2. **Email Service**: Create `backend/src/services/email.service.js` to wrap the Resend API.
3. **Cron Job**: Add the schedule to `backend/src/index.js`.

### Implementation Logic
```javascript
// backend/src/index.js
const cron = require('node-cron');
const emailService = require('./services/email.service');

// Every Monday at 8:00 AM
cron.schedule('0 8 * * 1', async () => {
  console.log('Running weekly digest cron...');
  // 1. Fetch all users
  // 2. For each user, fetch their "at-risk" clients (score < 50)
  // 3. Generate a summary email
  // 4. Send via emailService
});
```

### Email Template Requirements
- **Greeting**: Personal "Good morning [Name]".
- **At-Risk Clients**: Bulleted list of clients with critical scores.
- **Actionable Steps**: One AI-suggested "next step" per client.
- **Revenue at Risk**: Sum of monthly revenue for all at-risk clients.

---

## 4. Tone Selector & Regeneration

The `EmailDraftModal.jsx` is already designed with these features:
- **Tones**: `warm`, `professional`, `direct`.
- **Regeneration**: A "Rotate" icon triggers a new API call with the same ID but updated tone.
- **Direct Edit**: The AI output is placed in a textarea so the user can make final tweaks before copying. 
