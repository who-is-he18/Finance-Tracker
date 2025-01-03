from flask_restful import Resource, reqparse
from models.transaction import Transaction
from db import db

class TransactionResource(Resource):
    def get(self, user_id):
        """Retrieve all transactions for a specific user."""
        transactions = Transaction.query.filter_by(user_id=user_id).all()
        return {'transactions': [transaction.json() for transaction in transactions]}, 200

    def post(self, user_id):
        """Create a new transaction for a specific user."""
        parser = reqparse.RequestParser()
        parser.add_argument('category', type=str, required=True, help="Category of transaction is required")
        parser.add_argument('source', type=str, required=True, help="Source of transaction is required")
        parser.add_argument('amount', type=float, required=True, help="Amount is required")
        parser.add_argument('description', type=str, help="Description of the transaction")
        data = parser.parse_args()

        transaction = Transaction(
            user_id=user_id,
            category=data['category'],
            source=data['source'],
            amount=data['amount'],
            description=data['description']
        )

        db.session.add(transaction)
        db.session.commit()

        return transaction.json(), 201

    def delete(self, user_id, transaction_id):
        """Delete a specific transaction."""
        transaction = Transaction.query.filter_by(id=transaction_id, user_id=user_id).first()
        if not transaction:
            return {"message": "Transaction not found"}, 404

        db.session.delete(transaction)
        db.session.commit()
        return {"message": "Transaction deleted successfully"}, 200

    def put(self, user_id, transaction_id):
        """Update a specific transaction."""
        parser = reqparse.RequestParser()
        parser.add_argument('category', type=str, required=True, help="Category of transaction is required")
        parser.add_argument('source', type=str, required=True, help="Source of transaction is required")
        parser.add_argument('amount', type=float, required=True, help="Amount is required")
        parser.add_argument('description', type=str, help="Description of the transaction")
        data = parser.parse_args()

        transaction = Transaction.query.filter_by(id=transaction_id, user_id=user_id).first()
        if not transaction:
            return {"message": "Transaction not found"}, 404

        transaction.category = data['category']
        transaction.source = data['source']
        transaction.amount = data['amount']
        transaction.description = data.get('description', transaction.description)

        db.session.commit()
        return transaction.json(), 200
