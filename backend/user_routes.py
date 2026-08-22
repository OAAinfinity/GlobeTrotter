from flask import Blueprint, jsonify

from db import get_db

user_bp = Blueprint("users", __name__, url_prefix="/api/users")


@user_bp.get("/<int:user_id>")
def get_user(user_id):
    with get_db() as db:
        user = db.execute(
            "SELECT id, name, email, created_at FROM users WHERE id = %s", (user_id,)
        ).fetchone()
        if not user:
            return jsonify(error="User not found"), 404
        return jsonify(user)
