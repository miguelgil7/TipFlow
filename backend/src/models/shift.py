from datetime import datetime
from src.db import db

class Shift(db.Model):
    __tablename__ = "shifts"

    id = db.Column(db.Integer, primary_key=True)
    shift_date = db.Column(db.Date, nullable=False)
    total_tips = db.Column(db.Float, nullable=False, default=0)
    status = db.Column(db.String(20), default="draft")
    restaurant_id = db.Column(db.Integer, db.ForeignKey("restaurants.id"), nullable=False)
    created_by = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # nuevos campos de tiempo
    start_time = db.Column(db.String(5), nullable=True)   # "21:00"
    end_time = db.Column(db.String(5), nullable=True)     # "03:00"
    break_minutes = db.Column(db.Integer, default=0)      # minutos de break
    hours_worked = db.Column(db.Float, nullable=True)     # calculado automático
    hourly_rate = db.Column(db.Float, nullable=True)      # rate del día
    wage_earned = db.Column(db.Float, nullable=True)      # horas * rate

    employees = db.relationship("ShiftEmployee", backref="shift", lazy=True)

    def serialize(self):
        return {
            "id": self.id,
            "shift_date": self.shift_date.isoformat(),
            "total_tips": self.total_tips,
            "status": self.status,
            "restaurant_id": self.restaurant_id,
            "created_by": self.created_by,
            "start_time": self.start_time,
            "end_time": self.end_time,
            "break_minutes": self.break_minutes,
            "hours_worked": self.hours_worked,
            "hourly_rate": self.hourly_rate,
            "wage_earned": self.wage_earned,
        }
