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
| GET | `/health` | N/A | `{ "status": "ok", "service": "relavo-ai" }` |
| POST | `/score` | `ClientData` | `{ "score": 85, "risk_level": "healthy", ... }` |
| POST | `/summarize` | `ClientData` | `{ "ai_insight": "Client is healthy...", ... }` |
| POST | `/suggest` | `EmailRequest` | `{ "subject": "...", "body": "..." }` |

## Data Models

### ClientData (JSON)
| Field | Type | Description |
|-------|------|-------------|
| client_name | string | Name of the client |
| days_since_contact | int | Days since last interaction |
| overdue_invoices_count | int | Number of unpaid invoices |
| response_time_trend | float | Change in response speed (-1 to 1) |
| activity_ratio | float | Current activity vs historical (0.1 to 2.0) |

### EmailRequest (JSON)
| Field | Type | Description |
|-------|------|-------------|
| client_name | string | Name of the recipient |
| context | string | Details about the client relationship |
| tone | string | Optional: Professional, Friendly, Urgent (default: Professional) |

## AI Logic: Scoring Weights
The service calculates the health score (0–100) using the following weights:
- **Last Contact (35%)**: Penalty applies after 10 days of no contact.
- **Financial Status (30%)**: Significant impact based on overdue invoice count.
- **Activity Engagement (20%)**: Measured against historical project ratios.
- **Response Velocity (15%)**: Real-time trend analysis of communication speed.

## Service Connections

### Anthropic Claude API
- **Model**: `claude-3-haiku-20240307` (Default) or `claude-3-sonnet`.
- **Primary Tasks**: `summarize` (insight generation) and `suggest` (email drafting).

## Environment Variables

```env
ANTHROPIC_API_KEY=your-api-key
AI_SERVICE_PORT=8000
```
