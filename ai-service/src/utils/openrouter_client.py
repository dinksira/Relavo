import httpx
import os
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
OPENROUTER_MODEL = "nvidia/nemotron-3-super-120b-a12b:free"

def call_openrouter(
    prompt: str,
    system: Optional[str] = None,
    max_tokens: int = 800,
    temperature: float = 0.7
) -> str:
    try:
        messages = []
        if system:
            messages.append({"role": "system", "content": system})
        
        messages.append({"role": "user", "content": prompt})

        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://relavo.vercel.app/",
            "X-Title": "Relavo"
        }

        body = {
            "model": OPENROUTER_MODEL,
            "messages": messages,
            "max_tokens": max_tokens,
            "temperature": temperature
        }

        with httpx.Client(timeout=60.0) as client:
            response = client.post(OPENROUTER_URL, headers=headers, json=body)
            if response.status_code != 200:
                print(f"OpenRouter Error Status: {response.status_code}, Body: {response.text}")
            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"]

    except Exception as e:
        print(f"Error calling OpenRouter: {e}")
        raise e
