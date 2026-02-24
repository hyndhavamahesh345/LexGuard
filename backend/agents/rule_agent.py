from config import RULES_DB

def fetch_rules(transaction_type: str) -> dict:
    return RULES_DB.get(transaction_type, {})