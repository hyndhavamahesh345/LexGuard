import re

class SimpleTransactionAgent:
    def run(self, text: str) -> dict:
        text_lower = text.lower()

        # Transaction type detection
        if re.search(r"\brent\b", text_lower):
            transaction_type = "Rent"

        elif re.search(r"contract|labour|construction|work order", text_lower):
            transaction_type = "Contractor"

        elif re.search(r"consult|professional|fee|legal|audit", text_lower):
            transaction_type = "Professional Service"

        elif re.search(r"purchase|bought|buy|procure", text_lower):
            transaction_type = "Purchase"

        elif re.search(r"sale|sold|invoice", text_lower):
            transaction_type = "Sale"

        else:
            transaction_type = "Other"

        # Amount extraction
        amount = 0
        match = re.search(r"(₹|rs\.?|inr)?\s*([\d,]+)", text_lower)
        if match:
            try:
                amount = int(match.group(2).replace(",", ""))
            except Exception:
                amount = 0

        # Category mapping
        CATEGORY_MAP = {
            "Rent": "Rent Expense",
            "Contractor": "Contract Expense",
            "Professional Service": "Professional Fees",
            "Purchase": "Purchase of Goods",
            "Sale": "Sales Revenue"
        }

        return {
            "transaction_type": transaction_type,
            "amount": amount,
            "category": CATEGORY_MAP.get(transaction_type, "Uncategorized"),
            "raw_text": text
        }

def create_transaction_agent():
    return SimpleTransactionAgent()