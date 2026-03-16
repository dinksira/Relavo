# Relavo AI Service — Python/FastAPI

The AI Service is a Python-based utility microservice that handles the heavy lifting for health scoring, natural language generation, and email drafting using the Anthropic Claude API.

## Module Purpose
- Calculate weighted client health scores.
- Transform raw client data into human-readable insights.
- Provide personalized re-engagement suggestions.
- Draft emails based on client history.

## Project Structure
```text
ai-service/
├── src/
│   ├── main.py           # FastAPI app entry point
│   ├── routes/           # Endpoint handlers (score, summarize)
│   ├── services/         # Claude API and logic integrations
│   ├── models/           # Pydantic data models
│   └── utils/            # Scoring formulas and helpers
├── tests/                # Pytest suit
└── requirements.txt      # Python dependencies
```

## API Endpoints

| Method | Path | Request Body | Response JSON |
|--------|------|--------------|---------------|
| POST | `/score` | `{ "client_id": "...", "data": {...} }` | `{ "score": 85, "risk_level": "healthy" }` |
| POST | `/summarize` | `{ "client_id": "...", "data": {...} }` | `{ "insight": "Client is healthy..." }` |
| POST | `/suggest` | `{ "client_id": "...", "reason": "..." }` | `{ "action": "Call client", "draft": "..." }` |

## Data Models

### HealthScoreInput (JSON)
| Field | Type | Description |
|-------|------|-------------|
| days_since_contact | int | Number of days since last interaction |
| overdue_invoices | int | Count of unpaid invoices past due |
| response_time_trend | float | Change in response time (-1 to 1) |
| activity_level | int | Task/project activity count |

### AISummary (Response)
| Field | Type | Description |
|-------|------|-------------|
| insight | string | 2–3 sentence plain-English summary |
| suggested_action | string | Next best action recommendation |

## AI Logic: Scoring Weights
The service calculates the health score (0–100) using the following weights:
- **Last Contact (30%)**: Decay starts after 7 days of no contact.
- **Invoices (25%)**: Penalties for overdue status and total amount.
- **Response Time (25%)**: Trend analysis over the last 30 days.
- **Activity (20%)**: Project/task volume relative to historical average.

## Service Connections

### Anthropic Claude API
- **Model**: `claude-3-sonnet-20240229` (or latest).
- **Purpose**: Powering the `summarize` and `suggest` (email drafting) features.

## Environment Variables

```env
ANTHROPIC_API_KEY=your-api-key
AI_SERVICE_PORT=8000
```
