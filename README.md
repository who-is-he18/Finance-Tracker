# PENNYWISE - Personal Finance Tracker

## Overview

PENNYWISE is a personal finance tracker designed to help users effectively manage their income and expenses while providing insightful analytics about their financial health. With its intuitive interface and robust features, PENNYWISE allows users to track their income sources, manage expenses, and visualize savings in real-time.

## Features

### 1. Dashboard

The dashboard provides a comprehensive overview of a user's financial health with the following sections:

- **Total Income**: Displays the sum of balances from M-Pesa, Family Bank, and Equity Bank, which are initialized on the Settings page.
- **Total Expenses**: Aggregates all recorded expenses, categorized for clarity.
- **Total Savings**: Shows the difference between the initial currency balance (from the Settings page) and total expenses.

### 2. Settings Page

Users can set up initial balances for their accounts:

- M-Pesa
- Family Bank
- Equity Bank

This setup is done under the "Initial Currency Setup" section and directly influences the Total Income displayed on the dashboard.

### 3. Transactions Page

- **Expense Table**: Displays a detailed list of all user expenses.
- **Bar Chart Visualization**: Graphically represents expenses by category for easier analysis.

## Accessing the Application

The PENNYWISE application is live and accessible at the following link:

[Deployed Application](https://pennywise-frontend-y27l.onrender.com/)

Simply click the link to start managing your finances effectively!

## Technical Details

### Backend Technologies

- **Flask**: Serves as the web framework.
- **SQLAlchemy**: Handles database interactions.
- **SQLite**: Chosen for cost-effective and lightweight data storage.

## Key Implementations

### CRUD Operations

Fully implemented for the User resource, allowing users to create, read, update, and delete their profiles.

### DashboardResource

Aggregates financial data (total income, expenses, and savings) for the dashboard display.

### Database Setup

Stored in the instance folder for better organization and security.

## Contribution

Contributions are welcome! To contribute:

#### 1. Fork the repository.

#### 2. Create a new branch:
```
   git checkout -b feature/your-feature-name
   ````
#### 3. Commit your changes:
```
   git commit -m "Add your message here"
   ```
#### 4. Push to your branch:
```
   git push origin feature/your-feature-name
   ```
#### 5. Submit a pull request.

## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgments
Flask and SQLAlchemy for their robust frameworks.
OpenAI for assistance with development insights.

## Contact
For questions or support, contact:

- Email: your-email@example.com
- GitHub: your-username


Thank you for using PENNYWISE! Manage your finances wisely and effectively. 😊 ```