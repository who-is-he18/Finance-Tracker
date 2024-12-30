from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from models.user import User
from models.transaction import Transaction
from models.setting import Setting
from db import db  


# Initialize the Flask application
app = Flask(__name__)

# Configure the database URI
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://pennywise_6ruk_user:gJsVjUaiPdaI3BPyzVBn9VpcKPuMH607@dpg-ctp767jtq21c73d2is1g-a.oregon-postgres.render.com/pennywise_6ruk?sslmode=require'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  

# Initialize SQLAlchemy
db.init_app(app)

# Initialize Flask-Migrate for database migrations
migrate = Migrate(app, db)
from models.user import User
from models.transaction import Transaction
from models.setting import Setting

@app.route('/')
def home():
    return "Welcome to the Finance Tracker App"

if __name__ == '__main__':
    app.run(debug=True)
