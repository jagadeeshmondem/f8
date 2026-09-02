from flask import Blueprint

from controllers.transaction_controller import (
    get_transactions,
    get_single_transaction,
    add_transaction,
    edit_transaction,
    remove_transaction
)

transaction_bp = Blueprint(
    "transactions",
    __name__
)


transaction_bp.route(
    "/transactions",
    methods=["GET"]
)(get_transactions)


transaction_bp.route(
    "/transactions/<transaction_id>",
    methods=["GET"]
)(get_single_transaction)


transaction_bp.route(
    "/transactions",
    methods=["POST"]
)(add_transaction)


transaction_bp.route(
    "/transactions/<transaction_id>",
    methods=["PUT"]
)(edit_transaction)


transaction_bp.route(
    "/transactions/<transaction_id>",
    methods=["DELETE"]
)(remove_transaction)