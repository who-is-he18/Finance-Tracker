from flask_restful import Resource, reqparse
from flask import request, current_app, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
import os
from db import db
from models.user import User

class UserResource(Resource):
    def post(self):
        """Signup endpoint to create a new user."""
        data = request.get_json()

        # Validate input data
        if not data.get('username') or not data.get('email') or not data.get('password'):
            return {'message': 'Missing required fields'}, 400

        # Check if email already exists
        if User.query.filter_by(email=data.get('email')).first():
            return {'message': 'Email already exists'}, 400

        # Hash the password and create the user
        hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256')
        new_user = User(
            username=data['username'],
            email=data['email'],
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

    

    def delete(self, user_id):
        """Delete a user."""
        user = User.query.get(user_id)

        if not user:
            return {'message': 'User not found'}, 404

        db.session.delete(user)
        db.session.commit()

        return {'message': 'User deleted successfully'}, 200

    def put(self, user_id):
        """Update user details."""
        user = User.query.get(user_id)

        if not user:
            return {'message': 'User not found'}, 404

        parser = reqparse.RequestParser()
        parser.add_argument('username', type=str, required=False)
        parser.add_argument('email', type=str, required=False)
        parser.add_argument('password', type=str, required=False)
        parser.add_argument('current_password', type=str, required=True, help="Current password is required")
        data = parser.parse_args()

        # Verify current password
        if not check_password_hash(user.password, data['current_password']):
            return {'message': 'Current password is incorrect'}, 401

        # Update username if provided
        if data['username']:
            user.username = data['username']

        # Update email if provided
        if data['email']:
            if not data['email']:
                return {'message': 'Email cannot be empty'}, 400
            user.email = data['email']

        # Update password if provided
        if data['password']:
            if not data['password']:
                return {'message': 'Password cannot be empty'}, 400
            user.password = generate_password_hash(data['password'], method='pbkdf2:sha256')

        try:
            db.session.commit()
            return {'message': 'User updated successfully'}, 200
        except Exception as e:
            db.session.rollback()
            return {'message': f'Error: {str(e)}'}, 500

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