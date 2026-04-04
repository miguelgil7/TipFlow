# tip_calculator.py — El corazón de TipFlow
# Esta función distribuye las propinas proporcionalmente
# basándose en las horas trabajadas y el rol de cada empleado

from src.db import db
from src.models.shift import Shift
from src.models.shift_employee import ShiftEmployee

def calculate_tips(shift_id):
    # 1. Buscar el shift en la base de datos
    shift = Shift.query.get(shift_id)

    if not shift:
        return {"error": "Shift not found"}, 404

    if shift.status == "closed":
        return {"error": "Shift already closed"}, 400

    # 2. Buscar todos los empleados de ese shift
    employees = ShiftEmployee.query.filter_by(shift_id=shift_id).all()

    if not employees:
        return {"error": "No employees in this shift"}, 400

    # 3. Calcular el total de puntos ponderados
    # puntos = horas_trabajadas * role_multiplier
    # Ejemplo: 8 horas * 1.5 (senior) = 12 puntos
    total_points = sum(e.hours_worked * e.role_multiplier for e in employees)

    if total_points == 0:
        return {"error": "Total points cannot be zero"}, 400

    # 4. Distribuir las propinas proporcionalmente
    results = []
    for employee in employees:
        points = employee.hours_worked * employee.role_multiplier
        employee.tip_amount = round((points / total_points) * shift.total_tips, 2)
        results.append({
            "user_id": employee.user_id,
            "hours_worked": employee.hours_worked,
            "role_multiplier": employee.role_multiplier,
            "points": points,
            "tip_amount": employee.tip_amount
        })

    # 5. Marcar el shift como calculado y guardar
    shift.status = "calculated"
    db.session.commit()

    return {
        "success": True,
        "shift_id": shift_id,
        "total_tips": shift.total_tips,
        "total_distributed": sum(r["tip_amount"] for r in results),
        "employees": results
    }, 200
