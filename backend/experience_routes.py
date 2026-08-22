from flask import Blueprint, jsonify, request

from db import get_db

experience_bp = Blueprint(
    "experiences", __name__, url_prefix="/api/users/<int:user_id>/experiences"
)


def serialize_experience(experience):
    return {
        "id": experience["id"],
        "userId": experience["user_id"],
        "tripId": experience["trip_id"],
        "title": experience["title"],
        "description": experience["description"],
        "cityId": experience["city_id"],
        "cityName": experience["city_name"],
        "category": experience["category"],
        "cost": experience["cost"],
        "rating": experience["rating"],
        "image": experience["image"],
        "visitedDate": experience["visited_date"],
        "createdAt": experience["created_at"],
        "updatedAt": experience["updated_at"],
    }


def validate_experience(data):
    if not str(data.get("title", "")).strip():
        return "title is required"
    try:
        cost = float(data.get("cost", 0))
        if cost < 0:
            return "cost cannot be negative"
        if data.get("rating") is not None and not 1 <= float(data["rating"]) <= 5:
            return "rating must be between 1 and 5"
    except (TypeError, ValueError):
        return "cost and rating must be numbers"
    return None


def get_owned_trip(db, user_id, trip_id):
    if trip_id is None:
        return True
    return db.execute(
        "SELECT id FROM trips WHERE id = %s AND user_id = %s", (trip_id, user_id)
    ).fetchone()


@experience_bp.get("")
def list_experiences(user_id):
    with get_db() as db:
        if not db.execute("SELECT id FROM users WHERE id = %s", (user_id,)).fetchone():
            return jsonify(error="User not found"), 404
        trip_id = request.args.get("tripId", type=int)
        if trip_id is not None and not get_owned_trip(db, user_id, trip_id):
            return jsonify(error="Trip not found for this user"), 404
        query = "SELECT * FROM experiences WHERE user_id = %s"
        params = [user_id]
        if trip_id is not None:
            query += " AND trip_id = %s"
            params.append(trip_id)
        query += " ORDER BY visited_date DESC, created_at DESC, id DESC"
        experiences = db.execute(query, params).fetchall()
        return jsonify([serialize_experience(experience) for experience in experiences])


@experience_bp.post("")
def create_experience(user_id):
    data = request.get_json(silent=True) or {}
    error = validate_experience(data)
    if error:
        return jsonify(error=error), 400
    trip_id = data.get("tripId")
    if trip_id is not None:
        try:
            trip_id = int(trip_id)
        except (TypeError, ValueError):
            return jsonify(error="tripId must be an integer"), 400

    with get_db() as db:
        if not db.execute("SELECT id FROM users WHERE id = %s", (user_id,)).fetchone():
            return jsonify(error="User not found"), 404
        if not get_owned_trip(db, user_id, trip_id):
            return jsonify(error="Trip not found for this user"), 404
        cursor = db.execute(
            """
            INSERT INTO experiences (
                user_id, trip_id, title, description, city_id, city_name,
                category, cost, rating, image, visited_date
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id
            """,
            (
                user_id, trip_id, data["title"].strip(), data.get("description", "").strip(),
                data.get("cityId"), data.get("cityName"), data.get("category", "Other"),
                float(data.get("cost", 0)),
                float(data["rating"]) if data.get("rating") is not None else None,
                data.get("image"), data.get("visitedDate"),
            ),
        )
        experience = db.execute(
            "SELECT * FROM experiences WHERE id = %s", (cursor.fetchone()["id"],)
        ).fetchone()
        return jsonify(serialize_experience(experience)), 201


@experience_bp.get("/<int:experience_id>")
def get_experience(user_id, experience_id):
    with get_db() as db:
        experience = db.execute(
            "SELECT * FROM experiences WHERE id = %s AND user_id = %s",
            (experience_id, user_id),
        ).fetchone()
        if not experience:
            return jsonify(error="Experience not found for this user"), 404
        return jsonify(serialize_experience(experience))


@experience_bp.put("/<int:experience_id>")
def update_experience(user_id, experience_id):
    data = request.get_json(silent=True) or {}
    error = validate_experience(data)
    if error:
        return jsonify(error=error), 400
    trip_id = data.get("tripId")
    if trip_id is not None:
        try:
            trip_id = int(trip_id)
        except (TypeError, ValueError):
            return jsonify(error="tripId must be an integer"), 400

    with get_db() as db:
        existing = db.execute(
            "SELECT id FROM experiences WHERE id = %s AND user_id = %s",
            (experience_id, user_id),
        ).fetchone()
        if not existing:
            return jsonify(error="Experience not found for this user"), 404
        if not get_owned_trip(db, user_id, trip_id):
            return jsonify(error="Trip not found for this user"), 404
        db.execute(
            """
                UPDATE experiences SET trip_id=%s, title=%s, description=%s, city_id=%s, city_name=%s,
                category=%s, cost=%s, rating=%s, image=%s, visited_date=%s, updated_at=CURRENT_TIMESTAMP
            WHERE id=%s AND user_id=%s
            """,
            (
                trip_id, data["title"].strip(), data.get("description", "").strip(),
                data.get("cityId"), data.get("cityName"), data.get("category", "Other"),
                float(data.get("cost", 0)),
                float(data["rating"]) if data.get("rating") is not None else None,
                data.get("image"), data.get("visitedDate"), experience_id, user_id,
            ),
        )
        updated = db.execute(
            "SELECT * FROM experiences WHERE id = %s", (experience_id,)
        ).fetchone()
        return jsonify(serialize_experience(updated))


@experience_bp.delete("/<int:experience_id>")
def delete_experience(user_id, experience_id):
    with get_db() as db:
        result = db.execute(
            "DELETE FROM experiences WHERE id = %s AND user_id = %s",
            (experience_id, user_id),
        )
        if result.rowcount == 0:
            return jsonify(error="Experience not found for this user"), 404
        return jsonify(message="Experience deleted successfully")