from datetime import datetime
from Server.database import db

# SerializerMixin defined in this file
class SerializerMixin:
    def serialize(self):
        """Convert model instance to a dictionary."""
        return {col.name: getattr(self, col.name) for col in self.__table__.columns}

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
