# Relavo Frontend — React Dashboard

The Relavo Frontend is a modern React application built with Vite and Tailwind CSS. It provides a highly visual and interactive experience for managing client relationships.

- Provide an immersive, cinematic Landing Page representing the brand's premium value.
- unified dashboard for client health monitoring.
- Visualize trends and risk factors using interactive charts and 3D elements.
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

### 1. Landing Page (Elite)
- **Cinema Hero**: Full-screen interactive background with `Blue_Abstract.mp4` and adaptive typography (Relavo White).
- **Interactive Solutions**: Six HD-visualized cards (Health, AI, Logger, Revenue, Sentiment, Integrations) featuring parallax zoom and 3D lift.
- **Intelligence Showcase**: Cinematic split-screen with `Relationship.mp4` loop and Predictive Retention Engine specifications.
- **Micro-interactions**: Global 3D mouse-tracking tilt effect on key UI dashboard previews.

### 2. Main Dashboard
- **Client Cards**: High-fidelity cards with health scores (weighted algorithm) and risk badges.
- **Top Metrics**: Total live revenue at risk, average portfolio health, and active signal counts.
- **Alert Feed**: Real-time ticker for churn alerts and prioritized re-engagement tasks.

### 3. Client Profile & Tools
- **Deep Health Analysis**: 30-day health trend visualization.
- **Touchpoint History**: Actionable timeline of every client interaction.
- **AI Drafter**: Claude-powered module to generate contextual re-engagement emails.
- **Quick Entry**: Centered modal for rapid interaction logging.

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
