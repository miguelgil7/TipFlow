from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from src.db import db
from src.models.user import User

onboarding_bp = Blueprint("onboarding", __name__)

@onboarding_bp.route("/", methods=["POST"])
@jwt_required()
def save_onboarding():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user:
        return {"error": "Usuario no encontrado"}, 404

    data = request.get_json()

    # Paso 1 — rol
    if data.get("role"):
        user.role = data["role"]

    # Paso 2 — workplace
    if data.get("workplace"):
        user.workplace = data["workplace"]

    # Paso 3 — rates y días
    if data.get("work_days"):
        user.work_days = data["work_days"]
    if data.get("rates"):
        r = data["rates"]
        user.rate_monday = r.get("monday", user.rate_monday)
        user.rate_tuesday = r.get("tuesday", user.rate_tuesday)
        user.rate_wednesday = r.get("wednesday", user.rate_wednesday)
        user.rate_thursday = r.get("thursday", user.rate_thursday)
        user.rate_friday = r.get("friday", user.rate_friday)
        user.rate_saturday = r.get("saturday", user.rate_saturday)
        user.rate_sunday = r.get("sunday", user.rate_sunday)

    # Paso 4 — tips config
    if "separate_cash_credit" in data:
        user.separate_cash_credit = data["separate_cash_credit"]
    if data.get("tipout_type"):
        user.tipout_type = data["tipout_type"]
    if "tipout_value" in data:
        user.tipout_value = data["tipout_value"]

    # marcar onboarding completo
    if data.get("complete"):
        user.onboarding_complete = True

    db.session.commit()
    return {"message": "Perfil actualizado", "user": user.serialize()}, 200
