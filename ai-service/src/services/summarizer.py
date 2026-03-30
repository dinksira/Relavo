from src.utils.groq_client import call_groq

def generate_insight(data: dict) -> str:
    try:
        client_name = data.get("client_name", "the client")
        days_since_contact = data.get("days_since_contact", 0)
        overdue_invoices = data.get("overdue_invoices", 0)
        score = data.get("score", 0)
        risk_level = data.get("risk_level", "unknown")
        recent_notes = data.get("recent_notes", [])
        last_contact_type = data.get("last_contact_type", "none")

        if recent_notes:
            notes_text = " | ".join(recent_notes)
        else:
            notes_text = "No recent notes available."

        system_prompt = """You are an AI assistant for Relavo, a client
relationship health platform used by agencies
and small businesses.

Your job: write a short, direct, specific insight
about a client relationship.

Rules:
- Maximum 3 sentences total
- Always use specific numbers (9 days, 2 invoices)
- End with exactly ONE clear action to take
- Never be vague or generic
- Never start with 'The client' or 'I'
- Tone: calm, professional, direct
- Never use: utilize, leverage, synergy"""

        user_prompt = f"""Analyze this client relationship:

Client: {client_name}
Score: {score}/100
Risk: {risk_level}
Days since contact: {days_since_contact}
Overdue invoices: {overdue_invoices}
Last contact type: {last_contact_type}
Recent notes: {notes_text}

Write 2-3 sentences explaining WHY this client
has their score and ONE specific action to take."""

        result = call_groq(
            prompt=user_prompt,
            system=system_prompt,
            max_tokens=200,
            temperature=0.7
        )
        return result

    except Exception as e:
        print(f"Error in generate_insight: {e}")
        return f"{data.get('client_name', 'Client')}'s score is {data.get('score', 0)}/100. AI insight temporarily unavailable."
