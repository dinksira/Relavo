from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

try:
    print("Checking models...")
    models = client.models.list()
    print("Models found:", [m.id for m in models.data])
except Exception as e:
    print(f"FAILED TO LIST MODELS: {e}")
