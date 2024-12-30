from datetime import datetime
from db import db

# SerializerMixin defined in this file
class SerializerMixin:
    def serialize(self):
        """Convert model instance to a dictionary."""
        return {col.name: getattr(self, col.name) for col in self.__table__.columns}

class Transaction(db.Model, SerializerMixin):
    __tablename__ = 'transactions'

    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    category = db.Column(db.String(80), nullable=False)
    source = db.Column(db.String(80), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    description = db.Column(db.String(255))
