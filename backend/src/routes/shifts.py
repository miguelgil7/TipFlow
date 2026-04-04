from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from src.db import db
from src.models.shift import Shift
from src.models.shift_employee import ShiftEmployee
from src.services.tip_calculator import calculate_tips
from datetime import date

shifts_bp = Blueprint("shifts", __name__)

@shifts_bp.route("/", methods=["GET"])
@jwt_required()
def get_shifts():
    shifts = Shift.query.all()
    return {"shifts": [s.serialize() for s in shifts]}, 200

@shifts_bp.route("/", methods=["POST"])
@jwt_required()
def create_shift():
    data = request.get_json()
    user_id = get_jwt_identity()

    if not data.get("total_tips") or not data.get("restaurant_id"):
        return {"error": "total_tips and restaurant_id are required"}, 400

    # convertir el string "2026-04-01" a objeto date de Python
    shift_date_str = data.get("shift_date", date.today().isoformat())
    shift_date_obj = date.fromisoformat(shift_date_str)

    shift = Shift(
        shift_date=shift_date_obj,
        total_tips=data["total_tips"],
        restaurant_id=data["restaurant_id"],
        created_by=user_id
    )
    db.session.add(shift)
    db.session.commit()

    return {"message": "Shift created", "shift": shift.serialize()}, 201

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
