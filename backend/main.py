import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google.oauth2 import id_token
from google.auth.transport import requests

load_dotenv()

from services.pipeline import run_pipeline

app = FastAPI(title="LexGuard AI Backend")

# In a real app, this should be in .env
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TransactionRequest(BaseModel):
    description: str
    amount: float
    date: str = ""
    counterparty: str = ""
    typeHint: str = ""
    frequency: str = "one-time"

class GoogleAuthRequest(BaseModel):
    credential: str

@app.post("/api/auth/google")
async def google_auth(auth_data: GoogleAuthRequest):
    try:
        # Verify the ID token
        id_info = id_token.verify_oauth2_token(
            auth_data.credential, 
            requests.Request(), 
            GOOGLE_CLIENT_ID
        )

        # ID token is valid. Extract user info
        userid = id_info['sub']
        email = id_info['email']
        name = id_info.get('name', '')

        return {
            "token": "demo-jwt-token", # Generate a real JWT here in production
            "user": {
                "id": userid,
                "email": email,
                "name": name
            }
        }
    except ValueError:
        # Invalid token
        raise HTTPException(status_code=400, detail="Invalid Google token")

@app.post("/api/transactions/analyze")
def analyze_transaction(req: TransactionRequest):
    # Construct descriptive text for the agent pipeline
    text = f"{req.description} amount {req.amount}. Counterparty: {req.counterparty}. Type hint: {req.typeHint}"
    
    result = run_pipeline(text)
    
    txn = result["transaction"]
    compliance = result["compliance"]
    explanation_text = result["explanation"]

    # Map backend agents result to frontend interface
    status = "Non-Compliant" if compliance["tds_required"] else "Compliant"
    
    # Simple extraction of actions and summary from explanation_text
    # In a real app, you'd parse the LLM output or have the agent return JSON
    summary = explanation_text.split("\n")[0].replace("- ", "")
    detail = explanation_text
    
    actions = []
    for line in explanation_text.split("\n"):
        if "action" in line.lower() or "suggested" in line.lower() or line.strip().startswith("-"):
            actions.append(line.strip().replace("- ", ""))

    if not actions:
        actions = ["Review transaction documentation", "Consult with a tax professional"]

    return {
        "status": status,
        "classification": {
            "type": txn["transaction_type"],
            "category": txn["category"],
            "gst_relevant": compliance["gst_applicable"],
            "tds_relevant": compliance["tds_required"]
        },
        "rules_applied": [
            {
                "law": "Income Tax Act",
                "section": compliance["rules"].get("tds_section", "N/A"),
                "description": f"TDS Rules for {txn['transaction_type']}"
            }
        ] if compliance["rules"] else [],
        "evaluation": {
            "threshold_exceeded": compliance["tds_required"],
            "tax_required": compliance["tds_required"],
            "tax_amount": req.amount * (compliance["rules"].get("tds_rate", 0) / 100),
            "details": compliance["issues"][0]["reason"] if compliance["issues"] else "No issues found",
            "triggered_rule": compliance["rules"]
        },
        "explanation": {
            "summary": summary,
            "detail": detail,
            "actions": actions[:4], # limit to 4
            "risk_level": "High" if status == "Non-Compliant" else "Low"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
