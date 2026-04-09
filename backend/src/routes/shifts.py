from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from src.db import db
from src.models.shift import Shift
from src.models.shift_employee import ShiftEmployee
from src.models.user import User
from src.services.tip_calculator import calculate_tips
from datetime import date, datetime, timedelta

shifts_bp = Blueprint("shifts", __name__)

def calculate_hours(shift_date, start_time, end_time, break_minutes):
    start_dt = datetime.strptime(f"{shift_date} {start_time}", "%Y-%m-%d %H:%M")
    end_dt = datetime.strptime(f"{shift_date} {end_time}", "%Y-%m-%d %H:%M")
    # si termina antes de empezar, cruzó medianoche
    if end_dt <= start_dt:
        end_dt += timedelta(days=1)
    diff = (end_dt - start_dt).total_seconds() / 3600
    diff -= break_minutes / 60
    return round(diff, 2)

@shifts_bp.route("/", methods=["GET"])
@jwt_required()
def get_shifts():
    user_id = int(get_jwt_identity())
    employees = ShiftEmployee.query.filter_by(user_id=user_id).all()
    shift_ids = [e.shift_id for e in employees]
    shifts = Shift.query.filter(Shift.id.in_(shift_ids)).all()
    return {"shifts": [s.serialize() for s in shifts]}, 200

@shifts_bp.route("/", methods=["POST"])
@jwt_required()
def create_shift():
    data = request.get_json()
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)

    if not data.get("total_tips") or not data.get("start_time") or not data.get("end_time"):
        return {"error": "total_tips, start_time and end_time are required"}, 400

    shift_date_str = data.get("shift_date", date.today().isoformat())
    shift_date_obj = date.fromisoformat(shift_date_str)
    break_minutes = int(data.get("break_minutes", 0))
    start_time = data["start_time"]
    end_time = data["end_time"]

    hours = calculate_hours(shift_date_str, start_time, end_time, break_minutes)
    hourly_rate = user.get_rate_for_date(shift_date_obj)
    wage_earned = round(hours * hourly_rate, 2)

    shift = Shift(
        shift_date=shift_date_obj,
        total_tips=data["total_tips"],
        restaurant_id=data.get("restaurant_id", 1),
        created_by=user_id,
        start_time=start_time,
        end_time=end_time,
        break_minutes=break_minutes,
        hours_worked=hours,
        hourly_rate=hourly_rate,
        wage_earned=wage_earned,
        status="draft"
    )
    db.session.add(shift)
    db.session.commit()

    # agregar al mesero automáticamente
    employee = ShiftEmployee(
        shift_id=shift.id,
        user_id=user_id,
        hours_worked=hours,
        role_multiplier=float(data.get("role_multiplier", 1.0)),
    )
    db.session.add(employee)
    db.session.commit()

    # calcular tips automáticamente
    calculate_tips(shift.id)

    return {"message": "Shift created", "shift": shift.serialize()}, 201

@shifts_bp.route("/<int:shift_id>", methods=["PUT"])
@jwt_required()
def update_shift(shift_id):
    data = request.get_json()
    user_id = int(get_jwt_identity())
    shift = Shift.query.get(shift_id)

    if not shift or shift.created_by != user_id:
        return {"error": "Shift not found"}, 404

    if data.get("total_tips"):
        shift.total_tips = data["total_tips"]
    if data.get("start_time"):
        shift.start_time = data["start_time"]
    if data.get("end_time"):
        shift.end_time = data["end_time"]
    if "break_minutes" in data:
        shift.break_minutes = data["break_minutes"]

    if shift.start_time and shift.end_time:
        shift.hours_worked = calculate_hours(
            shift.shift_date.isoformat(),
            shift.start_time, shift.end_time,
            shift.break_minutes
        )
        shift.wage_earned = round(shift.hours_worked * shift.hourly_rate, 2)

    db.session.commit()
    calculate_tips(shift.id)

    return {"message": "Shift updated", "shift": shift.serialize()}, 200

@shifts_bp.route("/<int:shift_id>", methods=["DELETE"])
@jwt_required()
def delete_shift(shift_id):
    user_id = int(get_jwt_identity())
    shift = Shift.query.get(shift_id)

    if not shift or shift.created_by != user_id:
        return {"error": "Shift not found"}, 404

    ShiftEmployee.query.filter_by(shift_id=shift_id).delete()
    db.session.delete(shift)
    db.session.commit()

    return {"message": "Shift deleted"}, 200

@shifts_bp.route("/<int:shift_id>/employees", methods=["POST"])
@jwt_required()
def add_employee(shift_id):
    data = request.get_json()
    if not data.get("user_id") or not data.get("hours_worked"):
        return {"error": "user_id and hours_worked are required"}, 400
    employee = ShiftEmployee(
        shift_id=shift_id,
        user_id=data["user_id"],
        hours_worked=data["hours_worked"],
        role_multiplier=data.get("role_multiplier", 1.0)
    )
    db.session.add(employee)
    db.session.commit()
    return {"message": "Employee added", "employee": employee.serialize()}, 201

@shifts_bp.route("/<int:shift_id>/calculate", methods=["POST"])
@jwt_required()
def calculate(shift_id):
    result, status = calculate_tips(shift_id)
    return result, status
