import os
import anthropic
from src.models.shift import Shift
from src.models.shift_employee import ShiftEmployee

def get_insights(user_id):
    # 1. Obtener todos los shifts del mesero
    empleados = ShiftEmployee.query.filter_by(user_id=user_id).all()

    if not empleados:
        return {"insight": "Aún no tienes turnos registrados. ¡Registra tu primer turno para ver tu análisis!"}

    # 2. Construir historial
    historial = []
    total_ganado = 0
    total_horas = 0

    for emp in empleados:
        shift = Shift.query.get(emp.shift_id)
        if shift and shift.status == "calculated":
            historial.append({
                "fecha": str(shift.shift_date),
                "horas": emp.hours_worked,
                "propinas": emp.tip_amount,
            })
            total_ganado += emp.tip_amount
            total_horas += emp.hours_worked

    if not historial:
        return {"insight": "Aún no tienes turnos calculados. ¡Registra y calcula tu primer turno!"}

    promedio_por_hora = round(total_ganado / total_horas, 2) if total_horas > 0 else 0

    # 3. Llamar a Claude
    client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

    prompt = f"""Eres un asistente financiero personal para meseros. Analiza este historial de propinas y da un mensaje motivacional y útil en español, máximo 3 oraciones cortas.

Historial de turnos:
{historial}

Total ganado: ${total_ganado}
Total horas trabajadas: {total_horas}
Promedio por hora: ${promedio_por_hora}

Da una proyección mensual estimada, destaca algo positivo, y da un tip práctico. Sé directo y amigable."""

    message = client.messages.create(
        model="claude-opus-4-5",
        max_tokens=200,
        messages=[{"role": "user", "content": prompt}]
    )

    return {
        "insight": message.content[0].text,
        "stats": {
            "total_ganado": round(total_ganado, 2),
            "total_horas": round(total_horas, 2),
            "promedio_por_hora": promedio_por_hora,
            "turnos": len(historial)
        }
    }
