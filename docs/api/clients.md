# Clients API

The Clients API is the core endpoint for managing the business's client portfolio.

## Purpose
Enables CRUD operations for clients and associated touchpoints, invoices, and health history.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/clients` | List all clients |
| POST | `/api/clients` | Add a new client |
| GET | `/api/clients/:id` | Get client details & health score |
| PUT | `/api/clients/:id` | Update client information |
| DELETE | `/api/clients/:id` | Archive/delete a client |
| GET | `/api/clients/:id/history` | Get 30-day health score trend |

## Request/Response Examples

### POST /api/clients
**Request Body**:
```json
{
  "name": "Wayne Enterprises",
  "contact_name": "Bruce Wayne",
  "email": "bruce@waynecorp.com",
  "phone": "555-0199",
  "status": "active"
}
```

**Response (201 Created)**:
```json
{
  "id": "u4v5w6x7...",
  "status": "success",
  "data": {
    "id": "u4v5w6x7...",
    "name": "Wayne Enterprises",
    "initial_score": 100
  }
}
```

### GET /api/clients/:id
**Response (200 OK)**:
```json
{
  "id": "u4v5w6x7...",
  "name": "Wayne Enterprises",
  "current_score": 82,
  "risk_level": "healthy",
  "ai_insight": "Wayne Enterprises has regular contact, but one invoice is pending. Overall relationship is strong.",
  "last_contact": "2024-03-08",
  "status": "active"
}
```

## Error Codes
| Code | Description |
|------|-------------|
| 400 | Missing required fields (e.g., name, email) |
| 404 | Client ID not found |
| 401 | Unauthorized (JWT missing or invalid) |
