from flask_restful import Resource
from flask import request, jsonify, current_app
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from db import db
from models.user import User

class UserResource(Resource):
    def post(self):
        """Signup endpoint to create a new user."""
        data = request.get_json()

        # Check if email already exists
        if User.query.filter_by(email=data.get('email')).first():
            return {'message': 'Email already exists'}, 400

        # Hash the password and create the user
        hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256')
        new_user = User(
            username=data.get('username'),
            email=data.get('email'),
            password=hashed_password
        )
        db.session.add(new_user)
        db.session.commit()

        return {'message': 'User created successfully'}, 201

    def get(self, user_id=None):
        """Retrieve a specific user's details or all users."""
        if user_id:
            user = User.query.get(user_id)
            if not user:
                return {'message': 'User not found'}, 404

            return {
                'id': user.id,
                'username': user.username,
                'email': user.email
            }, 200

        users = User.query.all()
        return [{
            'id': user.id,
            'username': user.username,
            'email': user.email
        } for user in users], 200
    

    def put(self, user_id):
        """Update user details."""
        user = User.query.get(user_id)

        if not user:
            return jsonify({'message': 'User not found'}), 404

        data = request.get_json()

        # Update the user details
        user.username = data.get('username', user.username)
        user.email = data.get('email', user.email)
        if 'password' in data:
            user.password = generate_password_hash(data['password'], method='pbkdf2:sha256')

        db.session.commit()

        return jsonify({'message': 'User updated successfully'}), 200

    def delete(self, user_id):
        """Delete a user."""
        user = User.query.get(user_id)

        if not user:
            return jsonify({'message': 'User not found'}), 404

        db.session.delete(user)
        db.session.commit()

        return jsonify({'message': 'User deleted successfully'}), 200

class LoginResource(Resource):
    def post(self):
        """Login endpoint to authenticate users."""
        data = request.get_json()
        user = User.query.filter_by(email=data.get('email')).first()

        # Validate email and password
        if not user or not check_password_hash(user.password, data.get('password')):
            return {'message': 'Invalid email or password'}, 401

        # Generate JWT token using current_app.config directly
        token = jwt.encode({
            'user_id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        }, current_app.config['SECRET_KEY'], algorithm='HS256')

        return {'access_token': token}, 200