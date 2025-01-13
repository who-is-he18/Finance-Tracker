from flask import Flask, jsonify, send_from_directory
from flask_migrate import Migrate
from flask_restful import Api
from flask_cors import CORS
from Server.database import db
import os

# Initialize the Flask application
app = Flask(__name__)

# Enable CORS for the specific React frontend origin
CORS(app, resources={
    r"/api/*": {
        "origins": "http://localhost:5173",
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
from Server.resources.user import UserResource, LoginResource
from Server.resources.setting import SettingsResource
from Server.resources.transaction import TransactionResource, IncomeBySourceResource, ExpenseBySourceResource
from Server.resources.dashboard import DashboardResource

# Add resources to the API
api.add_resource(UserResource, '/api/users', '/api/users/<int:user_id>')
api.add_resource(LoginResource, '/api/login')
api.add_resource(SettingsResource, '/api/settings/initial-currencies/<int:user_id>', '/api/settings/<int:user_id>')
api.add_resource(TransactionResource, '/api/transactions/<int:user_id>', '/api/transactions/<int:user_id>/<int:transaction_id>')
api.add_resource(DashboardResource, '/api/dashboard/<int:user_id>')
api.add_resource(IncomeBySourceResource, '/api/transactions/income-by-source/<int:user_id>')
api.add_resource(ExpenseBySourceResource, '/api/transactions/expenses-by-source/<int:user_id>')

# Import models after app initialization
from Server.models.user import User

# Serve React frontend
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_static(path):
    if path != "" and os.path.exists(os.path.join('dist', path)):
        return send_from_directory('dist', path)
    else:
        return send_from_directory('dist', 'index.html')

if __name__ == '__main__':
    app.run(debug=True)
