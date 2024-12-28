from flask_restful import Resource, reqparse
from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash, check_password_hash
from models.user import User
from db import db

# Parser for signup request data
signup_parser = reqparse.RequestParser()
signup_parser.add_argument('username', type=str, required=True, help="Username cannot be blank")
signup_parser.add_argument('email', type=str, required=True, help="Email cannot be blank")
signup_parser.add_argument('password', type=str, required=True, help="Password cannot be blank")

# Parser for login request data
login_parser = reqparse.RequestParser()
login_parser.add_argument('email', type=str, required=True, help="Email cannot be blank")
login_parser.add_argument('password', type=str, required=True, help="Password cannot be blank")

class UserResource(Resource):
    def post(self):
        # Parse signup data
        data = signup_parser.parse_args()

        # Check if user already exists
        if User.query.filter_by(email=data['email']).first():
            return {'message': 'User with this email already exists'}, 400

        # Hash the password securely
        hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256')

        # Create a new user
        new_user = User(username=data['username'], email=data['email'], password=hashed_password)
        try:
            db.session.add(new_user)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            return {'message': 'An error occurred while creating the user', 'error': str(e)}, 500

        return {'message': 'User created successfully'}, 201

class LoginResource(Resource):
    def post(self):
        # Parse login data
        data = login_parser.parse_args()

        # Find user by email
        user = User.query.filter_by(email=data['email']).first()

        # Validate credentials
        if not user or not check_password_hash(user.password, data['password']):
            return {'message': 'Invalid credentials'}, 401

        # Generate access token
        access_token = create_access_token(identity=user.id)
        return {'access_token': access_token, 'message': 'Login successful'}, 200
