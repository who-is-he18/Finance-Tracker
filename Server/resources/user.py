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

    def put(self, user_id):
        """Update user details."""
        user = User.query.get(user_id)

        if not user:
            return {'message': 'User not found'}, 404

        data = request.form
        username = data.get('username')
        profile_pic = request.files.get('profile_pic')

        if 'current_password' in data:
            current_password = data['current_password']
            if not check_password_hash(user.password, current_password):
                return {'message': 'Current password is incorrect'}, 401

        if username:
            user.username = username

        if profile_pic:
            # Ensure the directory exists
            profile_pic_dir = 'path/to/save/profile_pics'
            if not os.path.exists(profile_pic_dir):
                os.makedirs(profile_pic_dir)

            # Save the profile picture to the directory and update the user's profile_pic field
            profile_pic_path = os.path.join(profile_pic_dir, profile_pic.filename)
            profile_pic.save(profile_pic_path)
            user.profile_pic = profile_pic_path

        if 'email' in data:
            email = data['email']
            if not email:
                return {'message': 'Email cannot be empty'}, 400
            user.email = email

        if 'password' in data:
            password = data['password']
            if not password:
                return {'message': 'Password cannot be empty'}, 400
            user.password = generate_password_hash(password, method='pbkdf2:sha256')

        db.session.commit()
        return {'message': 'User updated successfully'}, 200

    def delete(self, user_id):
        """Delete a user."""
        user = User.query.get(user_id)

        if not user:
            return {'message': 'User not found'}, 404

        db.session.delete(user)
        db.session.commit()

        return {'message': 'User deleted successfully'}, 200


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