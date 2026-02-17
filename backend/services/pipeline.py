from agents.transaction_agent import create_transaction_agent
from agents.compliance_agent import create_compliance_agent
from agents.explanation_agent import create_explanation_agent

def run_pipeline(text: str):
    txn_agent = create_transaction_agent()
    compliance_agent = create_compliance_agent()
    explanation_agent = create_explanation_agent()

    txn = txn_agent.run(text)
    compliance = compliance_agent.run(txn)
    explanation = explanation_agent.run(compliance)

    return {
        "transaction": txn,
        "compliance": compliance,
        "explanation": explanation,
    }
