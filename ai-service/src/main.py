from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

from src.services.scorer import calculate_score
from src.services.summarizer import generate_insight
from src.services.drafter import draft_email
from groq import Groq
import os
import json

client = Groq(api_key=os.getenv("GROQ_API_KEY"))
MODEL = "llama-3.3-70b-versatile"

app = FastAPI(title="Relavo AI Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class ScoreRequest(BaseModel):
    days_since_contact: int
    overdue_invoices: int = 0
    total_invoices: int = 0
    touchpoint_count: int = 0
    last_outcome: Optional[str] = "none"
    response_trend: Optional[str] = "unknown"

class InsightRequest(BaseModel):
    client_name: str
    days_since_contact: int
    overdue_invoices: int = 0
    score: int
    risk_level: str
    recent_notes: Optional[List[str]] = []
    last_contact_type: Optional[str] = "none"

class EmailRequest(BaseModel):
    client_name: str
    contact_name: str
    risk_reason: str
    days_since_contact: int
    overdue_invoices: int = 0
    score: int
    tone: Optional[str] = "professional"
    recent_notes: Optional[List[str]] = []

class AnalyzeRequest(BaseModel):
    client_name: str
    days_since_contact: int
    overdue_invoices: int = 0
    total_invoices: int = 0
    touchpoint_count: int = 0
    last_outcome: Optional[str] = "none"
    last_contact_type: Optional[str] = "none"
    recent_notes: Optional[List[str]] = []
    response_trend: Optional[str] = "unknown"

class ChatRequest(BaseModel):
    client_name: str
    message: str
    conversation_history: List[dict] = []
    client_context: dict = {}

class BriefingRequest(BaseModel):
    client_name: str
    created_at: str
    days_since_contact: int
    total_touchpoints: int
    overdue_invoices: int
    total_invoices: int
    score: int
    risk_level: str
    recent_notes: List[str] = []
    last_contact_type: str = "none"
    score_history: List[dict] = []
    monthly_value: Optional[float] = None
    all_touchpoints_summary: Optional[str] = None

@app.get("/health")
def health_check():
    print("Health check requested")
    return {
        "status": "ok", 
        "service": "relavo-ai", 
        "model": "llama-3.3-70b-versatile"
    }

@app.post("/analyze-client")
def analyze_client(req: AnalyzeRequest):
    print(f"--- AI ANALYZE: {req.client_name} ---")
    try:
        score_data = {
            "days_since_contact": req.days_since_contact,
            "overdue_invoices": req.overdue_invoices,
            "total_invoices": req.total_invoices,
            "touchpoint_count": req.touchpoint_count,
            "last_outcome": req.last_outcome,
            "response_trend": req.response_trend
        }
        score_result = calculate_score(score_data)
        
        insight_data = {
            "client_name": req.client_name,
            "days_since_contact": req.days_since_contact,
            "overdue_invoices": req.overdue_invoices,
            "score": score_result["score"],
            "risk_level": score_result["risk_level"],
            "recent_notes": req.recent_notes,
            "last_contact_type": req.last_contact_type
        }
        
        insight_text = generate_insight(insight_data)
        
        return {
            "score": score_result["score"],
            "risk_level": score_result["risk_level"],
            "factors": score_result["factors"],
            "insight": insight_text,
            "calculated_at": datetime.utcnow().isoformat()
        }
    except Exception as e:
        print(f"!!! Error in analyze_client: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat")
async def chat(req: ChatRequest):
    print(f"--- AI CHAT: {req.client_name} ---")
    try:
        client_context = req.client_context
        system_prompt = f"""
You are an AI assistant for Relavo, a client relationship health platform. You are helping an account manager understand and manage their relationship with a specific client.

CLIENT CONTEXT:
Name: {client_context.get('name', 'Unknown')}
Health Score: {client_context.get('score', 'N/A')}/100
Risk Level: {client_context.get('risk_level', 'unknown')}
Days Since Last Contact: {client_context.get('days_since_contact', 'N/A')}
Overdue Invoices: {client_context.get('overdue_invoices', 0)}
Total Touchpoints: {client_context.get('touchpoint_count', 0)}
Recent Notes: {client_context.get('recent_notes', [])}
Last Contact Type: {client_context.get('last_contact_type', 'none')}
Client Since: {client_context.get('created_at', 'unknown')}

YOUR ROLE:
- Answer questions about this specific client
- Give honest, direct assessments
- Base all answers on the client data above
- Be conversational but professional
- Keep responses under 150 words unless detail is needed
- Never make up data not provided in the context
- If asked something you don't have data for, say so honestly
- Focus on actionable insights the account manager can use today
"""
        messages = [{"role": "system", "content": system_prompt}]
        
        for msg in req.conversation_history[-10:]:
            messages.append({"role": msg["role"], "content": msg["content"]})
        
        messages.append({"role": "user", "content": req.message})
        
        response = client.chat.completions.create(
            model=MODEL,
            messages=messages,
            max_tokens=400,
            temperature=0.7
        )
        
        return {
            "response": response.choices[0].message.content,
            "role": "assistant"
        }
    except Exception as e:
        print(f"!!! Error in chat: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/briefing")
async def get_briefing(req: BriefingRequest):
    print(f"--- AI BRIEFING: {req.client_name} ---")
    try:
        score_trend = "stable"
        if req.score_history and len(req.score_history) >= 2:
            last = req.score_history[0].get('score', 0)
            prev = req.score_history[1].get('score', 0)
            if last > prev + 5: score_trend = "improving"
            elif last < prev - 5: score_trend = "declining"

        prompt = f"""
You are analyzing a client relationship for an agency account manager. Generate a detailed 3-part briefing.

CLIENT DATA:
Name: {req.client_name}
Client since: {req.created_at}
Current health score: {req.score}/100
Risk level: {req.risk_level}
Days since last contact: {req.days_since_contact}
Total interactions logged: {req.total_touchpoints}
Overdue invoices: {req.overdue_invoices}
Monthly value: ${req.monthly_value or 'unknown'}
Recent notes: {req.recent_notes}
Score history trend: {score_trend}

Generate exactly this JSON structure, nothing else:
{{
  "past": "2-3 sentence paragraph about the relationship history, interaction trends, and any notable past issues. Be specific with numbers.",
  "present": "2-3 sentence paragraph about exactly where things stand today. Name the most urgent issue clearly.",
  "future": "2-3 sentence paragraph predicting what happens next. State churn probability clearly as HIGH, MEDIUM, or LOW. Give one specific action to take."
}}

Return ONLY the JSON. No other text.
"""
        response = client.chat.completions.create(
            model=MODEL,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=600,
            temperature=0.3
        )
        
        content = response.choices[0].message.content.strip()
        # Handle cases where LLM might wrap in ```json ... ```
        if content.startswith("```"):
            content = content.replace("```json", "").replace("```", "").strip()
            
        briefing = json.loads(content)
        briefing["generated_at"] = datetime.utcnow().isoformat()
        return briefing
    except Exception as e:
        print(f"!!! Error in briefing: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/draft-email")
def get_draft(req: EmailRequest):
    print(f"--- AI DRAFT: {req.client_name} ---")
    try:
        return draft_email(req.dict())
    except Exception as e:
        print(f"!!! Error in get_draft: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
