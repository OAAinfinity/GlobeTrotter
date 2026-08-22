import os

import psycopg
from psycopg.rows import dict_row
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash

load_dotenv()
DATABASE_URL = os.environ.get("DATABASE_URL")

if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL environment variable is required")


def get_db():
    return psycopg.connect(DATABASE_URL, row_factory=dict_row)


def initialize_database():
    with get_db() as db:
        schema = (
            """
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
        """,
            """
        CREATE TABLE IF NOT EXISTS trips (
            id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            title TEXT NOT NULL,
            description TEXT NOT NULL DEFAULT '',
            status TEXT NOT NULL DEFAULT 'Upcoming',
            cover_image TEXT,
            start_date TEXT NOT NULL,
            end_date TEXT NOT NULL,
            total_budget DOUBLE PRECISION NOT NULL DEFAULT 0,
            estimated_cost DOUBLE PRECISION NOT NULL DEFAULT 0,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
        """,
            """
        CREATE TABLE IF NOT EXISTS trip_city_legs (
            id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            trip_id INTEGER NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
            city_id TEXT NOT NULL,
            city_name TEXT NOT NULL,
            days INTEGER NOT NULL DEFAULT 1,
            position INTEGER NOT NULL DEFAULT 0
        )
        """,
            """
        CREATE TABLE IF NOT EXISTS trip_activities (
            trip_id INTEGER NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
            activity_id TEXT NOT NULL,
            PRIMARY KEY (trip_id, activity_id)
        )
        """,
            """
        CREATE TABLE IF NOT EXISTS experiences (
            id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            trip_id INTEGER REFERENCES trips(id) ON DELETE CASCADE,
            title TEXT NOT NULL,
            description TEXT NOT NULL DEFAULT '',
            city_id TEXT,
            city_name TEXT,
            category TEXT NOT NULL DEFAULT 'Other',
            cost DOUBLE PRECISION NOT NULL DEFAULT 0,
            rating DOUBLE PRECISION,
            image TEXT,
            visited_date TEXT,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
        """,
            "CREATE INDEX IF NOT EXISTS idx_trips_user_id ON trips(user_id)",
            "CREATE INDEX IF NOT EXISTS idx_experiences_user_id ON experiences(user_id)",
            "CREATE INDEX IF NOT EXISTS idx_experiences_trip_id ON experiences(trip_id)",
            "CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_lower ON users(LOWER(email))",
        )
        for statement in schema:
            db.execute(statement)
        demos = (
            ("Priya Sharma", "priya@globetrotter.in"),
            ("Rohan Verma", "rohan@globetrotter.in"),
            ("Ananya Iyer", "ananya@globetrotter.in"),
            ("Vikram Patel", "vikram@globetrotter.in"),
        )
        for name, email in demos:
            db.execute(
                """
                INSERT INTO users(name, email, password_hash)
                VALUES(%s, %s, %s)
                ON CONFLICT (email) DO NOTHING
                """,
                (name, email, generate_password_hash("password123")),
            )
