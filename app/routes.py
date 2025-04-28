from flask import Blueprint, render_template, jsonify, request
from app import db
from app.models import Schedule
from datetime import datetime
import json, openai, os
from dotenv import load_dotenv

load_dotenv()   # .envを読み込み

# Blueprintの作成（'main'という名前でルートをグループ佳）
main_routes = Blueprint('main', __name__)

# テストモード用の固定レスポンス
MOCH_RESPONSE = {
    "title": "AIが生成した予定",
    "date": "2025-04-25",
    "time": "15:00"
}

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

@main_routes.route("/ai-parse", methods=["POST"])
def ai_parse_schedule():
    # テストモード時はモックデータを返す
    if os.getenv("TEST_MODE") == "1":
        return jsonify(MOCH_RESPONSE)

    try:
        data = request.get_json()
        user_input = data["text"]

        # OpenAI APIで自然言語解析
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{
                "role": "system",
                "content": """
                ユーザーの入力から予定を抽出し、JSON形式で返してください。
                フォーマット: {"title": "予定名", "date": "YYYY-MM-DD", "time": "HH:MM"}
                """
            }, {
                "role": "user",
                "content": user_input
            }],
            temperature=0.3
        )

        # AIの出力をJSONとして解析
        content = response.choices[0].message.content
        parsed = json.loads(content)

        # 日付フォーマットの検証
        datetime.strptime(parsed["date"], "%Y-%m-%d")
        if "time" in parsed:
            datetime.strptime(parsed["time"], "%H:%M")

        return jsonify(parsed)

    except Exception as e:
        return jsonify({"error": str(e)}), 400

@main_routes.route("/api/daily-events")
def get_daily_events():
    date = request.args.get('date')
    schedules = Schedule.query.filter_by(date=date).all()
    return jsonify([{
        'id': s.id,
        'title': s.title,
        'time': s.time
    } for s in schedules])