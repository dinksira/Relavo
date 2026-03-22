from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

try:
    print("Testing completion with llama3-8b-8192...")
    res = client.chat.completions.create(
        model="llama3-8b-8192",
        messages=[{"role": "user", "content": "Hi"}],
        max_tokens=10
    )
    print("Success! Response:", res.choices[0].message.content)
except Exception as e:
    print(f"FAILED COMPLETION: {e}")
