from flask import Flask
from flask_restful import Api
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from resources.user_resource import UserResource, LoginResource
from resources.transaction_resource import TransactionResource
from db import db
from flask_migrate import Migrate


# Initialize Flask app and set the configuration for PostgreSQL
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

# PostgreSQL Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://finance_tracker_67o1_user:0MQdt0pyTFzmvhWpUqXOE2hOnF30ly3B@dpg-ctn3ual2ng1s73bguv7g-a.oregon-postgres.render.com/finance_tracker_67o1'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

migrate = Migrate(app, db)

# JWT Configuration
app.config['JWT_SECRET_KEY'] = 'your_jwt_secret_key'  # Change this in production!

# Initialize Flask extensions
db.init_app(app)
jwt = JWTManager(app)

# Set up API
api = Api(app)

# Add resources
api.add_resource(UserResource, '/api/users')
api.add_resource(LoginResource, '/api/login')
api.add_resource(TransactionResource, '/api/transactions')

if __name__ == "__main__":
    app.run(debug=True)
