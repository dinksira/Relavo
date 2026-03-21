import os
from anthropic import Anthropic
from dotenv import load_dotenv

load_dotenv()

class ClaudeService:
    def __init__(self):
        self.api_key = os.getenv("ANTHROPIC_API_KEY")
        if self.api_key:
            self.client = Anthropic(api_key=self.api_key)
        else:
            self.client = None

    async def generate_insight(self, client_name: str, score_data: dict) -> str:
        """Generates a 2-3 sentence AI summary of the client status."""
        if not self.client:
            return f"Note: ANTHROPIC_API_KEY is missing. {client_name} is currently showing a health score of {score_data.get('score')}."

        prompt = f"""
        Analyze the following client health data and provide a 2-3 sentence summary in plain English.
        Include the reason for their status and a recommended next action.

        Client: {client_name}
        Health Score: {score_data.get('score')}/100
        Risk Level: {score_data.get('risk_level')}
        
        Factors:
        - Days since last contact: {score_data.get('days_since_contact')}
        - Overdue invoices: {score_data.get('overdue_invoices_count')}
        - Response trend: {score_data.get('response_time_trend')} (negative is slower, positive is faster)
        - Activity relative to average: {score_data.get('activity_ratio')}
        
        Format: Return only the 2-3 sentence summary.
        """

        try:
            message = self.client.messages.create(
                model="claude-3-sonnet-20240229",
                max_tokens=150,
                messages=[{"role": "user", "content": prompt}]
            )
            return message.content[0].text
        except Exception as e:
            return f"Error generating insight: {str(e)}"

    async def draft_reengagement_email(self, client_name: str, context: str, tone: str = "Professional") -> dict:
        """Drafts a personalized re-engagement email based on client history."""
        if not self.client:
            return {
                "subject": f"Checking in — {client_name}",
                "body": "Note: ANTHROPIC_API_KEY is missing. Please configure it to generate AI drafts."
            }

        prompt = f"""
        Draft a personalized re-engagement email for {client_name}.
        Tone: {tone}
        Reason for outreach: {context}
        
        The email should feel warm but business-appropriate.
        
        Return the result in JSON format:
        {{
            "subject": "...",
            "body": "..."
        }}
        """

        try:
            message = self.client.messages.create(
                model="claude-3-sonnet-20240229",
                max_tokens=500,
                messages=[{"role": "user", "content": prompt}]
            )
            # Simple extraction for demo purposes
            # In production, use structured outputs or a more robust parser
            import json
            content = message.content[0].text
            try:
                return json.loads(content)
            except Exception:
                return {
                    "subject": f"Checking in - {client_name}",
                    "body": content
                }
        except Exception as e:
            return {"error": str(e)}

claude_service = ClaudeService()
