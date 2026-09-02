from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from datetime import timedelta

from config import JWT_SECRET

from routes.transaction_routes import transaction_bp
from routes.auth_routes import auth_bp
from routes.dashboard_routes import dashboard_bp

from utils.errors import register_error_handlers


# ==========================================
# Create Flask application
# ==========================================

app = Flask(__name__)


# ==========================================
# JWT Configuration
# ==========================================

app.config["JWT_SECRET_KEY"] = JWT_SECRET

# Access token expires after 2 hours
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(
    hours=2
)


# Check whether JWT secret exists
print(
    "JWT SECRET EXISTS:",
    bool(JWT_SECRET)
)


# ==========================================
# Error handlers
# ==========================================

register_error_handlers(app)


# ==========================================
# Extensions
# ==========================================

CORS(app)

jwt = JWTManager(app)


# ==========================================
# JWT Error Handlers
# ==========================================

@jwt.unauthorized_loader
def missing_token_callback(error):

    return jsonify({
        "error": "JWT missing",
        "details": error
    }), 401


@jwt.invalid_token_loader
def invalid_token_callback(error):

    return jsonify({
        "error": "Invalid JWT",
        "details": error
    }), 401


@jwt.expired_token_loader
def expired_token_callback(
    jwt_header,
    jwt_payload
):

    return jsonify({
        "error": "JWT expired"
    }), 401


@jwt.revoked_token_loader
def revoked_token_callback(
    jwt_header,
    jwt_payload
):

    return jsonify({
        "error": "JWT revoked"
    }), 401


# ==========================================
# Authentication routes
# ==========================================

app.register_blueprint(
    auth_bp,
    url_prefix="/api/auth"
)


# ==========================================
# Transaction routes
# ==========================================

app.register_blueprint(
    transaction_bp,
    url_prefix="/api"
)


# ==========================================
# Dashboard routes
# ==========================================

app.register_blueprint(
    dashboard_bp,
    url_prefix="/api/dashboard"
)


# ==========================================
# Home route
# ==========================================

@app.route("/")
def home():

    return jsonify({
        "message": "Financial Dashboard API is running"
    })


# ==========================================
# Run application
# ==========================================

if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )