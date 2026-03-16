<p align="center">
  <img src="./docs/assets/relavo-logo.svg" alt="Relavo Logo" width="300">
</p>

# Relavo 🤝

> AI-Powered Client Relationship Health Platform for Small Businesses & Agencies

Relavo helps you detect at-risk clients before they churn — using AI to score, summarize, and suggest actions across all your client relationships.

## Project Structure

```
relavo/
├── frontend/         # React + Vite dashboard (deployed on Vercel)
├── backend/          # Node.js REST API (deployed on Railway)
├── ai-service/       # Python AI microservice — Claude API + ML scoring
├── mobile/           # React Native app (Expo) — Phase 2
├── docs/             # [Architecture, API docs, design system](./docs/README.md)
└── infrastructure/   # Docker, CI/CD, GitHub Actions
```

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS |
| Backend | Node.js, Express, Supabase |
| AI Service | Python, FastAPI, Claude API |
| Database | Supabase (PostgreSQL) |
| Mobile | React Native (Expo) |
| Deployment | Vercel + Railway |

## Getting Started

```bash
# Clone the repo
git clone https://github.com/yourusername/relavo.git
cd relavo

# Setup each service
cd frontend && npm install
cd ../backend && npm install
cd ../ai-service && pip install -r requirements.txt
```

## Build in Public
Follow the journey on LinkedIn 🚀
