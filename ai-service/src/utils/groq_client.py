from groq import Groq
import os
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))
GROQ_MODEL = "llama-3.3-70b-versatile"

def call_groq(
    prompt: str,
    system: Optional[str] = None,
    max_tokens: int = 300,
    temperature: float = 0.7
) -> str:
    try:
        messages = []
        if system:
            messages.append({"role": "system", "content": system})
        
        messages.append({"role": "user", "content": prompt})

        response = groq_client.chat.completions.create(
            model=GROQ_MODEL,
            messages=messages,
            max_tokens=max_tokens,
            temperature=temperature
        )
        
        return response.choices[0].message.content
    except Exception as e:
        print(f"Error calling Groq: {e}")
        raise e
