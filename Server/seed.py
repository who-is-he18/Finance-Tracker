from app import app, db
from models.user import User
from models.setting import Settings
from models.transaction import Transaction
from werkzeug.security import generate_password_hash

def seed_data():
    # Create user
    user = User(
        username="testuser1",
        email="testuser1@example.com",
        password=generate_password_hash("testpassword"),  # Hash the password
    )

    # Add user to session
    db.session.add(user)
    db.session.commit()  # Commit the transaction to save the user in the database

    # Create settings for the user
    settings = Settings(
        user_id=user.id,
        mpesa_balance=10000,
        family_bank_balance=5000,
        equity_bank_balance=7000,
    )
    db.session.add(settings)
    db.session.commit()

    # Create income transactions for the user
    income_transaction_1 = Transaction(
        user_id=user.id,
        category="income",
        amount=3000,
        source="M-Pesa",
        description="Salary from M-Pesa",
    )
    income_transaction_2 = Transaction(
        user_id=user.id,
        category="income",
        amount=2000,
        source="Equity Bank",
        description="Freelance Work Payment",
    )
    db.session.add(income_transaction_1)
    db.session.add(income_transaction_2)

    # Create expense transactions for the user
    expense_transaction_1 = Transaction(
        user_id=user.id,
        category="expense",
        amount=1500,
        source="Family Bank",
        description="Rent Payment",
    )
    expense_transaction_2 = Transaction(
        user_id=user.id,
        category="expense",
        amount=500,
        source="Equity Bank",
        description="Groceries",
    )
    db.session.add(expense_transaction_1)
    db.session.add(expense_transaction_2)

    # Commit all transactions to the database
    db.session.commit()

if __name__ == "__main__":
    with app.app_context():
        seed_data()
    print("Seeding completed.")
