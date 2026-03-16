# Alerts API

The Alerts API manages real-time notifications triggered by client health changes, overdue invoices, or lack of contact.

## Purpose
To provide the Frontend with a list of actionable items to maintain client relationship health.

## Endpoints

| Method | Path | Description | Auth Required |
|--------|------|-------------|---------------|
| GET | `/api/alerts` | Get all active alerts for the user | Yes |
| PATCH | `/api/alerts/:id/read` | Mark an alert as viewed/read | Yes |
| DELETE | `/api/alerts/:id` | Dismiss an alert | Yes |

## Data Models

### Alert Object
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Unique alert identifier |
| client_id | uuid | Associated client ID |
| type | string | `no_contact`, `overdue_invoice`, `score_drop`, `sentiment` |
| severity | string | `low`, `medium`, `high` |
| message | string | Human-readable alert text |
| ai_suggestion | string | Suggestion from Claude API |
| read | boolean | Status of the alert |
| created_at | timestamp | When the alert was triggered |

## Examples

### GET /api/alerts
**Response (200 OK)**:
```json
[
  {
    "id": "a1b2c3d4...",
    "client_id": "c9d8e7f6...",
    "client_name": "Acme Corp",
    "type": "overdue_invoice",
    "severity": "high",
    "message": "Invoice #102 is 5 days overdue.",
    "ai_suggestion": "Send a gentle reminder email or log a check-in call.",
    "read": false,
    "created_at": "2024-03-10T10:00:00Z"
  }
]
```

### PATCH /api/alerts/:id/read
**Request Body**:
```json
{
  "read": true
}
```
**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Alert marked as read"
}
```
