from datetime import datetime
from src.db import db

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(50), default="employee")
    restaurant_id = db.Column(db.Integer, db.ForeignKey("restaurants.id"), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # rates por día (0=lunes ... 6=domingo)
    rate_monday = db.Column(db.Float, default=10.98)
    rate_tuesday = db.Column(db.Float, default=10.98)
    rate_wednesday = db.Column(db.Float, default=10.98)
    rate_thursday = db.Column(db.Float, default=10.98)
    rate_friday = db.Column(db.Float, default=10.98)
    rate_saturday = db.Column(db.Float, default=10.98)
    rate_sunday = db.Column(db.Float, default=14.00)

    def get_rate_for_date(self, date):
        rates = [
            self.rate_monday, self.rate_tuesday, self.rate_wednesday,
            self.rate_thursday, self.rate_friday, self.rate_saturday,
            self.rate_sunday
        ]
        return rates[date.weekday()]

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "restaurant_id": self.restaurant_id,
            "created_at": self.created_at.isoformat(),
            "rates": {
                "monday": self.rate_monday,
                "tuesday": self.rate_tuesday,
                "wednesday": self.rate_wednesday,
                "thursday": self.rate_thursday,
                "friday": self.rate_friday,
                "saturday": self.rate_saturday,
                "sunday": self.rate_sunday,
            }
        }
