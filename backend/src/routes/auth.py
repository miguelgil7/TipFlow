from flask import Blueprint, request, current_app
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token
from src.db import db
from src.models.user import User
import re

auth_bp = Blueprint("auth", __name__)
bcrypt = Bcrypt()

def sanitize_string(value, max_length=150):
    """Limpia y valida strings de input"""
    if not isinstance(value, str):
        return None
    value = value.strip()
    value = re.sub(r'[<>{}[\]\\]', '', value)  # elimina caracteres peligrosos
    return value[:max_length] if value else None

def is_valid_email(email):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

# POST /api/auth/register — máximo 5 registros por hora por IP
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    if not data:
        return {"error": "Request body must be JSON"}, 400

    # sanitizar inputs
    name = sanitize_string(data.get("name"), max_length=100)
    email = sanitize_string(data.get("email"), max_length=150)
    password = data.get("password", "")

    # validaciones
    if not name or len(name) < 2:
        return {"error": "Nombre inválido — mínimo 2 caracteres"}, 400
    if not email or not is_valid_email(email):
        return {"error": "Email inválido"}, 400
    if not password or len(password) < 6:
        return {"error": "La contraseña debe tener al menos 6 caracteres"}, 400
    if len(password) > 128:
        return {"error": "Contraseña demasiado larga"}, 400

    if User.query.filter_by(email=email.lower()).first():
        return {"error": "Ya existe una cuenta con ese email"}, 409

    password_hash = bcrypt.generate_password_hash(password).decode("utf-8")
    user = User(
        name=name,
        email=email.lower(),  # siempre guardamos email en minúsculas
        password_hash=password_hash
    )
    db.session.add(user)
    db.session.commit()

    return {"message": "Cuenta creada exitosamente", "user": user.serialize()}, 201


# POST /api/auth/login — máximo 10 intentos por hora por IP
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    if not data:
        return {"error": "Request body must be JSON"}, 400

    email = sanitize_string(data.get("email"), max_length=150)
    password = data.get("password", "")

    if not email or not is_valid_email(email):
        return {"error": "Email inválido"}, 400
    if not password:
        return {"error": "Contraseña requerida"}, 400

    user = User.query.filter_by(email=email.lower()).first()

    # mensaje genérico para no revelar si el email existe
    if not user or not bcrypt.check_password_hash(user.password_hash, password):
        return {"error": "Credenciales incorrectas"}, 401

    access_token = create_access_token(identity=str(user.id))

    return {
        "message": "Login exitoso",
        "access_token": access_token,
        "user": user.serialize()
    }, 200
