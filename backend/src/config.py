class Config:
    SQLALCHEMY_DATABASE_URI = "sqlite:///tipflow.db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = "tipflow-secret-key-2026"
    JWT_SECRET_KEY = "tipflow-jwt-secret-2026"
