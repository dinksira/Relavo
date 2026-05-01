from groq import Groq
import os
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

_groq_client = None
GROQ_MODEL = "llama-3.3-70b-versatile"

def get_groq_client():
    global _groq_client
    if _groq_client is None:
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise ValueError("GROQ_API_KEY is not set in environment variables")
        # Initializing here prevents startup crashes due to httpx version issues
        _groq_client = Groq(api_key=api_key)
    return _groq_client

def call_groq(
    prompt: str,
    system: Optional[str] = None,
    max_tokens: int = 300,
    temperature: float = 0.7
) -> str:
    try:
        client = get_groq_client()
        messages = []
        if system:
            messages.append({"role": "system", "content": system})
        
        messages.append({"role": "user", "content": prompt})

        response = client.chat.completions.create(
            model=GROQ_MODEL,
            messages=messages,
            max_tokens=max_tokens,
            temperature=temperature
        )
        
        return response.choices[0].message.content
    except Exception as e:
        print(f"Error calling Groq: {e}")
        raise e
