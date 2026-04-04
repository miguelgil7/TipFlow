from flask import Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from src.services.ai_insights import get_insights

ai_bp = Blueprint("ai", __name__)

@ai_bp.route("/insights", methods=["GET"])
@jwt_required()
def insights():
    user_id = int(get_jwt_identity())
    result = get_insights(user_id)
    return result, 200
