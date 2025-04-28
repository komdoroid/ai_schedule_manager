from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from app.config import Config

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)

    # ルート（後で追加）
    from app.routes import main_routes
    app.register_blueprint(main_routes)

    return app
    