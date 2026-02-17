from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from services.pipeline import run_pipeline

app = FastAPI(title="RegulAIte Backend")

# Allow frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite default
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TransactionRequest(BaseModel):
    description: str
    amount: float
    vendorType: str
    gstRegistered: str

@app.post("/api/transactions/analyze")
def analyze_transaction(req: TransactionRequest):
    text = f"{req.description} amount {req.amount}"
    result = run_pipeline(text)

    compliance = result["compliance"]

    return {
        "status": "non-compliant" if compliance["compliance_flag"] else "compliant",
        "issue": compliance["reason"],
        "lawApplied": compliance["rules"].get("tds_section", "GST"),
        "action": result["explanation"],
        "explanation": result["explanation"],
        "raw": result
    }
