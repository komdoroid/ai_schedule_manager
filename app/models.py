from app import db

class Schedule(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    date = db.Column(db.String(20), nullable=False)  # "YYYY-MM-DD"
    time = db.Column(db.String(10))  # "HH:MM"
    description = db.Column(db.Text)