from flask import Flask
from src.routes.health import health_bp

app = Flask(__name__)

# registrar rutas
app.register_blueprint(health_bp)

@app.route("/")
def home():
    return {"message": "TIPFLOW API is running 🚀"}