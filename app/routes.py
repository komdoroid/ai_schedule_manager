from flask import Blueprint, render_template, jsonify, request
from app import db
from app.models import Schedule
import json

# Blueprintの作成（'mani'という名前でルートをグループ佳）
main_routes = Blueprint('main', __name__)

@main_routes.route("/")
def home():
    schedules = Schedule.query.all()
    return render_template("index.html", schedules=schedules)

@main_routes.route("/api/schedules")
def get_schedules():
    schedules = Schedule.query.all()
    events = []
    for schedule in schedules:
        events.append({
            "title": schedule.title,
            "start": f"{schedule.date}T{schedule.time}" if schedule.time else schedule.date,
            "description": schedule.description
        })
    return jsonify(events)

@main_routes.route("/add", methods=["POST"])
def add_schedule():
    data = request.get_json()
    new_schedule = Schedule(
        title=data["title"],
        date=data["date"],
        time=data["time"]
    )
    db.session.add(new_schedule)
    db.session.commit()
    return jsonify({"status":"success"})