import os
from google import genai
from config import GOOGLE_API_KEY, MODEL_NAME

class ExplanationAgent:
    def __init__(self):
        self.client = None
        if GOOGLE_API_KEY:
            self.client = genai.Client(api_key=GOOGLE_API_KEY)

    def run(self, compliance_result: dict) -> str:
        if not self.client:
            return "AI Explanation unavailable: GOOGLE_API_KEY not set in backend/.env."
            
        prompt = f"""
You are a tax compliance assistant for Indian MSMEs.
Explain the compliance result below in SIMPLE and CLEAR English.
Do not invent laws. Do not give legal advice. Only explain what is present.

Compliance data:
{compliance_result}

Output format:
- Short explanation
- Applicable section (if any)
- Suggested next action
"""
        try:
            # Note: google-genai uses a slightly different call structure
            response = self.client.models.generate_content(
                model="gemini-1.5-flash",
                contents=prompt
            )
            return response.text.strip()
        except Exception as e:
            return f"Error generating explanation: {str(e)}"

def create_explanation_agent():
    return ExplanationAgent()