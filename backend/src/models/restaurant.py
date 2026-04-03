# restaurant.py — El restaurante dueño de los shifts
from datetime import datetime
from src.db import db

class Restaurant(db.Model):
    __tablename__ = "restaurants"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)       # ej: "Latin Grill Tampa"
    address = db.Column(db.String(200), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # relación: un restaurante tiene muchos shifts
    shifts = db.relationship("Shift", backref="restaurant", lazy=True)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "address": self.address,
        }