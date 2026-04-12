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

    system_prompt = """You are helping an account manager write
a re-engagement email to a client.
Write emails that feel genuinely human.
Never use templates or placeholder text.
Never mention AI, health scores, or
monitoring tools in the email."""

    user_prompt = f"""Write a re-engagement email.

Client company: {client_name}
Contact person: {contact_name}
Days since last contact: {days_since_contact}
Overdue invoices: {overdue_invoices}
Health score: {score}/100
Reason for concern: {risk_reason}
Recent context: {notes_text}
Tone: {tone} — {tone_guide.get(tone, tone_guide['professional'])}

Return ONLY valid JSON with exactly these fields:
{{
  "subject": "subject line here (max 8 words)",
  "body": "email body here with paragraphs separated by \\n\\n"
}}

Email rules:
- 3 short paragraphs maximum
- No placeholders like [Your Name]
- Sign off as: The Relavo Team
- Maximum 120 words in body
- First paragraph: natural reconnection
- Second paragraph: value or open question
- Third paragraph: clear call to action
- Never mention churn, health score, or AI
- Return ONLY the JSON object, nothing else"""

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
