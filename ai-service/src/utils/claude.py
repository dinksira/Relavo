from groq import Groq
import httpx
import os
from dotenv import load_dotenv

load_dotenv()

_client = None
MODEL = "llama-3.3-70b-versatile"

def get_claude_client():
    global _client
    if _client is None:
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise ValueError("GROQ_API_KEY is not set for Groq client")
        _client = Groq(api_key=api_key)
    return _client

# For backward compatibility if needed elsewhere
def get_client():
    return get_claude_client()
