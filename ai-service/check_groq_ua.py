import requests
import os
from dotenv import load_dotenv

load_dotenv()

key = os.getenv("GROQ_API_KEY")
url = "https://api.groq.com/openai/v1/chat/completions"
headers = {
    "Authorization": f"Bearer {key}",
    "Content-Type": "application/json",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}
payload = {
    "model": "llama3-8b-8192",
    "messages": [{"role": "user", "content": "Hi"}],
    "max_tokens": 10
}

try:
    print("Direct POST to Groq API with Chrome User-Agent...")
    res = requests.post(url, headers=headers, json=payload, timeout=5)
    print("Status code:", res.status_code)
    print("Response JSON:", res.json())
except Exception as e:
    print(f"FAILED DIRECT CALL: {e}")
