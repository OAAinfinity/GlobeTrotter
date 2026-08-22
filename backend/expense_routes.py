from flask import Blueprint, jsonify, request

from db import get_db

expense_bp = Blueprint("expenses", __name__, url_prefix="/api/users/<int:user_id>/expenses")


def serialize_expense(expense):
    return {
        "id": expense["id"],
        "userId": expense["user_id"],
        "tripId": expense["trip_id"],
        "category": expense["category"],
        "description": expense["description"],
        "amount": expense["amount"],
        "expenseDate": expense["expense_date"],
        "createdAt": expense["created_at"],
    }


def validate_expense(data):
    if not str(data.get("category", "")).strip():
        return "category is required"
    if not str(data.get("expenseDate", "")).strip():
        return "expenseDate is required"
    try:
        if float(data.get("amount", 0)) <= 0:
            return "amount must be greater than zero"
    except (TypeError, ValueError):
        return "amount must be a number"
    return None


def owned_trip(db, user_id, trip_id):
    return db.execute(
        "SELECT id FROM trips WHERE id = %s AND user_id = %s", (trip_id, user_id)
    ).fetchone()


@expense_bp.get("")
def list_expenses(user_id):
    with get_db() as db:
        if not db.execute("SELECT id FROM users WHERE id = %s", (user_id,)).fetchone():
            return jsonify(error="User not found"), 404
        trip_id = request.args.get("tripId", type=int)
        query = "SELECT * FROM expenses WHERE user_id = %s"
        params = [user_id]
        if trip_id is not None:
            if not owned_trip(db, user_id, trip_id):
                return jsonify(error="Trip not found for this user"), 404
            query += " AND trip_id = %s"
            params.append(trip_id)
        query += " ORDER BY expense_date DESC, created_at DESC, id DESC"
        return jsonify([serialize_expense(row) for row in db.execute(query, params).fetchall()])


@expense_bp.post("")
def create_expense(user_id):
    data = request.get_json(silent=True) or {}
    error = validate_expense(data)
    if error:
        return jsonify(error=error), 400
    trip_id = data.get("tripId")
    if trip_id is None:
        return jsonify(error="tripId is required"), 400
    try:
        trip_id = int(trip_id)
    except (TypeError, ValueError):
        return jsonify(error="tripId must be an integer"), 400

    with get_db() as db:
        if not owned_trip(db, user_id, trip_id):
            return jsonify(error="Trip not found for this user"), 404
        row = db.execute(
            """
            INSERT INTO expenses(user_id, trip_id, category, description, amount, expense_date)
            VALUES(%s, %s, %s, %s, %s, %s) RETURNING *
            """,
            (user_id, trip_id, data["category"].strip(), data.get("description", "").strip(),
             float(data["amount"]), data["expenseDate"]),
        ).fetchone()
        return jsonify(serialize_expense(row)), 201


@expense_bp.get("/<int:expense_id>")
def get_expense(user_id, expense_id):
    with get_db() as db:
        row = db.execute(
            "SELECT * FROM expenses WHERE id = %s AND user_id = %s", (expense_id, user_id)
        ).fetchone()
        if not row:
            return jsonify(error="Expense not found for this user"), 404
        return jsonify(serialize_expense(row))


@expense_bp.put("/<int:expense_id>")
def update_expense(user_id, expense_id):
    data = request.get_json(silent=True) or {}
    error = validate_expense(data)
    if error:
        return jsonify(error=error), 400
    try:
        trip_id = int(data["tripId"])
    except (KeyError, TypeError, ValueError):
        return jsonify(error="tripId must be an integer"), 400

    with get_db() as db:
        existing = db.execute(
            "SELECT id FROM expenses WHERE id = %s AND user_id = %s", (expense_id, user_id)
        ).fetchone()
        if not existing or not owned_trip(db, user_id, trip_id):
            return jsonify(error="Expense or trip not found for this user"), 404
        row = db.execute(
            """
            UPDATE expenses SET trip_id=%s, category=%s, description=%s, amount=%s, expense_date=%s
            WHERE id=%s AND user_id=%s RETURNING *
            """,
            (trip_id, data["category"].strip(), data.get("description", "").strip(),
             float(data["amount"]), data["expenseDate"], expense_id, user_id),
        ).fetchone()
        return jsonify(serialize_expense(row))


@expense_bp.delete("/<int:expense_id>")
def delete_expense(user_id, expense_id):
    with get_db() as db:
        result = db.execute(
            "DELETE FROM expenses WHERE id = %s AND user_id = %s", (expense_id, user_id)
        )
        if result.rowcount == 0:
            return jsonify(error="Expense not found for this user"), 404
        return jsonify(message="Expense deleted successfully")
