import os

class Config:
    # External PostgreSQL database URI
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'postgresql://finance_tracker_67o1_user:0MQdt0pyTFzmvhWpUqXOE2hOnF30ly3B@dpg-ctn3ual2ng1s73bguv7g-a.oregon-postgres.render.com/finance_tracker_67o1')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.getenv('SECRET_KEY', 'your_secret_key')  # Optional secret key
