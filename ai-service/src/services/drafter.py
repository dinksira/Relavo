import json
from src.utils.claude import client, MODEL

def draft_email(data: dict) -> dict:
    """
    Input:
      - client_name: str
      - contact_name: str
      - risk_reason: str
      - days_since_contact: int
      - overdue_invoices: int
      - score: int
      - tone: str (warm/professional/direct, default professional)
      - recent_notes: list
    """
    
    client_name = data.get("client_name", "the client")
    contact_name = data.get("contact_name", "the contact")
    risk_reason = data.get("risk_reason", "general concerns")
    days_since_contact = data.get("days_since_contact", 0)
    overdue_invoices = data.get("overdue_invoices", 0)
    score = data.get("score", 0)
    tone = data.get("tone", "professional")
    recent_notes = data.get("recent_notes", [])
    
    notes_text = "\n".join([f"- {note}" for note in recent_notes]) if recent_notes else "No recent notes"

    prompt = f"""
Write a re-engagement email from an account manager 
to a client whose relationship health has declined.

Client details:
- Company: {client_name}
- Contact: {contact_name}
- Days since last contact: {days_since_contact}
- Overdue invoices: {overdue_invoices}
- Health score: {score}/100
- Reason for concern: {risk_reason}
- Recent context: {notes_text}
- Tone requested: {tone}

Tone guide:
  warm       = friendly, personal, caring
  professional = business-like, respectful, direct
  direct     = straight to the point, no fluff

Write the email now. Return ONLY a valid JSON object 
with exactly these two fields, nothing else:
{{
  "subject": "email subject line here (max 8 words)",
  "body": "full email body here (3 short paragraphs)"
}}

Rules for the email:
- Do NOT use placeholders like [Your Name]
- Sign off as "The Relavo Team" if no name given
- First paragraph: acknowledge the gap naturally
- Second paragraph: offer value or ask a question
- Third paragraph: clear call to action
- Maximum 150 words total
- Feel human, not templated
- Never mention "health score" or "AI" in the email
"""

    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=500,
            temperature=0.7
        )
        if response.choices and len(response.choices) > 0:
            content_text = response.choices[0].message.content
            # Basic parsing
            try:
                # Find JSON bounds if Groq includes text
                import re
                json_match = re.search(r'\{.*\}', content_text, re.DOTALL)
                if json_match:
                    return json.loads(json_match.group())
                return json.loads(content_text)
            except Exception as e:
                print(f"Error parsing JSON from Groq: {e}")
                raise e
        raise Exception("Empty response from Groq")
    except Exception as e:
        print(f"Error calling Groq: {e}")
        return {
            "subject": f"Checking in — {client_name}",
            "body": f"Hi {contact_name},\n\nI wanted to reach out and check how things are going on your end.\n\nWould love to connect this week if you have a few minutes.\n\nBest regards"
        }
