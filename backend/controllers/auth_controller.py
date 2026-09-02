from flask import request, jsonify
from flask_jwt_extended import create_access_token

from models.user_model import create_user_data

from services.auth_service import (
    find_user_by_email,
    create_user,
    hash_password,
    check_password
)


def register():

    data = request.get_json()

    if not data:
        return jsonify({
            "error": "Request body is required"
        }), 400

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return jsonify({
            "error": "Name, email and password are required"
        }), 400

    existing_user = find_user_by_email(email)

    if existing_user:
        return jsonify({
            "error": "Email already registered"
        }), 409

    hashed_password = hash_password(password)

    user = create_user_data(
        name,
        email,
        hashed_password
    )

    user_id = create_user(user)

    return jsonify({
        "message": "User registered successfully",
        "user_id": user_id
    }), 201


def login():

    data = request.get_json()

    if not data:
        return jsonify({
            "error": "Request body is required"
        }), 400

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({
            "error": "Email and password are required"
        }), 400

    user = find_user_by_email(email)

    if not user:
        return jsonify({
            "error": "Invalid email or password"
        }), 401

    if not check_password(
        password,
        user["password"]
    ):
        return jsonify({
            "error": "Invalid email or password"
        }), 401

    access_token = create_access_token(
        identity=str(user["_id"])
    )

    return jsonify({
        "message": "Login successful",
        "access_token": access_token
    }), 200