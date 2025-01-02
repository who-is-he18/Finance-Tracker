from flask_restful import Resource
from models.transaction import Transaction
from models.setting import Settings
from models.user import User

class DashboardResource(Resource):
    def get(self, user_id):
        """Retrieve the dashboard data for a specific user."""
        # Get the user's transactions
        income_transactions = Transaction.query.filter_by(user_id=user_id, category='income').all()
        expense_transactions = Transaction.query.filter_by(user_id=user_id, category='expense').all()

        total_income = sum(t.amount for t in income_transactions)
        total_expenses = sum(t.amount for t in expense_transactions)
        current_savings = total_income - total_expenses

        # Get the user's settings for initial currency setup
        settings = Settings.query.filter_by(user_id=user_id).first()
        if settings:
            mpesa_balance = settings.mpesa_balance
            family_bank_balance = settings.family_bank_balance
            equity_bank_balance = settings.equity_bank_balance
        else:
            mpesa_balance = family_bank_balance = equity_bank_balance = 0

        # Fetch the user's username
        user = User.query.get(user_id)
        if not user:
            return {"message": "User not found"}, 404

        return {
            'username': user.username,  # Add the username to the response
            'total_income': total_income,
            'total_expenses': total_expenses,
            'current_savings': current_savings,
            'mpesa_balance': mpesa_balance,
            'family_bank_balance': family_bank_balance,
            'equity_bank_balance': equity_bank_balance
        }, 200
