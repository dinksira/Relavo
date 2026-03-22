import requests
import os
from dotenv import load_dotenv

load_dotenv()

key = os.getenv("GROQ_API_KEY")
print(f"Key starts with: {key[:10]}...")

url = "https://api.groq.com/openai/v1/chat/completions"
headers = {
    "Authorization": f"Bearer {key}",
    "Content-Type": "application/json"
}
payload = {
    "model": "llama3-8b-8192",
    "messages": [{"role": "user", "content": "Hi"}],
    "max_tokens": 10
}

try:
    print("Direct POST to Groq API...")
    res = requests.post(url, headers=headers, json=payload, timeout=5)
    print("Status code:", res.status_code)
    print("Response JSON:", res.json())
except Exception as e:
    print(f"FAILED DIRECT CALL: {e}")
