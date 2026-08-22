from psycopg.errors import UniqueViolation
from flask import Blueprint, jsonify, request
from werkzeug.security import check_password_hash, generate_password_hash

from db import get_db

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


@auth_bp.post("/signup")
def signup():
    data = request.get_json(silent=True) or {}
    name = data.get("name", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not name or not email or not password:
        return jsonify(error="Name, email, and password are required"), 400

    try:
        with get_db() as db:
            user_id = db.execute(
                "INSERT INTO users(name, email, password_hash) VALUES(%s, %s, %s) RETURNING id",
                (name, email, generate_password_hash(password)),
            ).fetchone()["id"]
    except UniqueViolation:
        return jsonify(error="An account with this email already exists."), 409

    return jsonify(id=user_id, name=name, email=email), 201


@auth_bp.post("/login")
def login():
    data = request.get_json(silent=True) or {}
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    with get_db() as db:
        user = db.execute(
            "SELECT id, name, email, password_hash FROM users WHERE email = %s",
            (email,),
        ).fetchone()

    if not user or not check_password_hash(user["password_hash"], password):
        return jsonify(error="Invalid email or password"), 401

    return jsonify(id=user["id"], name=user["name"], email=user["email"])
