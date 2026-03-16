# Relavo Backend — Node.js API

The Relavo Backend is a Node.js/Express application that serves as the primary REST API for the platform. It handles data orchestration, authentication validation, and communication with the AI Service.

## Module Purpose
- Provide a secure API for the Frontend dashboard.
- Manage client, touchpoint, and invoice data in Supabase.
- Trigger AI health score calculations and summaries.
- Generate and manage client alerts.

## Project Structure
```text
backend/
├── src/
│   ├── app.js            # Express application setup
│   ├── index.js          # Entry point (server start)
│   ├── routes/           # Route definitions (Auth, Clients, Alerts, AI)
│   ├── controllers/      # Business logic handlers
│   ├── services/         # External integrations (AI Service, Supabase)
│   ├── middleware/       # JWT validation, error handling
│   └── utils/            # Helper functions
├── tests/                # Jest unit and integration tests
└── .env                  # Environment variables
```

## API Endpoints

### Auth
*Managed primarily via Supabase, but some routes may proxy or handle user profiles.*

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/profile` | Update user profile/settings |

### Clients
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/clients` | List all clients for the user |
| POST | `/api/clients` | Create a new client |
| GET | `/api/clients/:id` | Get details for a specific client |
| PUT | `/api/clients/:id` | Update client details |
| DELETE | `/api/clients/:id` | Remove a client |
| GET | `/api/clients/:id/health` | Get health score history for a client |

### Touchpoints & Invoices
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/clients/:id/touchpoints` | Log a new interaction |
| GET | `/api/clients/:id/touchpoints` | List interactions for a client |
| POST | `/api/clients/:id/invoices` | Add a new invoice |
| PATCH | `/api/invoices/:id` | Update invoice status (e.g., mark as paid) |

### Alerts
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/alerts` | List all active alerts |
| PATCH | `/api/alerts/:id/read` | Mark alert as read |

### AI Integration
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/ai/calculate-score/:clientId` | Trigger immediate health score calculation |
| POST | `/api/ai/draft-email/:clientId` | Generate a re-engagement email draft |

## External Service Connections

### AI Service
- **Connection**: REST over HTTP.
- **Service**: Python/FastAPI (`/ai-service`).
- **Endpoints used**: `/score`, `/summarize`, `/suggest`.

### Supabase
- **Connection**: PostgreSQL via `@supabase/supabase-js`.
- **Purpose**: Persistent storage and authentication verification.

## Environment Variables

```env
PORT=3001
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_KEY=your-service-role-key
AI_SERVICE_URL=http://localhost:8000
```
