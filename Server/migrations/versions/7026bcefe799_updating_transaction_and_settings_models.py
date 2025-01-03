"""updating transaction and settings models

Revision ID: 7026bcefe799
Revises: 6d8d023cb902
Create Date: 2025-01-02 08:19:56.345944

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '7026bcefe799'
down_revision = '6d8d023cb902'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('settings')
    with op.batch_alter_table('transactions', schema=None) as batch_op:
        batch_op.add_column(sa.Column('user_id', sa.Integer(), nullable=False))
        batch_op.alter_column('category',
               existing_type=sa.VARCHAR(length=80),
               type_=sa.String(length=100),
               existing_nullable=False)
        batch_op.alter_column('description',
               existing_type=sa.VARCHAR(length=255),
               type_=sa.String(length=200),
               existing_nullable=True)
        batch_op.alter_column('date',
               existing_type=postgresql.TIMESTAMP(),
               nullable=False)
        batch_op.create_foreign_key(None, 'users', ['user_id'], ['id'])
        batch_op.drop_column('source')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('transactions', schema=None) as batch_op:
        batch_op.add_column(sa.Column('source', sa.VARCHAR(length=80), autoincrement=False, nullable=False))
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.alter_column('date',
               existing_type=postgresql.TIMESTAMP(),
               nullable=True)
        batch_op.alter_column('description',
               existing_type=sa.String(length=200),
               type_=sa.VARCHAR(length=255),
               existing_nullable=True)
        batch_op.alter_column('category',
               existing_type=sa.String(length=100),
               type_=sa.VARCHAR(length=80),
               existing_nullable=False)
        batch_op.drop_column('user_id')

    op.create_table('settings',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('mpesa_balance', sa.DOUBLE_PRECISION(precision=53), autoincrement=False, nullable=True),
    sa.Column('family_bank_balance', sa.DOUBLE_PRECISION(precision=53), autoincrement=False, nullable=True),
    sa.Column('equity_bank_balance', sa.DOUBLE_PRECISION(precision=53), autoincrement=False, nullable=True),
    sa.PrimaryKeyConstraint('id', name='settings_pkey')
    )
    # ### end Alembic commands ###
