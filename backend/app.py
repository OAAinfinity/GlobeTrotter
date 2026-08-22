from flask import Flask
from flask_cors import CORS

from auth_routes import auth_bp
from db import initialize_database
from experience_routes import experience_bp
from trip_routes import trip_bp


def create_app():
    app = Flask(__name__)
    CORS(app)
    initialize_database()
    app.register_blueprint(auth_bp)
    app.register_blueprint(trip_bp)
    app.register_blueprint(experience_bp)
    return app


app = create_app()


if __name__ == "__main__":
    app.run(port=5000, debug=False, use_reloader=False)
