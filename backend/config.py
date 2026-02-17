MODEL_NAME = "gemini-1.5-pro"

# Simple in-memory rule base (MVP)
RULES_DB = {
    "Rent": {
        "tds_section": "194I",
        "tds_rate": 10,
        "annual_threshold": 240000
    },
    "Professional Service": {
        "tds_section": "194J",
        "tds_rate": 10,
        "annual_threshold": 30000
    },
    "Sale": {
        "gst_applicable": True,
        "gst_rate": 12
    }
}
