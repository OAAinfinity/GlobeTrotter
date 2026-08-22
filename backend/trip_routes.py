from flask import Blueprint, jsonify, request

from db import get_db

trip_bp = Blueprint("trips", __name__, url_prefix="/api/users/<int:user_id>/trips")


def serialize_trip(db, trip):
    city_legs = db.execute(
        """
        SELECT city_id AS cityId, city_name AS cityName, days
        FROM trip_city_legs WHERE trip_id = ? ORDER BY position, id
        """,
        (trip["id"],),
    ).fetchall()
    activities = db.execute(
        "SELECT activity_id FROM trip_activities WHERE trip_id = ? ORDER BY rowid",
        (trip["id"],),
    ).fetchall()
    return {
        "id": trip["id"], "userId": trip["user_id"], "title": trip["title"],
        "description": trip["description"], "status": trip["status"],
        "coverImage": trip["cover_image"], "startDate": trip["start_date"],
        "endDate": trip["end_date"], "totalBudget": trip["total_budget"],
        "estimatedCost": trip["estimated_cost"], "cities": [dict(city) for city in city_legs],
        "selectedActivities": [activity["activity_id"] for activity in activities],
        "createdAt": trip["created_at"], "updatedAt": trip["updated_at"],
    }


def validate_trip(data):
    if any(not str(data.get(field, "")).strip() for field in ("title", "startDate", "endDate")):
        return "title, startDate, and endDate are required"
    if data["startDate"] >= data["endDate"]:
        return "endDate must be after startDate"
    try:
        if float(data.get("totalBudget", 0)) < 0 or float(data.get("estimatedCost", 0)) < 0:
            return "Budget values cannot be negative"
    except (TypeError, ValueError):
        return "Budget values must be numbers"

    cities = data.get("cities", [])
    if not isinstance(cities, list):
        return "cities must be a list"
    for city in cities:
        if not isinstance(city, dict) or not city.get("cityId") or not city.get("cityName"):
            return "Each city must include cityId and cityName"
        try:
            if int(city.get("days", 1)) < 1:
                return "City days must be at least 1"
        except (TypeError, ValueError):
            return "City days must be a whole number"
    return None


def save_details(db, trip_id, data):
    for position, city in enumerate(data.get("cities", [])):
        db.execute(
            "INSERT INTO trip_city_legs(trip_id, city_id, city_name, days, position) VALUES(?, ?, ?, ?, ?)",
            (trip_id, str(city["cityId"]), str(city["cityName"]), max(1, int(city.get("days", 1))), position),
        )
    for activity_id in data.get("selectedActivities", []):
        db.execute(
            "INSERT OR IGNORE INTO trip_activities(trip_id, activity_id) VALUES(?, ?)",
            (trip_id, str(activity_id)),
        )


@trip_bp.get("")
def list_trips(user_id):
    with get_db() as db:
        if not db.execute("SELECT id FROM users WHERE id = ?", (user_id,)).fetchone():
            return jsonify(error="User not found"), 404
        trips = db.execute(
            "SELECT * FROM trips WHERE user_id = ? ORDER BY created_at DESC, id DESC",
            (user_id,),
        ).fetchall()
        return jsonify([serialize_trip(db, trip) for trip in trips])


@trip_bp.post("")
def create_trip(user_id):
    data = request.get_json(silent=True) or {}
    error = validate_trip(data)
    if error:
        return jsonify(error=error), 400
    with get_db() as db:
        if not db.execute("SELECT id FROM users WHERE id = ?", (user_id,)).fetchone():
            return jsonify(error="User not found"), 404
        cursor = db.execute(
            """
            INSERT INTO trips(user_id, title, description, status, cover_image,
                start_date, end_date, total_budget, estimated_cost)
            VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (user_id, data["title"].strip(), data.get("description", "").strip(),
             data.get("status", "Upcoming"), data.get("coverImage"), data["startDate"],
             data["endDate"], float(data.get("totalBudget", 0)), float(data.get("estimatedCost", 0))),
        )
        save_details(db, cursor.lastrowid, data)
        trip = db.execute("SELECT * FROM trips WHERE id = ?", (cursor.lastrowid,)).fetchone()
        return jsonify(serialize_trip(db, trip)), 201


@trip_bp.get("/<int:trip_id>")
def get_trip(user_id, trip_id):
    with get_db() as db:
        trip = db.execute("SELECT * FROM trips WHERE id = ? AND user_id = ?", (trip_id, user_id)).fetchone()
        if not trip:
            return jsonify(error="Trip not found for this user"), 404
        return jsonify(serialize_trip(db, trip))


@trip_bp.put("/<int:trip_id>")
def update_trip(user_id, trip_id):
    data = request.get_json(silent=True) or {}
    error = validate_trip(data)
    if error:
        return jsonify(error=error), 400
    with get_db() as db:
        trip = db.execute("SELECT id FROM trips WHERE id = ? AND user_id = ?", (trip_id, user_id)).fetchone()
        if not trip:
            return jsonify(error="Trip not found for this user"), 404
        db.execute(
            """
            UPDATE trips SET title=?, description=?, status=?, cover_image=?, start_date=?,
                end_date=?, total_budget=?, estimated_cost=?, updated_at=CURRENT_TIMESTAMP
            WHERE id=? AND user_id=?
            """,
            (data["title"].strip(), data.get("description", "").strip(), data.get("status", "Upcoming"),
             data.get("coverImage"), data["startDate"], data["endDate"], float(data.get("totalBudget", 0)),
             float(data.get("estimatedCost", 0)), trip_id, user_id),
        )
        db.execute("DELETE FROM trip_city_legs WHERE trip_id = ?", (trip_id,))
        db.execute("DELETE FROM trip_activities WHERE trip_id = ?", (trip_id,))
        save_details(db, trip_id, data)
        updated = db.execute("SELECT * FROM trips WHERE id = ?", (trip_id,)).fetchone()
        return jsonify(serialize_trip(db, updated))


@trip_bp.delete("/<int:trip_id>")
def delete_trip(user_id, trip_id):
    with get_db() as db:
        result = db.execute("DELETE FROM trips WHERE id = ? AND user_id = ?", (trip_id, user_id))
        if result.rowcount == 0:
            return jsonify(error="Trip not found for this user"), 404
        return jsonify(message="Trip deleted successfully")
