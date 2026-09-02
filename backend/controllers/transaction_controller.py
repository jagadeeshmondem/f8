from flask import jsonify, request
from utils.validators import validate_transaction
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.transaction_service import (
    get_all_transactions,
    get_transaction_by_id,
    create_transaction,
    update_transaction,
    delete_transaction
)

from models.transaction_model import (
    create_transaction_data
)

@jwt_required()
def get_transactions():

    user_id = get_jwt_identity()

    page = request.args.get(
        "page",
        1,
        type=int
    )

    limit = request.args.get(
        "limit",
        10,
        type=int
    )

    transaction_type = request.args.get(
        "type"
    )

    category = request.args.get(
        "category"
    )

    start_date = request.args.get(
        "start_date"
    )

    end_date = request.args.get(
        "end_date"
    )

    # Basic protection
    if page < 1:
        page = 1

    if limit < 1:
        limit = 10

    if limit > 100:
        limit = 100

    transactions = get_all_transactions(
        user_id=user_id,
        page=page,
        limit=limit,
        transaction_type=transaction_type,
        category=category,
        start_date=start_date,
        end_date=end_date
    )

    return jsonify(transactions), 200
@jwt_required()
def get_single_transaction(transaction_id):

    user_id = get_jwt_identity()

    transaction = get_transaction_by_id(
        transaction_id,
        user_id
    )

    if not transaction:
        return jsonify({
            "error": "Transaction not found"
        }), 404

    return jsonify(transaction), 200

@jwt_required()
def add_transaction():

    data = request.get_json()

    if not data:
        return jsonify({
            "error": "Request body is required"
        }), 400

    errors = validate_transaction(data)

    if errors:
        return jsonify({
            "errors": errors
        }), 400

    transaction = create_transaction_data(data)

    user_id = get_jwt_identity()

    transaction["user_id"] = user_id

    transaction_id = create_transaction(
        transaction
    )

    return jsonify({
        "message": "Transaction created successfully",
        "id": transaction_id
    }), 201

@jwt_required()
def edit_transaction(transaction_id):

    data = request.get_json()

    if not data:
        return jsonify({
            "error": "Request body is required"
        }), 400

    allowed_fields = [
        "amount",
        "type",
        "category",
        "description",
        "date"
    ]

    update_data = {
        key: data[key]
        for key in allowed_fields
        if key in data
    }

    if not update_data:
        return jsonify({
            "error": "No valid fields to update"
        }), 400

    user_id = get_jwt_identity()

    modified = update_transaction(
        transaction_id,
        user_id,
        update_data
    )

    if modified == 0:
        return jsonify({
            "error": "Transaction not found or no changes made"
        }), 404

    return jsonify({
        "message": "Transaction updated successfully"
    }), 200

@jwt_required()
def remove_transaction(transaction_id):

    user_id = get_jwt_identity()

    deleted = delete_transaction(
        transaction_id,
        user_id
    )

    if deleted == 0:
        return jsonify({
            "error": "Transaction not found"
        }), 404

    return jsonify({
        "message": "Transaction deleted successfully"
    }), 200