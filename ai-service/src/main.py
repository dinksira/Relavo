from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict

from .services.scoring import calculate_health_score
from .services.claude import claude_service

app = FastAPI(title="Relavo AI Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class ClientData(BaseModel):
    client_name: str
    days_since_contact: int
    overdue_invoices_count: int
    response_time_trend: float
    activity_ratio: float

class EmailRequest(BaseModel):
    client_name: str
    context: str
    tone: Optional[str] = "Professional"

@app.get("/health")
def health():
    return {"status": "ok", "service": "relavo-ai"}

@app.post("/score")
async def score_client(data: ClientData):
    """Calculate AI health score for a client"""
    try:
        input_data = data.model_dump()
        result = calculate_health_score(input_data)
        return {**result, "client_name": data.client_name}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/summarize")
async def summarize_client(data: ClientData):
    """Generate AI summary of client relationship using Claude API"""
    try:
        input_data = data.model_dump()
        score_result = calculate_health_score(input_data)
        
        # Merge input data for context
        full_context = {**input_data, **score_result}
        
        insight = await claude_service.generate_insight(data.client_name, full_context)
        return {
            "client_name": data.client_name,
            "score": score_result["score"],
            "risk_level": score_result["risk_level"],
            "ai_insight": insight
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/suggest")
async def suggest_action(request: EmailRequest):
    """Suggest next best action and draft re-engagement email"""
    try:
        draft = await claude_service.draft_reengagement_email(
            request.client_name, 
            request.context, 
            request.tone
        )
        return draft
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
