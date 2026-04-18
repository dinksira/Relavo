<p align="center">
  <img src="./frontend/public/favicon.svg" alt="Relavo Logo" width="120">
</p>

<h1 align="center">Relavo 🤝</h1>

<p align="center">
  <strong>Intelligent Client Relationship Management for the AI Era</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React%20%2B%20Vite-blue?style=flat-square" alt="Frontend">
  <img src="https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-green?style=flat-square" alt="Backend">
  <img src="https://img.shields.io/badge/AI%20Service-FastAPI%20%2B%20Groq-orange?style=flat-square" alt="AI Service">
  <img src="https://img.shields.io/badge/Database-Supabase-black?style=flat-square" alt="Database">
</p>

---

Relavo is an **AI-powered relationship health platform** designed for agencies and small businesses. It moves beyond traditional CRM by proactively detecting at-risk clients before they churn. By analyzing touchpoints, payment history, and communication trends, Relavo gives you a "Health Score" for every client and AI-driven suggestions for outreach.

## ✨ Core Features

-   **🧠 Predictive Health Scoring**: Proprietary algorithm weighing silence, invoice delays, and sentiment to generate a real-time health score (0-100).
-   **📝 AI-Powered Briefings**: One-click executive summaries prepared by LLMs (Llama 3.3 / Claude) before your next client meeting.
-   **📧 Automated Email Drafter**: Context-aware email generation for outreach, tailored to the client's current risk level.
-   **💬 Contextual Account Assistant**: An interactive AI chat specialized in your client data to answer specific questions about relationship history.
-   **📊 Financial Integration**: Real-time tracking of invoices and payment status, directly impacting relationship health metrics.

## 🏗️ System Architecture

Relavo is built with a distributed architecture focused on performance and scalability:

-   **Frontend**: A high-fidelity React dashboard optimized for speed and density.
-   **Backend**: Node.js REST API managing business logic and Supabase integrations.
-   **AI Service**: High-performance Python/FastAPI microservice handling LLM orchestration and heavy computations.

## 🛠️ Tech Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | React, Vite, Tailwind CSS, Zustand |
| **Backend** | Node.js, Express, Supabase Client |
| **AI Service** | Python, FastAPI, Groq SDK, OpenRouter |
| **Database** | Supabase (PostgreSQL + Auth) |
| **Icons & UI** | Lucide React, Framer Motion |

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Python (3.10+)
- Supabase Account

### Installation

1.  **Clone and Install Dependencies**
    ```bash
    git clone https://github.com/your-repo/relavo.git
    cd relavo

    # Install Frontend
    cd frontend && npm install

    # Install Backend
    cd ../backend && npm install

    # Install AI Service
    cd ../ai-service && pip install -r requirements.txt
    ```

2.  **Environment Setup**
    Copy `.env.example` to `.env` in `frontend`, `backend`, and `ai-service` directories and fill in your keys (Supabase, Groq, etc.).

3.  **Run Development Servers**
    ```bash
    # Root directory (if using a launcher) or individually:
    # Frontend: npm run dev
    # Backend: npm start
    # AI Service: uvicorn src.main:app --reload
    ```

## 📂 Project Structure

```text
relavo/
├── frontend/         # React + Vite dashboard
├── backend/          # Node.js REST API
├── ai-service/       # Python AI microservice (Scoring & LLMs)
├── mobile/           # React Native / Expo application (Phase 2)
├── docs/             # Technical documentation & Design system
└── infrastructure/   # Docker & CI/CD configurations
```

---

<p align="center">
  Built with ❤️ by the Relavo Team
</p>
