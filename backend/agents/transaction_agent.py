import re
import os
import json
from google import genai
from config import GOOGLE_API_KEY, MODEL_NAME

class TransactionAgent:
    def __init__(self):
        self.client = None
        if GOOGLE_API_KEY:
            self.client = genai.Client(api_key=GOOGLE_API_KEY)

    def run(self, text: str) -> dict:
        if self.client:
            return self._run_with_ai(text)
        else:
            return self._run_with_regex(text)

    def _run_with_ai(self, text: str) -> dict:
        prompt = f"""
Extract transaction details from the following text:
"{text}"

Return ONLY a JSON object with:
- transaction_type: (Rent, Contractor, Professional Service, Purchase, Sale, or Other)
- amount: (integer value)
- category: (A short accounting category name)

Example:
{{"transaction_type": "Rent", "amount": 5000, "category": "Rent Expense"}}
"""
        try:
            response = self.client.models.generate_content(
                model="gemini-1.5-flash",
                contents=prompt,
                config={"response_mime_type": "application/json"}
            )
            data = json.loads(response.text)
            return {
                "transaction_type": data.get("transaction_type", "Other"),
                "amount": data.get("amount", 0),
                "category": data.get("category", "Uncategorized"),
                "raw_text": text
            }
        except Exception:
            return self._run_with_regex(text)

    def _run_with_regex(self, text: str) -> dict:
        text_lower = text.lower()

        # Improved Transaction type detection
        if re.search(r"\brent\b", text_lower):
            transaction_type = "Rent"
        elif re.search(r"\b(contract|labour|construction|work order)\b", text_lower):
            transaction_type = "Contractor"
        elif re.search(r"\b(consult|professional|fee|legal|audit)\b", text_lower):
            transaction_type = "Professional Service"
        elif re.search(r"\b(purchase|bought|buy|procure)\b", text_lower):
            transaction_type = "Purchase"
        elif re.search(r"\b(sale|sold|invoice)\b", text_lower):
            transaction_type = "Sale"
        else:
            transaction_type = "Other"

        # Smarter Amount extraction: Look for larger numbers typically after keywords
        amount = 0
        # Try to find numbers after keywords or currency symbols
        amounts = re.findall(r"(?:₹|rs\.?|inr|amt|amount|of)\s*([\d,]+(?:\.\d+)?)", text_lower)
        if not amounts:
             # Fallback to any number that looks like a price (not a year like 2024 or 2025)
             nums = re.findall(r"[\d,]+(?:\.\d+)?", text_lower)
             for n in nums:
                 n_clean = n.replace(",", "")
                 val = float(n_clean)
                 if val > 100 and val < 10000000: # Heuristic for non-year numbers
                     amount = int(val)
                     break
        else:
            try:
                amount = int(float(amounts[0].replace(",", "")))
            except Exception:
                amount = 0

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
    return TransactionAgent()