# shift_employee.py — Empleado dentro de un turno específico
from src.db import db

class ShiftEmployee(db.Model):
    __tablename__ = "shift_employees"

    id = db.Column(db.Integer, primary_key=True)
    shift_id = db.Column(db.Integer, db.ForeignKey("shifts.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    hours_worked = db.Column(db.Float, nullable=False)          # horas trabajadas en ese turno
    role_multiplier = db.Column(db.Float, default=1.0)          # 1.0 regular, 1.5 senior, etc.
    tip_amount = db.Column(db.Float, default=0.0)               # se llena al calcular

    def serialize(self):
        return {
            "id": self.id,
            "shift_id": self.shift_id,
            "user_id": self.user_id,
            "hours_worked": self.hours_worked,
            "role_multiplier": self.role_multiplier,
            "tip_amount": self.tip_amount,
        }