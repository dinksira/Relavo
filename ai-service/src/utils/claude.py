from groq import Groq
import httpx
import os
from dotenv import load_dotenv

load_dotenv()

http_client = httpx.Client(
    headers={
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Accept": "application/json",
        "Referer": "https://groq.com/"
    }
)

client = Groq(
    api_key=os.getenv("GROQ_API_KEY"),
    http_client=http_client
)
MODEL = "llama-3.3-70b-versatile"
