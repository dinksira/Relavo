# Relavo Database — Supabase (PostgreSQL)

Relavo uses Supabase for relational data storage. The schema is optimized for tracking client health over time and logging interactions.

## Data Models

### `clients`
Primary table for client information.
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | Owner (FK to auth.users) |
| name | text | Company or client name |
| contact_name | text | Primary contact person |
| email | text | Contact email |
| phone | text | Contact phone |
| status | enum | active, paused, churned |
| notes | text | General notes |
| created_at | timestamp | Record creation time |

### `health_scores`
Stores historical and current health scores.
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| client_id | uuid | FK to clients |
| score | integer | 0–100 |
| risk_level | enum | healthy, needs_attention, at_risk |
| factors | jsonb | Breakdown of score components |
| ai_insight | text | Claude-generated explanation |
| calculated_at | timestamp | When the score was computed |

### `touchpoints`
Logs of interactions with clients.
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| client_id | uuid | FK to clients |
| type | enum | call, email, meeting, message |
| notes | text | Discussion details |
| outcome | enum | positive, neutral, negative |
| logged_at | timestamp | Time of interaction |
| created_at | timestamp | Record creation time |

### `invoices`
Tracking financial health.
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| client_id | uuid | FK to clients |
| amount | numeric | Total amount |
| status | enum | pending, paid, overdue |
| due_date | date | Payment deadline |
| paid_date | date | Actual payment date (optional) |

### `alerts`
System-generated notifications.
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| client_id | uuid | FK to clients |
| type | enum | no_contact, overdue_invoice, score_drop, sentiment |
| severity | enum | low, medium, high |
| message | text | Alert description |
| ai_suggestion | text | Claude-generated suggestion |
| read | boolean | User acknowledgment status |

## Database Views & Functions (Planned)

### `v_client_summary`
A view that joins `clients` with their latest `health_scores` record for the main dashboard display.

### `fn_calculate_global_stats()`
A PostgreSQL function to calculate average health scores across all clients for a specific user.

## Real-time Subscriptions
The following tables are enabled for Supabase Realtime:
- `alerts`: To provide instant notifications in the dashboard.
- `health_scores`: To update the UI as soon as a background calculation finishes.
