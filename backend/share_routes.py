from flask import Blueprint, jsonify, request

from db import get_db

share_bp = Blueprint("shares", __name__, url_prefix="/api/users/<int:user_id>/trips")


@share_bp.get("/<int:trip_id>/shares")
def list_shares(user_id, trip_id):
    with get_db() as db:
        if not db.execute("SELECT id FROM trips WHERE id = %s AND user_id = %s", (trip_id, user_id)).fetchone():
            return jsonify(error="Trip not found for this user"), 404
        rows = db.execute(
            "SELECT id, trip_id AS tripId, owner_id AS ownerId, shared_with_email AS sharedWithEmail, permission, created_at AS createdAt FROM trip_shares WHERE trip_id = %s ORDER BY created_at DESC, id DESC",
            (trip_id,),
        ).fetchall()
        return jsonify(rows)


@share_bp.post("/<int:trip_id>/shares")
def create_share(user_id, trip_id):
    data = request.get_json(silent=True) or {}
    email = data.get("sharedWithEmail", "").strip().lower()
    permission = data.get("permission", "view")
    if not email or "@" not in email:
        return jsonify(error="A valid sharedWithEmail is required"), 400
    if permission not in ("view", "edit"):
        return jsonify(error="permission must be view or edit"), 400

    with get_db() as db:
        if not db.execute("SELECT id FROM trips WHERE id = %s AND user_id = %s", (trip_id, user_id)).fetchone():
            return jsonify(error="Trip not found for this user"), 404
        row = db.execute(
            """
            INSERT INTO trip_shares(trip_id, owner_id, shared_with_email, permission)
            VALUES(%s, %s, %s, %s)
            ON CONFLICT (trip_id, shared_with_email) DO UPDATE SET permission = EXCLUDED.permission
            RETURNING id, trip_id AS tripId, owner_id AS ownerId, shared_with_email AS sharedWithEmail, permission, created_at AS createdAt
            """,
            (trip_id, user_id, email, permission),
        ).fetchone()
        return jsonify(row), 201


@share_bp.delete("/<int:trip_id>/shares/<int:share_id>")
def delete_share(user_id, trip_id, share_id):
    with get_db() as db:
        result = db.execute(
            "DELETE FROM trip_shares WHERE id = %s AND trip_id = %s AND owner_id = %s",
            (share_id, trip_id, user_id),
        )
        if result.rowcount == 0:
            return jsonify(error="Share not found for this user"), 404
        return jsonify(message="Share removed successfully")
