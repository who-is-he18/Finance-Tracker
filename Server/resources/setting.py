from flask_restful import Resource, reqparse
from models.setting import Settings
from db import db

class SettingsResource(Resource):
    def get(self, user_id):
        """Retrieve the settings for a specific user."""
        settings = Settings.query.filter_by(user_id=user_id).first()
        if settings:
            return settings.json(), 200
        return {'message': 'Settings not found'}, 404

    def put(self, user_id):
        """Update the settings for a specific user."""
        parser = reqparse.RequestParser()
        parser.add_argument('mpesa_balance', type=float, required=True, help="M-Pesa balance is required")
        parser.add_argument('family_bank_balance', type=float, required=True, help="Family Bank balance is required")
        parser.add_argument('equity_bank_balance', type=float, required=True, help="Equity Bank balance is required")
        data = parser.parse_args()

        settings = Settings.query.filter_by(user_id=user_id).first()
        if settings:
            settings.mpesa_balance = data['mpesa_balance']
            settings.family_bank_balance = data['family_bank_balance']
            settings.equity_bank_balance = data['equity_bank_balance']
        else:
            settings = Settings(user_id=user_id, **data)

        db.session.add(settings)
        db.session.commit()

        return settings.json(), 201
