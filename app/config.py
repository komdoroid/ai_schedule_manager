import os
from dotenv import load_dotenv

load_dotenv()  # .env を読み込む

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY") or "your-secret-key"
    SQLALCHEMY_DATABASE_URI = "sqlite:///schedules.db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False