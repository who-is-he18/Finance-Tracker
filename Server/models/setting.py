from db import db

class Settings(db.Model):
    __tablename__ = 'settings'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    mpesa_balance = db.Column(db.Float, default=0.0)
    family_bank_balance = db.Column(db.Float, default=0.0)
    equity_bank_balance = db.Column(db.Float, default=0.0)

    user = db.relationship('User', backref=db.backref('settings', uselist=False))

    def __init__(self, user_id, mpesa_balance, family_bank_balance, equity_bank_balance):
        self.user_id = user_id
        self.mpesa_balance = mpesa_balance
        self.family_bank_balance = family_bank_balance
        self.equity_bank_balance = equity_bank_balance

    def json(self):
        return {
            'user_id': self.user_id,
            'mpesa_balance': self.mpesa_balance,
            'family_bank_balance': self.family_bank_balance,
            'equity_bank_balance': self.equity_bank_balance
        }
