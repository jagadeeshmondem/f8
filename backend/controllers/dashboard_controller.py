from flask import jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from services.dashboard_service import (
    get_dashboard_summary,
    get_category_expenses,
    get_monthly_summary
)


@jwt_required()
def dashboard_summary():

    user_id = get_jwt_identity()

    summary = get_dashboard_summary(user_id)

    return jsonify(summary), 200


@jwt_required()
def category_expenses():

    user_id = get_jwt_identity()

    categories = get_category_expenses(user_id)

    return jsonify(categories), 200


@jwt_required()
def monthly_summary():

    user_id = get_jwt_identity()

    monthly_data = get_monthly_summary(user_id)

    return jsonify(monthly_data), 200