"""Create settings table

Revision ID: c27fba6f8b3f
Revises: 7026bcefe799
Create Date: 2025-01-02 08:29:39.094993

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c27fba6f8b3f'
down_revision = '7026bcefe799'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('settings',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('mpesa_balance', sa.Float(), nullable=True),
    sa.Column('family_bank_balance', sa.Float(), nullable=True),
    sa.Column('equity_bank_balance', sa.Float(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('settings')
    # ### end Alembic commands ###
