from datetime import datetime
from src.db import db

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Onboarding
    role = db.Column(db.String(50), default="server")
    workplace = db.Column(db.String(100), nullable=True)
    onboarding_complete = db.Column(db.Boolean, default=False)

    # Rates por día
    rate_monday = db.Column(db.Float, default=10.98)
    rate_tuesday = db.Column(db.Float, default=10.98)
    rate_wednesday = db.Column(db.Float, default=10.98)
    rate_thursday = db.Column(db.Float, default=10.98)
    rate_friday = db.Column(db.Float, default=10.98)
    rate_saturday = db.Column(db.Float, default=10.98)
    rate_sunday = db.Column(db.Float, default=14.00)

    # Tips config
    separate_cash_credit = db.Column(db.Boolean, default=False)
    tipout_type = db.Column(db.String(20), default="none")  # none, fixed, percentage
    tipout_value = db.Column(db.Float, default=0.0)

    # Días que trabaja (ej: "1,2,3,4,5" = lun-vie)
    work_days = db.Column(db.String(20), default="1,2,3,4,5")
    restaurant_id = db.Column(db.Integer, db.ForeignKey("restaurants.id"), nullable=True)

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
            "workplace": self.workplace,
            "onboarding_complete": self.onboarding_complete,
            "restaurant_id": self.restaurant_id,
            "separate_cash_credit": self.separate_cash_credit,
            "tipout_type": self.tipout_type,
            "tipout_value": self.tipout_value,
            "work_days": self.work_days,
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
