from db import db

class Transaction(db.Model):
    __tablename__ = 'transactions'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    category = db.Column(db.String(50), nullable=False)  # 'income' or 'expense'
    source = db.Column(db.String(100), nullable=False)  # e.g., 'M-Pesa', 'Family Bank', 'Equity Bank'
    amount = db.Column(db.Float, nullable=False)
    description = db.Column(db.String(255), nullable=True)
    date = db.Column(db.DateTime, default=db.func.now())

    user = db.relationship('User', backref=db.backref('transactions', lazy=True))

    def __init__(self, user_id, category, source, amount, description=None):
        self.user_id = user_id
        self.category = category
        self.source = source
        self.amount = amount
        self.description = description

    def json(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'category': self.category,
            'source': self.source,
            'amount': self.amount,
            'description': self.description,
            'date': self.date.isoformat()  # Format date to ISO string
        }
