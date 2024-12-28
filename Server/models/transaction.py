from db import db  # Import db from db.py

class Transaction(db.Model):
    __tablename__ = 'transactions'

    id = db.Column(db.Integer, primary_key=True)
    category = db.Column(db.String(100), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    description = db.Column(db.String(200))
    date = db.Column(db.Date, nullable=False)

    def __repr__(self):
        return f'<Transaction {self.category}>'

    def json(self):
        return {
            'id': self.id,
            'category': self.category,
            'amount': self.amount,
            'description': self.description,
            'date': self.date
        }
