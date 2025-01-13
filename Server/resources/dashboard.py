from flask_restful import Resource
from Server.models.transaction import Transaction
from Server.models.setting import Settings
from Server.models.user import User

class DashboardResource(Resource):
    def get(self, user_id):
        """Retrieve the dashboard data for a specific user."""
        # Get the user's transactions
        income_transactions = Transaction.query.filter_by(user_id=user_id, category='income').all()
        expense_transactions = Transaction.query.filter_by(user_id=user_id, category='expense').all()

        # Calculate transaction-based income and expenses
        transaction_income = sum(t.amount for t in income_transactions)
        total_expenses = sum(t.amount for t in expense_transactions)

        # Get the user's settings for initial balances
        settings = Settings.query.filter_by(user_id=user_id).first()
        if settings:
            mpesa_balance = settings.mpesa_balance
            family_bank_balance = settings.family_bank_balance
            equity_bank_balance = settings.equity_bank_balance
        else:
            mpesa_balance = family_bank_balance = equity_bank_balance = 0

        # Total income includes transaction-based income + initial balances
        total_income = transaction_income + mpesa_balance + family_bank_balance + equity_bank_balance

        # Current savings
        current_savings = total_income - total_expenses

        # Calculate income from different sources
        income_sources = {
            "M-Pesa": 0,
            "Equity Bank": 0,
            "Family Bank": 0,
        }

        for transaction in income_transactions:
            if transaction.source in income_sources:
                income_sources[transaction.source] += transaction.amount

        # Fetch the user's username
        user = User.query.get(user_id)
        if not user:
            return {"message": "User not found"}, 404

        return {
            'username': user.username,
            'total_income': total_income,
            'total_expenses': total_expenses,
            'current_savings': current_savings,
            'mpesa_balance': mpesa_balance,
            'family_bank_balance': family_bank_balance,
            'equity_bank_balance': equity_bank_balance,
            'income_sources': income_sources
        }, 200