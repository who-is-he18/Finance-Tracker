from flask import Flask, jsonify, send_from_directory
from flask_migrate import Migrate
from flask_restful import Api
from flask_cors import CORS
from db import db
import os

# Initialize the Flask application
app = Flask(__name__, static_folder="Client/dist", static_url_path="")

# Enable CORS for the specific React frontend origin
CORS(app, resources={
    r"/api/*": {
        "origins": "https://pennywise-frontend-y27l.onrender.com",
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
    }
})

# Configure the database URI
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///pennywise.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  
app.config['SECRET_KEY'] = 'your_secret_key'

# Initialize Flask-RESTful API
api = Api(app)

# Initialize Migrate with the app and db object
migrate = Migrate(app, db)

# Initialize the database with the app
db.init_app(app)

# Import the resources after app and db initialization
from resources.user import UserResource, LoginResource
from resources.setting import SettingsResource
from resources.transaction import TransactionResource , IncomeBySourceResource , ExpenseBySourceResource
from resources.dashboard import DashboardResource

# Add resources to the API
api.add_resource(UserResource, '/api/users', '/api/users/<int:user_id>')
api.add_resource(LoginResource, '/api/login')
api.add_resource(SettingsResource, '/api/settings/initial-currencies/<int:user_id>', '/api/settings/<int:user_id>')
api.add_resource(TransactionResource, '/api/transactions/<int:user_id>', '/api/transactions/<int:user_id>/<int:transaction_id>')
api.add_resource(DashboardResource, '/api/dashboard/<int:user_id>')
api.add_resource(IncomeBySourceResource, '/api/transactions/income-by-source/<int:user_id>')
api.add_resource(ExpenseBySourceResource, '/api/transactions/expenses-by-source/<int:user_id>')

# Catch-all route to serve React's index.html for all non-API routes
@app.route('/<path:path>', methods=['GET'])
def catch_all(path):
    return send_from_directory(os.path.join(app.root_path, 'Client', 'dist'), 'index.html')

# Import models after app initialization
from models.user import User

@app.route('/')
def home():
    return "Welcome to the Finance Tracker App"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
