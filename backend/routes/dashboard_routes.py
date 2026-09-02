from flask import Blueprint

from controllers.dashboard_controller import (
    dashboard_summary,
    category_expenses,
    monthly_summary
)


dashboard_bp = Blueprint(
    "dashboard",
    __name__
)


dashboard_bp.route(
    "/summary",
    methods=["GET"]
)(dashboard_summary)


dashboard_bp.route(
    "/categories",
    methods=["GET"]
)(category_expenses)


dashboard_bp.route(
    "/monthly",
    methods=["GET"]
)(monthly_summary)