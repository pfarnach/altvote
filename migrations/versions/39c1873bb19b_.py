"""empty message

Revision ID: 39c1873bb19b
Revises: None
Create Date: 2016-03-27 00:45:19.855982

"""

# revision identifiers, used by Alembic.
revision = '39c1873bb19b'
down_revision = None

from alembic import op
import sqlalchemy as sa
from sqlalchemy.sql import table, column


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.add_column('ballot', sa.Column('admin_id', sa.Integer(), nullable=True))
    op.add_column('ballot', sa.Column('type', sa.String(), nullable=True))

    # Select new columns
    ballot_admin_id = table('ballot', column('admin_id'))
    ballot_type = table('ballot', column('type'))

    # Add default values to columns
    op.execute(ballot_admin_id.update().values(admin_id=0))
    op.execute(ballot_type.update().values(type='instant_runoff'))

    # Set these new columns to nullable=False (required)
    op.alter_column('ballot', 'admin_id', nullable=False)
    op.alter_column('ballot', 'type', nullable=False)

    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('ballot', 'type')
    op.drop_column('ballot', 'admin_id')
    ### end Alembic commands ###
