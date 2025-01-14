from flask_restful import Resource, reqparse
from flask import request
from models.transaction import Transaction
from db import db
import logging

class TransactionResource(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument("type_of", type=str, required=True, help="Transaction type ('Income' or 'Expenses') is required.")
    parser.add_argument("category", type=str, required=True, help="Category is required.")
    parser.add_argument("source", type=str, required=True, help="Source is required.")
    parser.add_argument("amount", type=float, required=True, help="Amount is required.")
    parser.add_argument("description", type=str, required=False)

    def post(self, user_id):
        """Handle POST request to create a new transaction for the user"""
        data = TransactionResource.parser.parse_args()
        transaction = Transaction(**data, user_id=user_id)  # Pass user_id from URL
        try:
            db.session.add(transaction)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            return {"message": f"An error occurred while adding the transaction: {str(e)}"}, 500

        return transaction.json(), 201

    def get(self, user_id):
        """Get transactions for a specific user"""
        transactions = Transaction.query.filter_by(user_id=user_id).all()
        return {
            "transactions": [transaction.json() for transaction in transactions]
        }, 200

    def put(self, user_id, transaction_id):
        try:
            logging.info(f"Received PUT request for user_id: {user_id}, transaction_id: {transaction_id}")
            logging.info(f"Request data: {request.get_json()}")

            # Find the transaction by user_id and transaction_id
            transaction = Transaction.query.filter_by(id=transaction_id, user_id=user_id).first()

            if not transaction:
                return {'message': 'Transaction not found'}, 404

            # Get the updated data from the request body
            data = request.get_json()

            # Update the fields if they exist in the request body
            if 'type_of' in data:
                transaction.type_of = data['type_of']
            if 'category' in data:
                transaction.category = data['category']
            if 'source' in data:
                transaction.source = data['source']
            if 'amount' in data:
                transaction.amount = data['amount']
            if 'description' in data:
                transaction.description = data['description']

            # Commit the changes to the database
            db.session.commit()

            return {'message': 'Transaction updated successfully', 'transaction': transaction.json()}, 200
        except Exception as e:
            logging.error(f"Error updating transaction: {str(e)}")
            db.session.rollback()
            return {'message': f'Error: {str(e)}'}, 500

    def delete(self, user_id, transaction_id):
        """Handle DELETE request to delete a transaction for the user"""
        transaction = Transaction.query.filter_by(id=transaction_id, user_id=user_id).first()

        if not transaction:
            return {"message": "Transaction not found."}, 404

        try:
            db.session.delete(transaction)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            return {"message": f"An error occurred while deleting the transaction: {str(e)}"}, 500

        return {"message": "Transaction deleted successfully."}, 200

class TransactionSummaryResource(Resource):
    def get(self, user_id):
        """Summarize income and expenses for a user."""
        transactions = Transaction.query.filter_by(user_id=user_id).all()
        income = {}
        expenses = {}

        for transaction in transactions:
            if transaction.type_of.lower() == "income":
                income[transaction.category] = income.get(transaction.category, 0) + transaction.amount
            elif transaction.type_of.lower() == "expenses":
                expenses[transaction.category] = expenses.get(transaction.category, 0) + transaction.amount

        return {
            "income_summary": income,
            "expense_summary": expenses
        }, 200

class ExpenseBySourceResource(Resource):
    def get(self, user_id):
        """Aggregate expenses by source for a specific user."""
        try:
            # Query expenses for the user
            transactions = Transaction.query.filter_by(user_id=user_id, type_of="Expenses").all()

            # Aggregate expenses by source
            aggregated_expenses = {}
            for transaction in transactions:
                source = transaction.source  # Ensure the Transaction model has a 'source' column
                aggregated_expenses[source] = aggregated_expenses.get(source, 0) + transaction.amount

            return {"expenses_by_source": aggregated_expenses}, 200
        except Exception as e:
            return {"message": f"An error occurred: {str(e)}"}, 500

    


class IncomeBySourceResource(Resource):
    def get(self, user_id):
        """Get income transactions by source for a user."""
        sources = ["Mpesa", "Family Bank", "Equity"]
        income_by_source = {source: 0 for source in sources}

        try:
            # Query income transactions for the user
            transactions = Transaction.query.filter_by(user_id=user_id, type_of="Income").all()

            # Aggregate income by source
            for transaction in transactions:
                if transaction.source in income_by_source:
                    income_by_source[transaction.source] += transaction.amount

            return {"income_by_source": income_by_source}, 200
        except Exception as e:
            return {"message": f"An error occurred: {str(e)}"}, 500