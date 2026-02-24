import os
from dotenv import load_dotenv

load_dotenv()

MODEL_NAME = "gemini-1.5-flash"
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# Root Rules Database
RULES_DB = {
    "Rent": {
        "tds_section": "194I",
        "tds_rate": 10,
        "threshold": 240000,
        "gst_applicable": False
    },
    "Professional Service": {
        "tds_section": "194J",
        "tds_rate": 10,
        "threshold": 30000,
        "gst_applicable": True
    },
    "Contractor": {
        "tds_section": "194C",
        "tds_rate": 2,
        "threshold": 30000,
        "gst_applicable": True
    },
    "Purchase": {
        "gst_applicable": True,
        "tds_applicable": False
    },
    "Sale": {
        "gst_applicable": True
    }
}
