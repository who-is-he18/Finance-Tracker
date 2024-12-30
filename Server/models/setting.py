from db import db

# SerializerMixin defined in this file
class SerializerMixin:
    def serialize(self):
        """Convert model instance to a dictionary."""
        return {col.name: getattr(self, col.name) for col in self.__table__.columns}

class Setting(db.Model, SerializerMixin):
    __tablename__ = 'settings'

    id = db.Column(db.Integer, primary_key=True)
    mpesa_balance = db.Column(db.Float, default=0.0)
    family_bank_balance = db.Column(db.Float, default=0.0)
    equity_bank_balance = db.Column(db.Float, default=0.0)
