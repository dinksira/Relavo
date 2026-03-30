from src.utils.openrouter_client import call_openrouter
import json
from datetime import datetime

def generate_briefing(data: dict) -> dict:
    try:
        client_name = data.get("client_name", "the client")
        created_at = data.get("created_at", "unknown")
        days_since_contact = data.get("days_since_contact", 0)
        total_touchpoints = data.get("total_touchpoints", 0)
        overdue_invoices = data.get("overdue_invoices", 0)
        total_invoices = data.get("total_invoices", 0)
        score = data.get("score", 0)
        risk_level = data.get("risk_level", "unknown")
        recent_notes = data.get("recent_notes", [])
        monthly_value = data.get("monthly_value", 0)
        score_history = data.get("score_history", [])

        notes_text = " | ".join(recent_notes) if recent_notes else "No recent notes available."

        # Calculate score trend
        trend = "insufficient history"
        if len(score_history) >= 2:
            newest_score = score_history[0]["score"]
            oldest_score = score_history[-1]["score"]
            if newest_score > oldest_score:
                trend = f"improving (was {oldest_score}, now {newest_score})"
            elif newest_score < oldest_score:
                trend = f"declining (was {oldest_score}, now {newest_score})"
            else:
                trend = "stable"

        system_prompt = """You are an expert client relationship analyst
for Relavo. Write clear, honest, specific briefings
for account managers.

Be direct. Use specific numbers. Don't be vague.
Write like a smart colleague giving advice,
not a corporate report."""

        user_prompt = f"""Generate a 3-part client briefing.

CLIENT DATA:
Name: {client_name}
Client since: {created_at}
Current score: {score}/100
Risk level: {risk_level}
Days since last contact: {days_since_contact}
Total interactions: {total_touchpoints}
Overdue invoices: {overdue_invoices} of {total_invoices}
Monthly value: ${monthly_value}
Recent notes: {notes_text}
Score trend: {trend}

Return ONLY valid JSON with exactly these 3 fields:
{{
  "past": "2-3 sentences about relationship history. How long client, interaction trends, any notable past issues. Use numbers.",

  "present": "2-3 sentences about today's situation. Most urgent issue right now. Be specific about score and why.",

  "future": "2-3 sentences predicting what happens next. State churn probability as HIGH, MEDIUM, or LOW with a reason. Give ONE specific action with a timeframe."
}}

Return ONLY the JSON. No other text."""

        response = call_openrouter(
            prompt=user_prompt,
            system=system_prompt,
            max_tokens=600,
            temperature=0.5
        )

        # Clean response
        clean_response = response.strip()
        if clean_response.startswith("```"):
            clean_response = clean_response.split("```")[1]
            if clean_response.startswith("json"):
                clean_response = clean_response[4:]
        clean_response = clean_response.strip()

        result = json.loads(clean_response)
        result["generated_at"] = datetime.now().isoformat()
        return result

    except Exception as e:
        print(f"Error in generate_briefing: {e}")
        return {
            "past": f"{client_name} has been a client since {data.get('created_at', 'the beginning')}.",
            "present": f"The relationship currently has a health score of {data.get('score', 0)}/100.",
            "future": "We should continue to monitor interaction frequency closely.",
            "generated_at": datetime.now().isoformat()
        }
