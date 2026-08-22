import sqlite3
from pathlib import Path

from werkzeug.security import generate_password_hash

DATABASE = Path(__file__).parent / "data" / "globetrotter.db"
DATABASE.parent.mkdir(exist_ok=True)


def get_db():
    connection = sqlite3.connect(DATABASE)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys = ON")
    return connection


def initialize_database():
    with get_db() as db:
        db.executescript("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE COLLATE NOCASE,
            password_hash TEXT NOT NULL,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
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
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
        CREATE TABLE IF NOT EXISTS trip_city_legs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            trip_id INTEGER NOT NULL,
            city_id TEXT NOT NULL,
            city_name TEXT NOT NULL,
            days INTEGER NOT NULL DEFAULT 1,
            position INTEGER NOT NULL DEFAULT 0,
            FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
        );
        CREATE TABLE IF NOT EXISTS trip_activities (
            trip_id INTEGER NOT NULL,
            activity_id TEXT NOT NULL,
            PRIMARY KEY (trip_id, activity_id),
            FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
        );
        CREATE INDEX IF NOT EXISTS idx_trips_user_id ON trips(user_id);
        """)

        demo_users = (
            ("Priya Sharma", "priya@globetrotter.in"),
            ("Rohan Verma", "rohan@globetrotter.in"),
            ("Ananya Iyer", "ananya@globetrotter.in"),
            ("Vikram Patel", "vikram@globetrotter.in"),
        )
        for name, email in demo_users:
            db.execute(
                "INSERT OR IGNORE INTO users(name, email, password_hash) VALUES(?, ?, ?)",
                (name, email, generate_password_hash("password123")),
            )
