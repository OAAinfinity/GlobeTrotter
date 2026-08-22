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


if __name__ == "__main__":
    initialize_database()
    app.run(port=5000, debug=True)