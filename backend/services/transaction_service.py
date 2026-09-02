from database.mongodb import transactions_collection

from bson import ObjectId
from bson.errors import InvalidId


# -----------------------------------
# CREATE TRANSACTION
# -----------------------------------

def create_transaction(transaction):

    result = transactions_collection.insert_one(
        transaction
    )

    return str(result.inserted_id)


# -----------------------------------
# GET ALL TRANSACTIONS
# With pagination + filters
# -----------------------------------

def get_all_transactions(
    user_id,
    page=1,
    limit=10,
    transaction_type=None,
    category=None,
    start_date=None,
    end_date=None
):

    # Base query
    query = {
        "user_id": user_id
    }

    # Filter by transaction type
    if transaction_type:

        query["type"] = transaction_type

    # Filter by category
    if category:

        query["category"] = category

    # Filter by date
    if start_date or end_date:

        query["date"] = {}

        if start_date:

            query["date"]["$gte"] = start_date

        if end_date:

            query["date"]["$lte"] = end_date

    # Calculate how many documents to skip
    skip = (page - 1) * limit

    # Get transactions
    transactions = list(
        transactions_collection
        .find(query)
        .sort("date", -1)
        .skip(skip)
        .limit(limit)
    )

    # Total matching transactions
    total = transactions_collection.count_documents(
        query
    )

    # Convert ObjectId to string
    for transaction in transactions:

        transaction["_id"] = str(
            transaction["_id"]
        )

    return {
        "transactions": transactions,
        "page": page,
        "limit": limit,
        "total": total
    }


# -----------------------------------
# GET ONE TRANSACTION
# -----------------------------------

def get_transaction_by_id(
    transaction_id,
    user_id
):

    try:

        object_id = ObjectId(
            transaction_id
        )

    except InvalidId:

        return None

    transaction = transactions_collection.find_one({

        "_id": object_id,

        "user_id": user_id

    })

    if transaction:

        transaction["_id"] = str(
            transaction["_id"]
        )

    return transaction


# -----------------------------------
# UPDATE TRANSACTION
# -----------------------------------

def update_transaction(
    transaction_id,
    user_id,
    data
):

    try:

        object_id = ObjectId(
            transaction_id
        )

    except InvalidId:

        return 0

    result = transactions_collection.update_one(

        {
            "_id": object_id,
            "user_id": user_id
        },

        {
            "$set": data
        }

    )

    return result.modified_count


# -----------------------------------
# DELETE TRANSACTION
# -----------------------------------

def delete_transaction(
    transaction_id,
    user_id
):

    try:

        object_id = ObjectId(
            transaction_id
        )

    except InvalidId:

        return 0

    result = transactions_collection.delete_one({

        "_id": object_id,

        "user_id": user_id

    })

    return result.deleted_count