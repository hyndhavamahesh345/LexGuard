import os
from google import genai

def create_explanation_agent():
    client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

    class ExplanationAgent:
        def run(self, compliance_result: dict) -> str:
            prompt = f"""
You are a tax compliance assistant for Indian MSMEs.

Explain the compliance result below in SIMPLE and CLEAR English.
Do not invent laws.
Do not give legal advice.
Only explain what is present.

Compliance data:
{compliance_result}

Output format:
- Short explanation
- Applicable section (if any)
- Suggested next action
"""

            response = client.models.generate_content(
                model="gemini-1.5-flash",
                contents=prompt
            )

            return response.text.strip()

    return ExplanationAgent()