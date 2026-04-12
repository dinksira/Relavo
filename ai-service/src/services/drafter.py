from src.utils.groq_client import call_groq
import json

def draft_email(data: dict) -> dict:
    client_name = data.get("client_name", "the client")
    contact_name = data.get("contact_name", "there")
    days_since_contact = data.get("days_since_contact", 0)
    overdue_invoices = data.get("overdue_invoices", 0)
    score = data.get("score", 0)
    risk_reason = data.get("risk_reason", "checking in")
    tone = data.get("tone", "professional")
    recent_notes = data.get("recent_notes", [])

    notes_text = " | ".join(recent_notes) if recent_notes else "No recent context available."

    tone_guide = {
        "warm": "Friendly and personal, like a friend",
        "professional": "Business-like, respectful, clear",
        "direct": "Straight to point, brief, no fluff"
    }

    system_prompt = """You are a senior Executive Account Manager at Relavo. 
Your goal is to write a highly professional, bespoke, and sophisticated re-engagement email to a client.
Rules:
- Write like a human executive, not an AI or a customer support bot.
- Be nuanced and empathetic.
- NEVER use generic phrases like "I hope this finds you well" or "Checking in".
- NEVER mention health scores, AI analysis, or monitoring metrics.
- Maintain absolute confidentiality of our internal systems.
- Use the provided context/notes to make it feel extremely personal."""

    user_prompt = f"""Draft a sophisticated business email to {contact_name} at {client_name}.
    
Context:
- Last spoke: {days_since_contact} days ago.
- Outstanding matters: {overdue_invoices} overdue invoices.
- Recent internal notes: {notes_text}
- Intent: {risk_reason}
- Desired Tone: {tone} — {tone_guide.get(tone, tone_guide['professional'])}

Requirements:
- Structure: Start with a personalized hook based on the notes. Briefly address the current situation without being accusatory. End with a soft but clear request for a brief sync.
- Formatting: Return valid JSON with "subject" and "body" (use \\n\\n for paragraphs).
- Length: Around 150-240 words. Be detailed, substantive, and eloquent.
- Sign-off: Use "Best regards, The Relavo Team" (do not use placeholders for your name).
- Return ONLY the JSON object, nothing else."""

    try:
        response = call_groq(
            prompt=user_prompt,
            system=system_prompt,
            max_tokens=600,
            temperature=0.7
        )

        # Clean response
        clean_response = response.strip()
        if clean_response.startswith("```"):
            clean_response = clean_response.split("```")[1]
            if clean_response.startswith("json"):
                clean_response = clean_response[4:]
        clean_response = clean_response.strip()

        return json.loads(clean_response)

    except Exception as e:
        print(f"Error draft_email: {e}")
        return {
            "subject": f"Checking in — {client_name}",
            "body": f"Hi {contact_name},\n\nI wanted to reach out and see how things are going. It's been a while since we last connected.\n\nWould you have 15 minutes this week for a quick call?\n\nLooking forward to hearing from you."
        }
