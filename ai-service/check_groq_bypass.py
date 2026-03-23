import httpx
from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()

# Create custom httpx client with realistic User-Agent to bypass Cloudflare block
client = Groq(
    api_key=os.getenv("GROQ_API_KEY"),
    default_headers={
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Accept": "application/json",
        "referer": "https://groq.com/"
    }
)

try:
    print("Testing Groq CALL with Custom UA...")
    response = client.chat.completions.create(
        model="llama3-8b-8192",
        messages=[{"role": "user", "content": "Tell me a joke ABOUT A POTATO."}],
        max_tokens=50
    )
    print("RESPONSE SUCCESS!")
    print(response.choices[0].message.content)
except Exception as e:
    print(f"FAILED AGAIN: {e}")
