# shift.py — Cada turno de trabajo
from datetime import datetime
from src.db import db

class Shift(db.Model):
    __tablename__ = "shifts"

    id = db.Column(db.Integer, primary_key=True)
    shift_date = db.Column(db.Date, nullable=False)             # fecha del turno
    total_tips = db.Column(db.Float, nullable=False, default=0) # total recaudado
    status = db.Column(db.String(20), default="draft")          # "draft", "calculated", "closed"
    restaurant_id = db.Column(db.Integer, db.ForeignKey("restaurants.id"), nullable=False)
    created_by = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # relación: un shift tiene muchos empleados asignados
    employees = db.relationship("ShiftEmployee", backref="shift", lazy=True)

    def serialize(self):
        return {
            "id": self.id,
            "shift_date": self.shift_date.isoformat(),
            "total_tips": self.total_tips,
            "status": self.status,
            "restaurant_id": self.restaurant_id,
            "created_by": self.created_by,
        }