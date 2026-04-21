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
        from groq import Groq
        groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        
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

        messages = [{"role": "system", "content": system_message_content}]
        
        # Add history (last 10)
        history_list = req.conversation_history or []
        history = history_list[-10:]
        for msg in history:
            messages.append({"role": msg.role, "content": msg.content})
            
        # Add current message
        messages.append({"role": "user", "content": req.message})
        
        response = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            max_tokens=300,
            temperature=0.7
        )
        
        return {
            "response": response.choices[0].message.content,
            "role": "assistant"
        }
    except Exception as e:
        print(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/interpret")
def interpret_command(req: InterpretRequest):
    try:
        from groq import Groq
        import json
        groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        
        clients_str = "\n".join([f"- {c['name']} (ID: {c['id']})" for c in req.context_clients[:20]])
        
        system_prompt = f"""You are the Relavo Command Interpreter.
Analyze the user's natural language query and map it to a specific system action.

AVAILABLE CLIENTS:
{clients_str}

AVAILABLE ACTIONS:
- navigate_to: "dashboard", "clients", "alerts", "settings", "invoices"
- open_client: needs client_id
- draft_email: needs client_id
- get_briefing: needs client_id
- log_touchpoint: needs client_id
- search: generic fallback

RULES:
- Return ONLY valid JSON.
- If a client is mentioned, find the closest ID from the list.
- If no specific action matches, use "search".
- Keep "params" specific to the action requirement."""

        user_prompt = f"Query: \"{req.query}\""
        
        response = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            response_format={"type": "json_object"},
            temperature=0.1
        )
        
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        print(f"Interpret error: {e}")
        return {"action": "search", "params": {"query": req.query}}
