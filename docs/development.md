# Relavo — Technical Overview
### The complete onboarding document for every developer joining this project.
### Read this first. Read it fully. Everything you need to understand the system is here.

---

## 1. What Is Relavo?

Relavo is an AI-powered client relationship health platform for small businesses,
agencies, and startups. It solves one specific problem: businesses lose clients
silently because there is no early warning system. By the time they notice a client
drifting, it is already too late.

Relavo watches every client signal — last contact date, invoice status, response
time, project activity — and uses AI to score each client from 0 to 100, explain
in plain English why a client is at risk, and suggest the exact next action to take.

**The core loop in one sentence:** Data comes in → AI scores it → Dashboard shows
who needs attention → User takes action → Client is saved.

---

## 2. The Full System At a Glance

```
╔══════════════════════════════════════════════════════════════════════╗
║                        RELAVO SYSTEM MAP                             ║
╠══════════════════════════════════════════════════════════════════════╣
║                                                                      ║
║   ┌─────────────────────┐      ┌──────────────────────┐             ║
║   │   React Dashboard   │      │  React Native App    │             ║
║   │   (Web Browser)     │      │  (iOS + Android)     │             ║
║   │   Vercel · port 3000│      │  Expo · Phase 2      │             ║
║   └──────────┬──────────┘      └──────────┬───────────┘             ║
║              │                            │                          ║
║              │         HTTPS              │                          ║
║              └────────────┬───────────────┘                         ║
║                           ▼                                          ║
║              ┌────────────────────────────┐                         ║
║              │     Node.js + Express      │                         ║
║              │       Backend API          │                         ║
║              │    Railway · port 3001     │                         ║
║              │                            │                         ║
║              │  /api/auth                 │                         ║
║              │  /api/clients              │                         ║
║              │  /api/alerts               │                         ║
║              │  /api/ai                   │                         ║
║              └──────┬──────────┬──────────┘                         ║
║                     │          │                                     ║
║            ┌────────┘          └──────────────┐                     ║
║            ▼                                  ▼                     ║
║   ┌─────────────────┐             ┌───────────────────────┐         ║
║   │    Supabase     │             │  Python AI Service    │         ║
║   │   PostgreSQL    │             │  FastAPI · port 8000  │         ║
║   │   + Auth        │             │  Railway              │         ║
║   │   + Realtime    │             │                       │         ║
║   └─────────────────┘             │  POST /score          │         ║
║                                   │  POST /summarize      │         ║
║                                   │  POST /draft-email    │         ║
║                                   └──────────┬────────────┘         ║
║                                              │                      ║
║                                              ▼                      ║
║                                   ┌──────────────────────┐          ║
║                                   │   Anthropic Claude   │          ║
║                                   │   claude-sonnet API  │          ║
║                                   └──────────────────────┘          ║
╚══════════════════════════════════════════════════════════════════════╝
```

**Golden rule:** The React frontend NEVER talks to Supabase directly for
data, and NEVER calls the AI service directly. Everything goes through
the Node.js backend. This keeps all secrets and business logic server-side.

The only exception: Supabase Auth tokens are obtained client-side via the
Supabase JS SDK, then sent to the backend on every request as a Bearer token.

---




# Relavo — Full Technical Development Documentation

> This document is the complete technical guide for implementing Relavo's
> frontend, backend, and mobile app. Every developer on the project should
> read this before writing a single line of code.

---

## Table of Contents

1. [System Architecture Overview](#1-system-architecture-overview)
2. [Development Environment Setup](#2-development-environment-setup)
3. [Database — Supabase Setup](#3-database--supabase-setup)
4. [Backend — Node.js API](#4-backend--nodejs-api)
5. [AI Service — Python FastAPI](#5-ai-service--python-fastapi)
6. [Frontend — React Dashboard](#6-frontend--react-dashboard)
7. [Mobile App — React Native](#7-mobile-app--react-native)
8. [Authentication Flow](#8-authentication-flow)
9. [Data Flow — End to End](#9-data-flow--end-to-end)
10. [Deployment Guide](#10-deployment-guide)

---

## 1. System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│                                                              │
│   React Dashboard (Vercel)    React Native App (Expo)        │
│         port 3000                    mobile                  │
└──────────────────┬──────────────────────┬───────────────────┘
                   │  HTTPS REST calls    │
                   ▼                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND API LAYER                         │
│                                                              │
│              Node.js + Express (Railway)                     │
│                     port 3001                                │
│                                                              │
│   /api/auth   /api/clients   /api/alerts   /api/ai           │
└──────┬──────────────┬──────────────────────┬────────────────┘
       │              │                      │
       ▼              ▼                      ▼
┌──────────┐  ┌──────────────┐    ┌─────────────────────┐
│ Supabase │  │ Supabase DB  │    │  Python AI Service  │
│   Auth   │  │  PostgreSQL  │    │  FastAPI (Railway)  │
│          │  │              │    │     port 8000       │
└──────────┘  └──────────────┘    └──────────┬──────────┘
                                             │
                                             ▼
                                    ┌─────────────────┐
                                    │  Claude API     │
                                    │  (Anthropic)    │
                                    └─────────────────┘
```

### How the services talk to each other

The React frontend never calls the AI service or database directly. All
requests go through the Node.js backend, which acts as the single gateway.
The backend calls Supabase for data and calls the Python AI service for
anything that needs Claude. This keeps the API key and business logic
server-side and never exposed to the browser.

---

## 2. Development Environment Setup

### Prerequisites

Make sure these are installed before starting:

- Node.js 20+ (`node --version`)
- Python 3.11+ (`python --version`)
- Git (`git --version`)
- A Supabase account (free at supabase.com)
- An Anthropic API key (console.anthropic.com)

### Clone and install

```bash
git clone https://github.com/yourusername/relavo.git
cd relavo
```

Install all three services:

```bash
# Backend
cd backend && npm install && cd ..

# Frontend
cd frontend && npm install && cd ..

# AI Service
cd ai-service && pip install -r requirements.txt && cd ..
```

### Environment files

Copy the example env files and fill in your keys:

```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
cp ai-service/.env.example ai-service/.env
```

Fill in `backend/.env`:

```
PORT=3001
SUPABASE_URL=https://yourproject.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key
JWT_SECRET=any_long_random_string
AI_SERVICE_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000
```

Fill in `frontend/.env`:

```
VITE_API_URL=http://localhost:3001
VITE_SUPABASE_URL=https://yourproject.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

Fill in `ai-service/.env`:

```
ANTHROPIC_API_KEY=sk-ant-your-key-here
PORT=8000
```

### Running all services locally

Open three terminal tabs and run each service:

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — AI Service
cd ai-service && uvicorn src.main:app --reload --port 8000

# Terminal 3 — Frontend
cd frontend && npm run dev
```

Frontend is now at `http://localhost:3000`, backend at `http://localhost:3001`,
AI service at `http://localhost:8000`.

---

## 3. Database — Supabase Setup

### Why Supabase

Supabase gives us a managed PostgreSQL database, built-in authentication,
real-time subscriptions, and a REST API out of the box. No need to manage
a database server.

### Creating the schema

Go to your Supabase project → SQL Editor → paste and run this:

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- CLIENTS table
create table clients (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  contact_name text,
  email text,
  phone text,
  status text check (status in ('active','paused','churned')) default 'active',
  notes text,
  created_at timestamptz default now()
);

-- HEALTH SCORES table (one row per calculation, history preserved)
create table health_scores (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid references clients(id) on delete cascade not null,
  score integer check (score >= 0 and score <= 100) not null,
  risk_level text check (risk_level in ('healthy','needs_attention','at_risk')) not null,
  factors jsonb,
  ai_insight text,
  calculated_at timestamptz default now()
);

-- TOUCHPOINTS table
create table touchpoints (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid references clients(id) on delete cascade not null,
  type text check (type in ('call','email','meeting','message')) not null,
  notes text,
  outcome text check (outcome in ('positive','neutral','negative')),
  logged_at timestamptz default now(),
  created_at timestamptz default now()
);

-- INVOICES table
create table invoices (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid references clients(id) on delete cascade not null,
  amount numeric(10,2) not null,
  status text check (status in ('pending','paid','overdue')) default 'pending',
  due_date date,
  paid_date date,
  created_at timestamptz default now()
);

-- ALERTS table
create table alerts (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid references clients(id) on delete cascade not null,
  type text check (type in ('no_contact','overdue_invoice','score_drop','sentiment')) not null,
  severity text check (severity in ('low','medium','high')) not null,
  message text not null,
  ai_suggestion text,
  read boolean default false,
  created_at timestamptz default now()
);

-- Row Level Security (RLS) — users can only see their own data
alter table clients enable row level security;
alter table health_scores enable row level security;
alter table touchpoints enable row level security;
alter table invoices enable row level security;
alter table alerts enable row level security;

create policy "Users see own clients" on clients
  for all using (auth.uid() = user_id);

create policy "Users see own health scores" on health_scores
  for all using (
    client_id in (select id from clients where user_id = auth.uid())
  );

create policy "Users see own touchpoints" on touchpoints
  for all using (
    client_id in (select id from clients where user_id = auth.uid())
  );

create policy "Users see own invoices" on invoices
  for all using (
    client_id in (select id from clients where user_id = auth.uid())
  );

create policy "Users see own alerts" on alerts
  for all using (
    client_id in (select id from clients where user_id = auth.uid())
  );
```

### Key concepts

Row Level Security (RLS) means even if someone gets hold of the anon key,
they can only ever read their own rows. The `auth.uid()` function returns
the ID of the currently authenticated user for every query.

The `health_scores` table stores every calculation as a new row — never
updates. This gives us a full history of how each client's score changed
over time, which we use for trend charts.

---

## 4. Backend — Node.js API

### Folder structure

```
backend/src/
├── index.js          Entry point — starts the server
├── app.js            Express app setup — middleware, routes
├── config/
│   └── supabase.js   Supabase client singleton
├── middleware/
│   └── auth.js       JWT verification middleware
├── routes/
│   ├── auth.routes.js
│   ├── clients.routes.js
│   ├── alerts.routes.js
│   └── ai.routes.js
├── controllers/
│   ├── auth.controller.js
│   ├── clients.controller.js
│   ├── alerts.controller.js
│   └── ai.controller.js
├── services/
│   ├── clients.service.js    Business logic for clients
│   ├── health.service.js     Score calculation logic
│   ├── alerts.service.js     Alert generation logic
│   └── ai.service.js         Calls the Python AI service
└── utils/
    └── response.js           Standard API response helpers
```

### How the layers work

Every request flows through exactly these layers in order:

```
HTTP Request
  → Route (defines the URL and method)
    → Middleware (checks JWT auth)
      → Controller (reads req, calls service, sends res)
        → Service (business logic, calls DB or AI)
          → Database / AI Service
```

Never put database queries in controllers. Never put business logic in
routes. This separation keeps every file small and testable.

### Setting up the Supabase client

`backend/src/config/supabase.js`:

```javascript
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY  // service key, not anon — backend has full access
);

module.exports = supabase;
```

### Auth middleware

`backend/src/middleware/auth.js`:

```javascript
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

module.exports = async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return res.status(401).json({ error: 'Invalid token' });

  req.user = user;  // attach user to request for use in controllers
  next();
};
```

Every protected route gets this middleware applied. The user ID is then
available as `req.user.id` in all controllers.

### Clients controller — full CRUD example

`backend/src/controllers/clients.controller.js`:

```javascript
const clientsService = require('../services/clients.service');

// GET /api/clients
exports.getAll = async (req, res) => {
  try {
    const clients = await clientsService.getAllByUser(req.user.id);
    res.json({ data: clients });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/clients
exports.create = async (req, res) => {
  try {
    const client = await clientsService.create(req.user.id, req.body);
    res.status(201).json({ data: client });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET /api/clients/:id/health
exports.getHealth = async (req, res) => {
  try {
    const health = await clientsService.getLatestHealth(req.params.id);
    res.json({ data: health });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
```

### Health score service

`backend/src/services/health.service.js`:

```javascript
const supabase = require('../config/supabase');
const aiService = require('./ai.service');

exports.calculateScore = async (clientId) => {
  // Fetch all data needed for scoring
  const [touchpoints, invoices] = await Promise.all([
    supabase.from('touchpoints')
      .select('*').eq('client_id', clientId)
      .order('logged_at', { ascending: false }).limit(10),
    supabase.from('invoices')
      .select('*').eq('client_id', clientId)
  ]);

  const lastContact = touchpoints.data?.[0]?.logged_at;
  const daysSinceContact = lastContact
    ? Math.floor((Date.now() - new Date(lastContact)) / 86400000)
    : 999;

  const overdueInvoices = invoices.data?.filter(i => i.status === 'overdue') || [];

  // Weighted scoring formula
  const contactScore   = Math.max(0, 100 - (daysSinceContact * 10));  // -10 per day
  const invoiceScore   = overdueInvoices.length === 0 ? 100 : Math.max(0, 100 - (overdueInvoices.length * 40));
  const activityScore  = touchpoints.data?.length > 0 ? 80 : 20;

  const finalScore = Math.round(
    (contactScore  * 0.30) +
    (invoiceScore  * 0.25) +
    (activityScore * 0.25) +
    (70            * 0.20)  // default activity weight
  );

  const riskLevel = finalScore >= 70 ? 'healthy'
    : finalScore >= 40 ? 'needs_attention'
    : 'at_risk';

  // Get AI insight from Python service
  const aiInsight = await aiService.getInsight({
    clientId,
    daysSinceContact,
    overdueInvoices: overdueInvoices.length,
    score: finalScore,
    riskLevel,
    recentNotes: touchpoints.data?.slice(0, 3).map(t => t.notes)
  });

  // Save to DB
  const { data } = await supabase.from('health_scores').insert({
    client_id: clientId,
    score: finalScore,
    risk_level: riskLevel,
    factors: { contactScore, invoiceScore, activityScore, daysSinceContact },
    ai_insight: aiInsight
  }).select().single();

  return data;
};
```

### AI service caller

`backend/src/services/ai.service.js`:

```javascript
const axios = require('axios');

const AI_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

exports.getInsight = async (clientData) => {
  const { data } = await axios.post(`${AI_URL}/summarize`, clientData);
  return data.insight;
};

exports.draftEmail = async (payload) => {
  const { data } = await axios.post(`${AI_URL}/draft-email`, payload);
  return data.email;
};

exports.scoreClient = async (payload) => {
  const { data } = await axios.post(`${AI_URL}/score`, payload);
  return data;
};
```

### API routes summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | No | Create account |
| POST | /api/auth/login | No | Login, returns JWT |
| GET | /api/clients | Yes | List all clients |
| POST | /api/clients | Yes | Create client |
| GET | /api/clients/:id | Yes | Get client detail |
| PUT | /api/clients/:id | Yes | Update client |
| DELETE | /api/clients/:id | Yes | Delete client |
| GET | /api/clients/:id/health | Yes | Latest health score |
| POST | /api/clients/:id/touchpoints | Yes | Log touchpoint |
| POST | /api/clients/:id/invoices | Yes | Add invoice |
| GET | /api/alerts | Yes | All alerts |
| PUT | /api/alerts/:id/read | Yes | Mark read |
| POST | /api/ai/draft-email | Yes | Draft re-engagement email |
| POST | /api/ai/summarize | Yes | Get AI client summary |

---

## 5. AI Service — Python FastAPI

### Why a separate Python service

Python has the best AI/ML ecosystem. By separating it into its own
microservice, the Node.js backend stays lean and the AI logic can be
developed, tested, and scaled independently. The two services communicate
over HTTP.

### Folder structure

```
ai-service/src/
├── main.py           FastAPI app + all routes
├── services/
│   ├── scorer.py     Health score calculation logic
│   ├── summarizer.py Claude API — generates client insights
│   └── drafter.py    Claude API — drafts re-engagement emails
└── utils/
    └── claude.py     Anthropic client singleton
```

### Anthropic client setup

`ai-service/src/utils/claude.py`:

```python
import anthropic
import os

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
MODEL = "claude-sonnet-4-5"
```

### Client insight summarizer

`ai-service/src/services/summarizer.py`:

```python
from utils.claude import client, MODEL

def generate_insight(data: dict) -> str:
    days = data.get("daysSinceContact", 0)
    overdue = data.get("overdueInvoices", 0)
    score = data.get("score", 50)
    risk = data.get("riskLevel", "needs_attention")
    notes = data.get("recentNotes", [])
    notes_text = " | ".join([n for n in notes if n]) or "No recent notes."

    prompt = f"""You are an AI assistant for Relavo, a client relationship platform.

Analyze this client data and write a 2-3 sentence plain-English insight 
explaining why the client has their current health score, and recommend 
one specific action the account manager should take.

Client data:
- Health score: {score}/100
- Risk level: {risk}
- Days since last contact: {days}
- Overdue invoices: {overdue}
- Recent touchpoint notes: {notes_text}

Rules:
- Be direct and specific, not generic
- Name the exact problem (e.g. "9 days without contact" not "low engagement")
- End with one clear action recommendation
- Maximum 3 sentences
- Never say "I recommend" — just state the action directly
- Tone: professional, calm, never alarmist"""

    message = client.messages.create(
        model=MODEL,
        max_tokens=200,
        messages=[{"role": "user", "content": prompt}]
    )

    return message.content[0].text
```

### Email drafter

`ai-service/src/services/drafter.py`:

```python
from utils.claude import client, MODEL

def draft_email(data: dict) -> dict:
    client_name = data.get("clientName")
    contact_name = data.get("contactName")
    risk_reason = data.get("riskReason")
    last_contact = data.get("daysSinceContact")
    tone = data.get("tone", "professional")  # warm | professional | direct

    prompt = f"""Write a re-engagement email from an account manager to a client.

Context:
- Client company: {client_name}
- Contact name: {contact_name}
- Days since last contact: {last_contact}
- Reason they need attention: {risk_reason}
- Tone: {tone}

Return a JSON object with exactly these two fields:
- "subject": the email subject line (max 10 words)
- "body": the full email body (3-4 short paragraphs, no placeholders)

The email must feel personal and human, not like a template.
Do not include a salutation line — start with the first paragraph.
Return only the JSON object, no other text."""

    message = client.messages.create(
        model=MODEL,
        max_tokens=500,
        messages=[{"role": "user", "content": prompt}]
    )

    import json
    return json.loads(message.content[0].text)
```

### Main FastAPI app

`ai-service/src/main.py`:

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from services.summarizer import generate_insight
from services.drafter import draft_email
import os

app = FastAPI(title="Relavo AI Service")

class InsightRequest(BaseModel):
    clientId: str
    daysSinceContact: int
    overdueInvoices: int
    score: int
    riskLevel: str
    recentNotes: Optional[List[str]] = []

class EmailRequest(BaseModel):
    clientName: str
    contactName: str
    riskReason: str
    daysSinceContact: int
    tone: Optional[str] = "professional"

@app.get("/health")
def health():
    return {"status": "ok", "service": "relavo-ai"}

@app.post("/summarize")
async def summarize(req: InsightRequest):
    try:
        insight = generate_insight(req.dict())
        return {"insight": insight}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/draft-email")
async def draft(req: EmailRequest):
    try:
        email = draft_email(req.dict())
        return email
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

---

## 6. Frontend — React Dashboard

### Folder structure

```
frontend/src/
├── main.jsx              React entry point
├── App.jsx               Router setup
├── assets/
│   └── logo.svg          Relavo logo
├── components/
│   ├── ui/               Reusable primitives (Button, Badge, Card, Input)
│   ├── dashboard/        Dashboard-specific components
│   ├── clients/          Client list and detail components
│   ├── alerts/           Alert components
│   └── auth/             Login and register forms
├── pages/
│   ├── LoginPage.jsx
│   ├── DashboardPage.jsx
│   ├── ClientDetailPage.jsx
│   └── AlertsPage.jsx
├── hooks/
│   ├── useClients.js     Data fetching hook for clients
│   ├── useAlerts.js      Data fetching hook for alerts
│   └── useAuth.js        Auth state hook
├── services/
│   └── api.js            Axios instance + all API calls
├── store/
│   └── authStore.js      Zustand store for auth state
└── utils/
    └── scoreHelpers.js   Score → color, label helpers
```

### Axios API service

`frontend/src/services/api.js`:

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Attach JWT to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('relavo_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Client endpoints
export const clientsAPI = {
  getAll:       ()       => api.get('/api/clients'),
  getById:      (id)     => api.get(`/api/clients/${id}`),
  create:       (data)   => api.post('/api/clients', data),
  update:       (id, d)  => api.put(`/api/clients/${id}`, d),
  delete:       (id)     => api.delete(`/api/clients/${id}`),
  getHealth:    (id)     => api.get(`/api/clients/${id}/health`),
  logTouchpoint:(id, d)  => api.post(`/api/clients/${id}/touchpoints`, d),
};

// Alert endpoints
export const alertsAPI = {
  getAll:    ()   => api.get('/api/alerts'),
  markRead:  (id) => api.put(`/api/alerts/${id}/read`),
  dismiss:   (id) => api.delete(`/api/alerts/${id}`),
};

// AI endpoints
export const aiAPI = {
  draftEmail: (data) => api.post('/api/ai/draft-email', data),
  summarize:  (data) => api.post('/api/ai/summarize', data),
};

export default api;
```

### Zustand auth store

`frontend/src/store/authStore.js`:

```javascript
import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('relavo_token'),

  setAuth: (user, token) => {
    localStorage.setItem('relavo_token', token);
    set({ user, token });
  },

  logout: () => {
    localStorage.removeItem('relavo_token');
    set({ user: null, token: null });
  },
}));

export default useAuthStore;
```

### Custom data hook example

`frontend/src/hooks/useClients.js`:

```javascript
import { useState, useEffect } from 'react';
import { clientsAPI } from '../services/api';

export const useClients = () => {
  const [clients, setClients]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    clientsAPI.getAll()
      .then(res => setClients(res.data.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { clients, loading, error, setClients };
};
```

### Score helper utilities

`frontend/src/utils/scoreHelpers.js`:

```javascript
export const getRiskLevel = (score) => {
  if (score >= 70) return 'healthy';
  if (score >= 40) return 'needs_attention';
  return 'at_risk';
};

export const getRiskColor = (score) => {
  if (score >= 70) return { bg: '#dcfce7', text: '#16a34a' };
  if (score >= 40) return { bg: '#fef9c3', text: '#d97706' };
  return { bg: '#fee2e2', text: '#dc2626' };
};

export const getRiskLabel = (score) => {
  if (score >= 70) return 'Healthy';
  if (score >= 40) return 'Needs Attention';
  return 'At Risk';
};

export const getScoreBarColor = (score) => {
  if (score >= 70) return '#16a34a';
  if (score >= 40) return '#d97706';
  return '#dc2626';
};
```

### Router setup

`frontend/src/App.jsx`:

```jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ClientDetailPage from './pages/ClientDetailPage';
import AlertsPage from './pages/AlertsPage';

const ProtectedRoute = ({ children }) => {
  const token = useAuthStore(s => s.token);
  return token ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={
          <ProtectedRoute><DashboardPage /></ProtectedRoute>
        }/>
        <Route path="/clients/:id" element={
          <ProtectedRoute><ClientDetailPage /></ProtectedRoute>
        }/>
        <Route path="/alerts" element={
          <ProtectedRoute><AlertsPage /></ProtectedRoute>
        }/>
      </Routes>
    </BrowserRouter>
  );
}
```

### Tailwind config with brand colors

`frontend/tailwind.config.js`:

```javascript
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        relavo: {
          navy:      '#1b2a3b',
          blue:      '#3b82f6',
          blueDark:  '#2563eb',
          blueLight: '#eff6ff',
          surface:   '#f8fafc',
          border:    '#e2e8f0',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    }
  }
}
```

---

## 7. Mobile App — React Native

> Phase 2 — built after the web MVP ships and gets real user feedback.

### Why React Native + Expo

React Native lets us ship on iOS and Android from one codebase.
Expo removes the need to deal with Xcode and Android Studio for
development. We already have the API and business logic — the mobile
app is purely a new UI layer on top of the same backend.

### Folder structure

```
mobile/src/
├── screens/
│   ├── LoginScreen.jsx
│   ├── DashboardScreen.jsx
│   ├── ClientDetailScreen.jsx
│   └── AlertsScreen.jsx
├── components/
│   ├── ClientCard.jsx
│   ├── HealthGauge.jsx
│   ├── AlertItem.jsx
│   └── TouchpointLogger.jsx
├── navigation/
│   └── AppNavigator.jsx     React Navigation setup
├── services/
│   └── api.js               Same API calls as web, adapted for React Native
├── hooks/
│   └── useClients.js        Same hook pattern as web
└── assets/
    └── logo.png
```

### Navigation setup

`mobile/src/navigation/AppNavigator.jsx`:

```jsx
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from '../screens/DashboardScreen';
import AlertsScreen from '../screens/AlertsScreen';
import ClientDetailScreen from '../screens/ClientDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function DashboardStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="ClientDetail" component={ClientDetailScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home"   component={DashboardStack} />
        <Tab.Screen name="Alerts" component={AlertsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
```

### API service for React Native

`mobile/src/services/api.js`:

The mobile API service is identical to the web version, with one
difference — use `AsyncStorage` instead of `localStorage`:

```javascript
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'https://your-railway-backend.up.railway.app',
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('relavo_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
```

### Push notifications

Use Expo Notifications to alert users when a client goes At Risk:

```javascript
import * as Notifications from 'expo-notifications';

export const schedulePushNotification = async (clientName, message) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `Relavo — ${clientName} needs attention`,
      body: message,
    },
    trigger: null, // immediate
  });
};
```

The backend sends a push token to Expo's push API whenever a new
high-severity alert is generated for a user.

### Mobile packages to install

```bash
cd mobile
npx expo install @react-navigation/native @react-navigation/bottom-tabs
npx expo install @react-navigation/native-stack
npx expo install @react-native-async-storage/async-storage
npx expo install expo-notifications
npx expo install react-native-svg
```

---

## 8. Authentication Flow

The complete auth flow across all three services:

```
1. User submits email + password on Login page
         │
         ▼
2. Frontend calls POST /api/auth/login (backend)
         │
         ▼
3. Backend calls supabase.auth.signInWithPassword()
         │
         ▼
4. Supabase returns { user, session: { access_token } }
         │
         ▼
5. Backend returns { token: access_token, user }
         │
         ▼
6. Frontend stores token in localStorage via Zustand
         │
         ▼
7. All subsequent API calls include:
   Authorization: Bearer <token>
         │
         ▼
8. Auth middleware on backend verifies token with Supabase
         │
         ▼
9. req.user.id is attached and available in controllers
```

---

## 9. Data Flow — End to End

### Example: User views client dashboard

```
1. User opens Dashboard page
2. useClients hook fires → GET /api/clients
3. Backend auth middleware verifies JWT
4. clients.service.getAllByUser(userId) queries Supabase
5. For each client, latest health_score row is joined
6. Response: array of clients with embedded health data
7. Frontend renders client cards with score badges
```

### Example: Health score recalculation (runs every 24h)

```
1. Cron job fires in backend (node-cron, every day at 2am)
2. Fetches all active clients from Supabase
3. For each client, calls health.service.calculateScore(clientId)
4. health.service fetches touchpoints + invoices from Supabase
5. Calculates weighted score (contact 30%, invoice 25%, activity 25%, base 20%)
6. Calls ai.service.getInsight() → HTTP POST to Python AI service
7. Python service builds prompt → sends to Claude API
8. Claude returns 2-3 sentence insight
9. Backend saves new health_scores row to Supabase
10. If score dropped > 15 points, backend creates new alerts row
11. Frontend polls or receives real-time update via Supabase subscription
```

### Example: AI email draft

```
1. User clicks "Draft Email" on at-risk client
2. Frontend calls POST /api/ai/draft-email with client context
3. Backend auth middleware verifies JWT
4. ai.controller calls ai.service.draftEmail()
5. ai.service calls Python service: POST /draft-email
6. Python drafter.py builds prompt with client context + tone
7. Claude API returns JSON { subject, body }
8. Python service returns JSON to Node.js
9. Node.js returns to frontend
10. Frontend populates email modal with subject + body
11. User edits and copies the email
```

---

## 10. Deployment Guide

### Frontend → Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# From frontend/ folder
cd frontend
vercel

# Set environment variables in Vercel dashboard:
# VITE_API_URL = https://your-backend.up.railway.app
# VITE_SUPABASE_URL = https://yourproject.supabase.co
# VITE_SUPABASE_ANON_KEY = your_anon_key
```

Every push to `main` branch auto-deploys. Preview deployments are
created automatically for every pull request.

### Backend + AI Service → Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# From project root
railway init

# Deploy backend
cd backend && railway up

# Deploy AI service as separate service
cd ai-service && railway up
```

In the Railway dashboard, add environment variables for each service.
Railway gives each service a public URL like
`https://relavo-backend.up.railway.app`.

### Environment variables checklist before going live

Backend (Railway):
- `SUPABASE_URL` ✓
- `SUPABASE_SERVICE_KEY` ✓
- `JWT_SECRET` ✓
- `AI_SERVICE_URL` → Railway URL of AI service ✓
- `FRONTEND_URL` → Vercel URL ✓

AI Service (Railway):
- `ANTHROPIC_API_KEY` ✓

Frontend (Vercel):
- `VITE_API_URL` → Railway URL of backend ✓
- `VITE_SUPABASE_URL` ✓
- `VITE_SUPABASE_ANON_KEY` ✓

### CORS configuration

In `backend/src/app.js`, update CORS for production:

```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
```

---

*Last updated: Week 1 of Relavo build. Update this document as the
codebase evolves.*