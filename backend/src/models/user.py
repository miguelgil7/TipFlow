# user.py — Modelo de usuario completo
from datetime import datetime
from src.db import db

class User(db.Model):
    __tablename__ = "users"  # nombre explícito en la DB

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)           # nombre del empleado
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(50), default="employee")        # "manager" o "employee"
    restaurant_id = db.Column(db.Integer, db.ForeignKey("restaurants.id"), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # para convertir el objeto a JSON fácilmente
    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "restaurant_id": self.restaurant_id,
            "created_at": self.created_at.isoformat()
        }