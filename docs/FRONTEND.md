# Relavo Frontend — React Dashboard

The Relavo Frontend is a modern React application built with Vite and Tailwind CSS. It provides a highly visual and interactive experience for managing client relationships.

## Module Purpose
- Provide a unified dashboard for client health monitoring.
- Visualize trends and risk factors using charts.
- Interface for logging touchpoints and managing invoices.
- Display real-time AI insights and alerts.
- Handle user authentication and session management.

## Project Structure
```text
frontend/
├── src/
│   ├── components/       # Reusable UI components (Cards, Charts, Modals)
│   ├── pages/            # Page-level components (Dashboard, ClientDetails)
│   ├── services/         # API clients for Backend and Supabase
│   ├── store/            # Zustand state management
│   ├── hooks/            # Custom React hooks (e.g., useAuth, useClients)
│   ├── utils/            # Formatters, validators
│   └── assets/           # Global styles and static files
├── public/               # Static assets
└── tailwind.config.js    # Design system configuration
```

## Key Views

### 1. Main Dashboard
- **Client Cards**: Displays name, current health score (with color coding), and a risk level badge.
- **Top Metrics**: Total active clients, average health score, count of "At Risk" clients.
- **Alert Feed**: Real-time list of client alerts and suggested actions.

### 2. Client Profile
- **Health Trend**: Line chart showing score changes over the last 30 days.
- **Touchpoint History**: Timeline of recent interactions.
- **AI Summary Section**: Detailed plain-English summary and "Draft Re-engagement Email" button.
- **Invoices Table**: Status and due dates of all invoices.

### 3. Touchpoint Logger
- A quick-entry modal to record outcomes of calls, meetings, and emails.

## State Management (Zustand)

| Store | Responsibility |
|-------|----------------|
| `useClientStore` | Caching client lists and details |
| `useAlertStore` | Managing unread alerts and real-time updates |
| `useAuthStore` | Tracking authenticated user profile and tokens |

## Connected Services

### Backend API
- **URL**: `http://localhost:3001` (Dev)
- **Primary Use**: CRUD operations for clients, touchpoints, and triggering AI actions.

### Supabase SDK
- **URL**: `PROJECT_URL`
- **Primary Use**: Authentication (Sign-up, Log-in) and real-time subscriptions to the `alerts` table.

## Environment Variables

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_BASE_URL=http://localhost:3001
```
