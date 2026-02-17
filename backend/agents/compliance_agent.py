from .rule_agent import fetch_rules

class SimpleComplianceAgent:
    def run(self, txn_data: dict) -> dict:
        transaction_type = txn_data.get("transaction_type", "Other")
        amount = txn_data.get("amount", 0)
        rules = fetch_rules(transaction_type)

        result = {
            "transaction_type": transaction_type,
            "amount": amount,
            "rules": rules,
            "tds_required": False,
            "gst_applicable": False,
            "compliance_status": "Compliant",
            "issues": []
        }

        # TDS evaluation
        if "tds_section" in rules:
            threshold = rules.get("threshold", 0)
            if amount >= threshold:
                result["tds_required"] = True
                result["compliance_status"] = "Non-Compliant"
                result["issues"].append({
                    "type": "TDS",
                    "section": rules["tds_section"],
                    "rate": rules.get("tds_rate"),
                    "reason": "Amount exceeds TDS threshold"
                })

        # GST evaluation
        if rules.get("gst_applicable"):
            result["gst_applicable"] = True

        if result["compliance_status"] == "Compliant":
            result["issues"].append({
                "type": "None",
                "reason": "No compliance action required"
            })

        return result

def create_compliance_agent():
    return SimpleComplianceAgent()