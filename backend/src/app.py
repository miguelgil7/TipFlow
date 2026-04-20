from flask import Flask, jsonify
from src.config import Config
from src.db import db
from src.routes.health import health_bp
from src.routes.auth import auth_bp
from src.routes.shifts import shifts_bp
from src.routes.ai import ai_bp
from src.routes.stats import stats_bp
from src.routes.onboarding import onboarding_bp
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
JWTManager(app)

CORS(
    app,
    resources={r"/api/*": {"origins": [app.config["FRONTEND_URL"]]}},
    supports_credentials=False
)

limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["200 per day", "50 per hour"],
    storage_uri="memory://"
)

with app.app_context():
    from src.models import User, Restaurant, Shift, ShiftEmployee
    db.create_all()
    print("✅ Tablas creadas")

app.register_blueprint(health_bp, url_prefix="/api")
app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(shifts_bp, url_prefix="/api/shifts")
app.register_blueprint(ai_bp, url_prefix="/api/ai")
app.register_blueprint(stats_bp, url_prefix="/api/stats")
app.register_blueprint(onboarding_bp, url_prefix="/api/onboarding")

@app.errorhandler(429)
def ratelimit_handler(e):
    return jsonify({"error": "Demasiadas solicitudes. Intenta más tarde."}), 429

@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Ruta no encontrada"}), 404

@app.errorhandler(500)
def server_error(e):
    return jsonify({"error": "Error interno del servidor"}), 500

if __name__ == "__main__":
    app.run(debug=app.config["FLASK_DEBUG"])