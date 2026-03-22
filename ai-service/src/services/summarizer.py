from src.utils.claude import client, MODEL

def generate_insight(data: dict) -> str:
    """
    Input:
      - client_name: str
      - days_since_contact: int
      - overdue_invoices: int
      - score: int
      - risk_level: str
      - recent_notes: list of strings (last 3 touchpoint notes)
      - last_contact_type: str (call/email/meeting/message/none)
    """
    
    client_name = data.get("client_name", "the client")
    days_since_contact = data.get("days_since_contact", 0)
    overdue_invoices = data.get("overdue_invoices", 0)
    score = data.get("score", 0)
    risk_level = data.get("risk_level", "unknown")
    recent_notes = data.get("recent_notes", [])
    last_contact_type = data.get("last_contact_type", "none")
    
    recent_notes_text = "\n".join([f"- {note}" for note in recent_notes]) if recent_notes else "No recent notes"

    prompt = f"""
You are an AI assistant for Relavo, a client relationship 
health platform used by small agencies and businesses.

Analyze this client data and write a 2-3 sentence insight 
explaining the client's current health score and what 
the account manager should do right now.

Client data:
- Client name: {client_name}
- Health score: {score}/100
- Risk level: {risk_level}
- Days since last contact: {days_since_contact}
- Overdue invoices: {overdue_invoices}
- Last contact type: {last_contact_type}
- Recent notes: {recent_notes_text}

Rules:
- Be specific and direct, not generic
- Name exact numbers (9 days, 2 overdue invoices)
- End with ONE clear action (call, email, check invoice)
- Maximum 3 sentences total
- Never start with "I" or "The client"
- Tone: calm, professional, helpful
- Never say "it seems" or "it appears"
- Never use the word "utilize"
- If score is healthy, still give a positive insight
"""

    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=250,
            temperature=0.7
        )
        if response.choices and len(response.choices) > 0:
            return response.choices[0].message.content
        return "Score calculated. AI insight generating shortly."
    except Exception as e:
        print(f"Error calling Groq: {e}")
        return "Score calculated. AI insight generating shortly."
