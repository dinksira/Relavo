# Relavo Infrastructure — Docker & CI/CD

Relavo is designed to be easily deployable using Docker and automated via GitHub Actions for continuous integration and deployment.

## Purpose
- Ensure consistent development environments across the team.
- Automate testing and deployment to cloud providers (Vercel, Railway).
- Manage orchestration of multi-container setups.

## Local Development with Docker

The project includes a `docker-compose.yml` file in the root directory to spin up all services locally.

### Containers
1. **`relavo-frontend`**: React dashboard on port 3000.
2. **`relavo-backend`**: Node.js API on port 3001.
3. **`relavo-ai`**: Python FastAPI on port 8000.

### Running the Stack
```bash
docker-compose up --build
```

## CI/CD Pipeline (GitHub Actions)

The `.github/workflows` directory contains the automation logic.

### 1. Build and Test (`ci.yml`)
- Triggered on: All PRs to `main`.
- Actions:
  - Linting (ESLint for JS, Flake8 for Python).
  - Unit tests (Jest for Backend/Frontend, Pytest for AI Service).
  - Build checks (Vite build).

### 2. Deployment (`deploy.yml`)
- Triggered on: Merge to `main`.
- Targets:
  - **Frontend**: Deployed to **Vercel**.
  - **Backend & AI Service**: Deployed to **Railway**.

## Required Secrets for CI/CD

To enable automated deployments, the following secrets must be configured in GitHub:
- `SUPABASE_SERVICE_KEY`: For database migrations.
- `VERCEL_TOKEN`: For frontend deployment.
- `RAILWAY_TOKEN`: For backend and AI service deployment.
- `ANTHROPIC_API_KEY`: Injected into the AI Service environment.

## Deployment Strategy

| Service | Host | Strategy |
|---------|------|----------|
| Frontend | Vercel | Immutable deploys with preview URLs |
| Backend | Railway | Rolling updates with health checks |
| AI Service | Railway | Rolling updates |
| Database | Supabase | Managed PostgreSQL with point-in-time recovery |
