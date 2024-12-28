from flask_restful import Resource
from flask import request
from models.transaction import Transaction
from db import db

class TransactionResource(Resource):
    def get(self):
        transactions = Transaction.query.all()
        return {'transactions': [transaction.json() for transaction in transactions]}

    def post(self):
        data = request.get_json()
        new_transaction = Transaction(
            category=data['category'],
            amount=data['amount'],
            description=data['description'],
            date=data['date']
        )
        db.session.add(new_transaction)
        db.session.commit()
        return {'message': 'Transaction added successfully'}, 201
