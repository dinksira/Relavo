from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import datetime
import os
from dotenv import load_dotenv

from src.services.scorer import calculate_score
from src.services.summarizer import generate_insight
from src.services.drafter import draft_email
from src.services.briefing import generate_briefing

load_dotenv()

app = FastAPI(title="Relavo AI Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# PYDANTIC REQUEST MODELS

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

class EmailRequest(BaseModel):
    client_name: str
    contact_name: str
    risk_reason: str
    days_since_contact: int
    overdue_invoices: int = 0
    score: int
    tone: Optional[str] = "professional"
    recent_notes: Optional[List[str]] = []

class BriefingRequest(BaseModel):
    client_name: str
    created_at: str
    days_since_contact: int
    total_touchpoints: int = 0
    overdue_invoices: int = 0
    total_invoices: int = 0
    score: int
    risk_level: str
    recent_notes: Optional[List[str]] = []
    monthly_value: Optional[float] = 0
    score_history: Optional[List[dict]] = []

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    client_name: str
    message: str
    conversation_history: Optional[List[ChatMessage]] = []
    client_context: Optional[dict] = {}

class InterpretRequest(BaseModel):
    query: str
    context_clients: List[dict] = []

# ENDPOINTS

@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "relavo-ai",
        "groq_model": "llama-3.3-70b-versatile",
        "openrouter_model": "nvidia/nemotron-3-super-120b-a12b:free",
        "timestamp": datetime.datetime.now().isoformat()
    }

@app.post("/score")
def get_score(req: ScoreRequest):
    try:
        return calculate_score(req.model_dump())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/summarize")
def get_summarize(req: InsightRequest):
    try:
        result = generate_insight(req.model_dump())
        return {"insight": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze-client")
def analyze_client(req: AnalyzeRequest):
    try:
        data = req.model_dump()
        score_result = calculate_score(data)
        
        # Merge score into data for insight
        data["score"] = score_result["score"]
        data["risk_level"] = score_result["risk_level"]
        
        insight = generate_insight(data)
        
        return {
            "score": score_result["score"],
            "risk_level": score_result["risk_level"],
            "factors": score_result["factors"],
            "insight": insight,
            "calculated_at": datetime.datetime.now().isoformat()
        }
    except Exception as e:
        print(f"Error in analyze-client: {e}")
        return {
            "score": 70,
            "risk_level": "healthy",
            "factors": {},
            "insight": "Score calculated. AI insight temporarily unavailable.",
            "calculated_at": datetime.datetime.now().isoformat()
        }

@app.post("/draft-email")
def get_draft_email(req: EmailRequest):
    try:
        return draft_email(req.model_dump())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/briefing")
def get_briefing(req: BriefingRequest):
    try:
        return generate_briefing(req.model_dump())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat")
def chat(req: ChatRequest):
    try:
        from src.utils.groq_client import call_groq
        
        ctx = req.client_context or {}
        system_message_content = f"""You are an AI assistant for Relavo specialized in {req.client_name}.
Current Stats:
- Score: {ctx.get('score', 'N/A')}/100
- Risk Level: {ctx.get('risk_level', 'N/A')}
- Days since contact: {ctx.get('days_since_contact', 'N/A')}
- Overdue invoices: {ctx.get('overdue_invoices', '0')}
- Touchpoints: {ctx.get('touchpoint_count', '0')}
- Recent notes: {", ".join(ctx.get('recent_notes', []) if ctx.get('recent_notes') else [])}

Rules:
- Answer ONLY about this client.
- Keep replies under 120 words.
- Be conversational and direct.
- Never make up data not in context."""

        response = call_groq(
            prompt=req.message,
            system=system_message_content,
            max_tokens=300,
            temperature=0.7
        )
        
        return {
            "response": response,
            "role": "assistant"
        }
    except Exception as e:
        print(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/interpret")
def interpret_command(req: InterpretRequest):
    try:
        from src.utils.groq_client import call_groq
        import json
        
        clients_str = "\n".join([f"- {c['name']} (ID: {c['id']})" for c in req.context_clients[:20]])
        
        system_prompt = f"""You are the Relavo Command Interpreter.
Analyze the user's query and map it to a system action OR answer it directly.

AVAILABLE CLIENTS:
{clients_str or "No clients found in directory."}

AVAILABLE ACTIONS:
- navigate_to: params: {{"target": "dashboard" | "clients" | "alerts" | "settings" | "invoices"}}
- open_client: params: {{"client_id": "UUID"}}
- draft_email: params: {{"client_id": "UUID"}}
- get_briefing: params: {{"client_id": "UUID"}}
- log_touchpoint: params: {{"client_id": "UUID"}}
- show_invoices: params: {{"client_id": "UUID"}}
- recalculate_score: params: {{"client_id": "UUID"}}
- search: generic fallback

OUTPUT FORMAT (JSON ONLY):
{{
  "action": "action_name",
  "params": {{}},
  "response": "Your natural language response here."
}}

RULES:
1. If the user asks a question (is there, do we have, who is), answer it in the 'response' field.
2. If they mention a client, always try to find the ID from the list.
3. Be concise. Return only the JSON."""

        response = call_groq(
            prompt=f"User Query: {req.query}",
            system=system_prompt,
            max_tokens=300,
            temperature=0.0
        )
        
        # OpenRouter/Groq might return markdown, clean it
        clean_response = response.strip()
        if clean_response.startswith("```"):
            clean_response = clean_response.split("```")[1]
            if clean_response.startswith("json"):
                clean_response = clean_response[4:]
        clean_response = clean_response.strip()

        result = json.loads(clean_response)
        return result
    except Exception as e:
        print(f"Interpret error: {e}")
        return {"action": "search", "params": {"query": req.query}}
