from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from src.models.shift import Shift
from src.models.shift_employee import ShiftEmployee
from datetime import date, timedelta

stats_bp = Blueprint("stats", __name__)

@stats_bp.route("/", methods=["GET"])
@jwt_required()
def get_stats():
    user_id = int(get_jwt_identity())
    period = request.args.get("period", "week")  # week, month, year

    today = date.today()

    if period == "week":
        start = today - timedelta(days=today.weekday())  # lunes
    elif period == "month":
        start = today.replace(day=1)
    elif period == "year":
        start = today.replace(month=1, day=1)
    else:
        start = today - timedelta(days=7)

    # buscar shifts del período
    empleados = ShiftEmployee.query.filter_by(user_id=user_id).all()
    shift_ids = [e.shift_id for e in empleados]
    shifts = Shift.query.filter(
        Shift.id.in_(shift_ids),
        Shift.shift_date >= start,
        Shift.shift_date <= today
    ).all()

    emp_map = {e.shift_id: e for e in empleados}

    total_tips = 0
    total_hours = 0
    total_wage = 0
    days = {}

    for shift in shifts:
        emp = emp_map.get(shift.id)
        tip = emp.tip_amount if emp else shift.total_tips
        hours = shift.hours_worked or 0
        wage = shift.wage_earned or 0

        total_tips += tip
        total_hours += hours
        total_wage += wage

        day_str = shift.shift_date.isoformat()
        if day_str not in days:
            days[day_str] = {"tips": 0, "hours": 0, "wage": 0}
        days[day_str]["tips"] += tip
        days[day_str]["hours"] += hours
        days[day_str]["wage"] += wage

    return {
        "period": period,
        "start": start.isoformat(),
        "end": today.isoformat(),
        "total_tips": round(total_tips, 2),
        "total_hours": round(total_hours, 2),
        "total_wage": round(total_wage, 2),
        "avg_per_hour": round(total_tips / total_hours, 2) if total_hours > 0 else 0,
        "shifts_count": len(shifts),
        "days": days
    }, 200
