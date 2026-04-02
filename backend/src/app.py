from flask import Flask
from src.config import Config
from src.db import db
from src.routes.health import health_bp
from src.routes.auth import auth_bp

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)

with app.app_context():
    db.create_all()

app.register_blueprint(health_bp)
app.register_blueprint(auth_bp)


@app.route("/")
def home():
    return {"message": "TIPFLOW API is running 🚀"}