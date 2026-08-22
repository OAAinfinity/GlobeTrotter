import sqlite3
from pathlib import Path

from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.security import check_password_hash, generate_password_hash

app = Flask(__name__)
CORS(app)

DATABASE = Path(__file__).parent / "data" / "globetrotter.db"
DATABASE.parent.mkdir(exist_ok=True)


def get_db():
    connection = sqlite3.connect(DATABASE)
    connection.execute("PRAGMA foreign_keys = ON")
    connection.row_factory = sqlite3.Row
    return connection


def initialize_database():
    with get_db() as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE COLLATE NOCASE,
                password_hash TEXT NOT NULL,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
            """
        )
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS trips (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                title TEXT NOT NULL,
                description TEXT NOT NULL DEFAULT '',
                status TEXT NOT NULL DEFAULT 'Upcoming',
                cover_image TEXT,
                start_date TEXT NOT NULL,
                end_date TEXT NOT NULL,
                total_budget REAL NOT NULL DEFAULT 0,
                estimated_cost REAL NOT NULL DEFAULT 0,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
            )
            """
        )
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS trip_city_legs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                trip_id INTEGER NOT NULL,
                city_id TEXT NOT NULL,
                city_name TEXT NOT NULL,
                days INTEGER NOT NULL DEFAULT 1,
                position INTEGER NOT NULL DEFAULT 0,
                FOREIGN KEY (trip_id) REFERENCES trips (id) ON DELETE CASCADE
            )
            """
        )
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS trip_activities (
                trip_id INTEGER NOT NULL,
                activity_id TEXT NOT NULL,
                PRIMARY KEY (trip_id, activity_id),
                FOREIGN KEY (trip_id) REFERENCES trips (id) ON DELETE CASCADE
            )
            """
        )
        connection.execute(
            "CREATE INDEX IF NOT EXISTS idx_trips_user_id ON trips (user_id)"
        )
        demo_users = (
            ("Priya Sharma", "priya@globetrotter.in"),
            ("Rohan Verma", "rohan@globetrotter.in"),
            ("Ananya Iyer", "ananya@globetrotter.in"),
            ("Vikram Patel", "vikram@globetrotter.in"),
        )
        for name, email in demo_users:
            connection.execute(
                """
                INSERT OR IGNORE INTO users (name, email, password_hash)
                VALUES (?, ?, ?)
                """,
                (name, email, generate_password_hash("password123")),
            )


def serialize_trip(connection, trip):
    city_legs = connection.execute(
        """
        SELECT city_id AS cityId, city_name AS cityName, days
        FROM trip_city_legs
        WHERE trip_id = ?
        ORDER BY position, id
        """,
        (trip["id"],),
    ).fetchall()
    activities = connection.execute(
        "SELECT activity_id FROM trip_activities WHERE trip_id = ? ORDER BY rowid",
        (trip["id"],),
    ).fetchall()

    return {
        "id": trip["id"],
        "userId": trip["user_id"],
        "title": trip["title"],
        "description": trip["description"],
        "status": trip["status"],
        "coverImage": trip["cover_image"],
        "startDate": trip["start_date"],
        "endDate": trip["end_date"],
        "totalBudget": trip["total_budget"],
        "estimatedCost": trip["estimated_cost"],
        "cities": [dict(city) for city in city_legs],
        "selectedActivities": [activity["activity_id"] for activity in activities],
        "createdAt": trip["created_at"],
        "updatedAt": trip["updated_at"],
    }


def validate_trip(data):
    for field in ("title", "startDate", "endDate"):
        if not str(data.get(field, "")).strip():
            return "title, startDate, and endDate are required"
    if data["startDate"] >= data["endDate"]:
        return "endDate must be after startDate"
    try:
        if float(data.get("totalBudget", 0)) < 0:
            return "totalBudget cannot be negative"
        if float(data.get("estimatedCost", 0)) < 0:
            return "estimatedCost cannot be negative"
    except (TypeError, ValueError):
        return "Budget values must be numbers"
    return None


def insert_trip_details(connection, trip_id, data):
    for position, city in enumerate(data.get("cities", [])):
        connection.execute(
            """
            INSERT INTO trip_city_legs (trip_id, city_id, city_name, days, position)
            VALUES (?, ?, ?, ?, ?)
            """,
            (
                trip_id,
                str(city.get("cityId", "")),
                str(city.get("cityName", "")),
                max(1, int(city.get("days", 1))),
                position,
            ),
        )
    for activity_id in data.get("selectedActivities", []):
        connection.execute(
            "INSERT OR IGNORE INTO trip_activities (trip_id, activity_id) VALUES (?, ?)",
            (trip_id, str(activity_id)),
        )


@app.post("/api/auth/signup")
def signup():
    data = request.get_json(silent=True) or {}
    name = data.get("name", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not name or not email or not password:
        return jsonify(error="Name, email, and password are required"), 400

    try:
        with get_db() as connection:
            cursor = connection.execute(
                "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
                (name, email, generate_password_hash(password)),
            )
            user_id = cursor.lastrowid
    except sqlite3.IntegrityError:
        return jsonify(error="An account with this email already exists."), 409

    return jsonify(id=user_id, name=name, email=email), 201


@app.post("/api/auth/login")
def login():
    data = request.get_json(silent=True) or {}
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    with get_db() as connection:
        user = connection.execute(
            "SELECT id, name, email, password_hash FROM users WHERE email = ?",
            (email,),
        ).fetchone()

    if not user or not check_password_hash(user["password_hash"], password):
        return jsonify(error="Invalid email or password"), 401

    return jsonify(id=user["id"], name=user["name"], email=user["email"])


@app.get("/api/users/<int:user_id>/trips")
def list_user_trips(user_id):
    with get_db() as connection:
        user = connection.execute("SELECT id FROM users WHERE id = ?", (user_id,)).fetchone()
        if not user:
            return jsonify(error="User not found"), 404
        trips = connection.execute(
            "SELECT * FROM trips WHERE user_id = ? ORDER BY created_at DESC, id DESC",
            (user_id,),
        ).fetchall()
        return jsonify([serialize_trip(connection, trip) for trip in trips])


@app.post("/api/users/<int:user_id>/trips")
def create_trip(user_id):
    data = request.get_json(silent=True) or {}
    error = validate_trip(data)
    if error:
        return jsonify(error=error), 400

    with get_db() as connection:
        user = connection.execute("SELECT id FROM users WHERE id = ?", (user_id,)).fetchone()
        if not user:
            return jsonify(error="User not found"), 404
        cursor = connection.execute(
            """
            INSERT INTO trips (
                user_id, title, description, status, cover_image,
                start_date, end_date, total_budget, estimated_cost
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                user_id,
                data["title"].strip(),
                data.get("description", "").strip(),
                data.get("status", "Upcoming"),
                data.get("coverImage"),
                data["startDate"],
                data["endDate"],
                float(data.get("totalBudget", 0)),
                float(data.get("estimatedCost", 0)),
            ),
        )
        insert_trip_details(connection, cursor.lastrowid, data)
        trip = connection.execute("SELECT * FROM trips WHERE id = ?", (cursor.lastrowid,)).fetchone()
        return jsonify(serialize_trip(connection, trip)), 201


@app.get("/api/users/<int:user_id>/trips/<int:trip_id>")
def get_user_trip(user_id, trip_id):
    with get_db() as connection:
        trip = connection.execute(
            "SELECT * FROM trips WHERE id = ? AND user_id = ?", (trip_id, user_id)
        ).fetchone()
        if not trip:
            return jsonify(error="Trip not found for this user"), 404
        return jsonify(serialize_trip(connection, trip))


@app.put("/api/users/<int:user_id>/trips/<int:trip_id>")
def update_user_trip(user_id, trip_id):
    data = request.get_json(silent=True) or {}
    error = validate_trip(data)
    if error:
        return jsonify(error=error), 400

    with get_db() as connection:
        trip = connection.execute(
            "SELECT * FROM trips WHERE id = ? AND user_id = ?", (trip_id, user_id)
        ).fetchone()
        if not trip:
            return jsonify(error="Trip not found for this user"), 404
        connection.execute(
            """
            UPDATE trips SET title = ?, description = ?, status = ?, cover_image = ?,
                start_date = ?, end_date = ?, total_budget = ?, estimated_cost = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ? AND user_id = ?
            """,
            (
                data["title"].strip(),
                data.get("description", "").strip(),
                data.get("status", "Upcoming"),
                data.get("coverImage"),
                data["startDate"],
                data["endDate"],
                float(data.get("totalBudget", 0)),
                float(data.get("estimatedCost", 0)),
                trip_id,
                user_id,
            ),
        )
        connection.execute("DELETE FROM trip_city_legs WHERE trip_id = ?", (trip_id,))
        connection.execute("DELETE FROM trip_activities WHERE trip_id = ?", (trip_id,))
        insert_trip_details(connection, trip_id, data)
        updated = connection.execute("SELECT * FROM trips WHERE id = ?", (trip_id,)).fetchone()
        return jsonify(serialize_trip(connection, updated))


@app.delete("/api/users/<int:user_id>/trips/<int:trip_id>")
def delete_user_trip(user_id, trip_id):
    with get_db() as connection:
        cursor = connection.execute(
            "DELETE FROM trips WHERE id = ? AND user_id = ?", (trip_id, user_id)
        )
        if cursor.rowcount == 0:
            return jsonify(error="Trip not found for this user"), 404
        return jsonify(message="Trip deleted successfully")


if __name__ == "__main__":
    initialize_database()
    app.run(port=5000, debug=False, use_reloader=False)
