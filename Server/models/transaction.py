from db import db

class Transaction(db.Model):
    __tablename__ = "transactions"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    type_of = db.Column(db.String(10), nullable=False)  # 'Income' or 'Expenses'
    category = db.Column(db.String(50), nullable=False)
    source = db.Column(db.String(100), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    description = db.Column(db.String(255), nullable=True)
    date = db.Column(db.DateTime, default=db.func.now())

    user = db.relationship("User", backref=db.backref("transactions", lazy=True))

    def json(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "type_of": self.type_of,
            "category": self.category,
            "source": self.source,
            "amount": self.amount,
            "description": self.description,
            "date": self.date.isoformat()
        }
