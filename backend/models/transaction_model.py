from datetime import datetime


def create_transaction_data(data):

    return {
        "amount": float(data["amount"]),
        "type": data["type"],
        "category": data["category"],
        "description": data.get("description", ""),
        "date": data.get("date"),
        "payment_method": data.get("payment_method", "cash"),
        "status": data.get("status", "completed"),
        "created_at": datetime.utcnow()
    }