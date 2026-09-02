from database.mongodb import transactions_collection


def get_dashboard_summary(user_id):

    transactions = list(
        transactions_collection.find({
            "user_id": user_id
        })
    )

    total_income = 0
    total_expense = 0

    for transaction in transactions:

        amount = float(
            transaction.get("amount", 0)
        )

        if transaction.get("type") == "income":
            total_income += amount

        elif transaction.get("type") == "expense":
            total_expense += amount

    balance = total_income - total_expense

    return {
        "total_income": total_income,
        "total_expense": total_expense,
        "balance": balance,
        "transaction_count": len(transactions)
    }


def get_category_expenses(user_id):

    transactions = list(
        transactions_collection.find({
            "user_id": user_id,
            "type": "expense"
        })
    )

    category_totals = {}

    for transaction in transactions:

        category = transaction.get(
            "category",
            "Other"
        )

        amount = float(
            transaction.get("amount", 0)
        )

        if category in category_totals:

            category_totals[category] += amount

        else:

            category_totals[category] = amount

    return category_totals
def get_monthly_summary(user_id):

    transactions = list(
        transactions_collection.find({
            "user_id": user_id
        })
    )

    monthly_data = {}

    for transaction in transactions:

        date = transaction.get("date")

        if not date:
            continue

        # Example date: 2026-08-30
        month = date[:7]

        amount = float(
            transaction.get("amount", 0)
        )

        transaction_type = transaction.get("type")

        if month not in monthly_data:

            monthly_data[month] = {
                "income": 0,
                "expense": 0
            }

        if transaction_type == "income":

            monthly_data[month]["income"] += amount

        elif transaction_type == "expense":

            monthly_data[month]["expense"] += amount

    return monthly_data