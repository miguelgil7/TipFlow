from flask import Flask
from src.config import Config
from src.db import db
from src.routes.health import health_bp
from src.routes.auth import auth_bp
from src.routes.shifts import shifts_bp
from flask_jwt_extended import JWTManager

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
JWTManager(app)

with app.app_context():
    # ⚠️ CRÍTICO: importar modelos ANTES de create_all()
    from src.models import User, Restaurant, Shift, ShiftEmployee
    db.create_all()
    print("✅ Tablas creadas")

# blueprints con prefix correcto
app.register_blueprint(health_bp, url_prefix="/api")
app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(shifts_bp, url_prefix="/api/shifts")
