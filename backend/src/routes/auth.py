from flask import Blueprint, request
from flask_bcrypt import Bcrypt

from src.db import db
from src.models.user import User

auth_bp = Blueprint("auth", __name__)
bcrypt = Bcrypt()


@auth_bp.route("/api/auth/register", methods=["POST"])
def register():
    data = request.get_json()

    if not data:
        return {"error": "Request body must be JSON"}, 400

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return {"error": "Email and password are required"}, 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return {"error": "User already exists"}, 400

    password_hash = bcrypt.generate_password_hash(password).decode("utf-8")

    user = User(email=email, password_hash=password_hash)
    db.session.add(user)
    db.session.commit()

    return {"message": "User created successfully"}, 201