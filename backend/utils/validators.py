def validate_transaction(data):

    errors = {}

    if "amount" not in data:
        errors["amount"] = "Amount is required"
    else:
        try:
            amount = float(data["amount"])

            if amount <= 0:
                errors["amount"] = "Amount must be greater than 0"

        except (ValueError, TypeError):
            errors["amount"] = "Amount must be a number"

    if data.get("type") not in ["income", "expense"]:
        errors["type"] = "Type must be income or expense"

    if not data.get("category"):
        errors["category"] = "Category is required"

    return errors