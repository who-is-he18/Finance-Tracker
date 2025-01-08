from flask import Flask, jsonify
from flask_migrate import Migrate
from flask_restful import Api
from flask_cors import CORS
from db import db

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
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://pennywise_6ruk_user:gJsVjUaiPdaI3BPyzVBn9VpcKPuMH607@dpg-ctp767jtq21c73d2is1g-a.oregon-postgres.render.com/pennywise_6ruk'
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
from resources.transaction import TransactionResource, ExpenseAggregationResource
from resources.dashboard import DashboardResource

# Add resources to the API
api.add_resource(UserResource, '/api/users', '/api/users/<int:user_id>')
api.add_resource(LoginResource, '/api/login')
api.add_resource(SettingsResource, '/api/settings/<int:user_id>')
api.add_resource(TransactionResource, '/api/transactions/<int:user_id>', '/api/transactions/<int:user_id>/<int:transaction_id>')
api.add_resource(DashboardResource, '/api/dashboard/<int:user_id>')
api.add_resource(ExpenseAggregationResource, '/api/expenses/<int:user_id>')

# Import models after app initialization
from models.user import User

@app.route('/')
def home():
    return "Welcome to the Finance Tracker App"

if __name__ == '__main__':
    app.run(debug=True)
