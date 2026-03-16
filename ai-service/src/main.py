from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Relavo AI Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok", "service": "relavo-ai"}

@app.post("/score")
async def score_client(data: dict):
    """Calculate AI health score for a client"""
    pass

@app.post("/summarize")
async def summarize_client(data: dict):
    """Generate AI summary of client relationship using Claude API"""
    pass

@app.post("/suggest")
async def suggest_action(data: dict):
    """Suggest next best action for at-risk client"""
    pass
