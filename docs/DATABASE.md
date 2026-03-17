# Relavo Database — Supabase (PostgreSQL)

Relavo uses Supabase for relational data storage. The schema is optimized for tracking client health over time and logging interactions under a multi-tenant Agency model.

## Data Models

### `agencies` (Main Workspace)
Primary table for agency profiles and branding.
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| name | text | Name of the agency |
| owner_email | text | Unique contact email |
| branding | jsonb | Custom colors and logo URLs |
| created_at | timestamp | Record creation time |

### `clients` (Individual Accounts)
Stores the current state of client relationship health.
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| agency_id | uuid | FK to agencies |
| name | text | Primary contact name |
| company_name | text | Professional entity name |
| email | text | Contact email |
| vitality_score | integer | 0–100 calculated health score |
| status | text | Healthy, Needs Attention, At Risk |
| score_trend | integer | Shift in score since last period |
| monthly_revenue | numeric | Estimated recurring revenue |
| last_contact_at | timestamp | Most recent touchpoint date |
| created_at | timestamp | Record creation time |

### `alerts` (AI Smart Signals)
Active notifications based on health signal triggers.
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| client_id | uuid | FK to clients |
| message | text | Alert description |
| severity | text | low, medium, high |
| is_active | boolean | Current status |
| read_at | timestamp | Acknowledgment time |
| created_at | timestamp | Alert generation time |

### `invoices` (Financial Pulse)
Tracking billing status for revenue at risk calculation.
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| client_id | uuid | FK to clients |
| invoice_number | text | Formatted identifier |
| amount | numeric | Total value |
| due_date | date | Payment deadline |
| status | text | Pending, Paid, Overdue, Cancelled |
| paid_at | timestamp | Time of resolution |

### `touchpoints` (Communication History)
Logs of interactions analyzed by the AI engine.
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| client_id | uuid | FK to clients |
| type | text | email, call, meeting, message |
| date | timestamp | Interaction occurrence |
| notes | text | Private detail summaries |
| sentiment_score | numeric | 0.0 to 1.0 (AI generated) |
| created_at | timestamp | Record creation time |

## Security Layer (RLS)
The database utilizes **Row Level Security (RLS)** to ensure data isolation between agencies. Policies are enforced using authenticated Supabase JWT tokens.

## Real-time Subscriptions
The following tables are enabled for Supabase Realtime:
- `alerts`: Instant dashboard notifications.
- `clients`: Dynamic health score updates in the directory.
