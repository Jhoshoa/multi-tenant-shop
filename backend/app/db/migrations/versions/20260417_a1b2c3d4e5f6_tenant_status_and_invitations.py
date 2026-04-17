"""tenant status and invitations

Revision ID: a1b2c3d4e5f6
Revises: 4ec138fa636e
Create Date: 2026-04-17 00:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = 'a1b2c3d4e5f6'
down_revision: Union[str, None] = '4ec138fa636e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add status and rejected_reason to tenants
    # Default existing rows to 'active' since they were created before the approval flow
    op.add_column('tenants', sa.Column('status', sa.String(length=20), nullable=False, server_default='active'))
    op.add_column('tenants', sa.Column('rejected_reason', sa.Text(), nullable=True))
    op.alter_column('tenants', 'status', server_default=None)

    op.create_index('ix_tenants_status', 'tenants', ['status'], unique=False)

    # Create invitations table
    op.create_table(
        'invitations',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('tenant_id', sa.UUID(), nullable=False),
        sa.Column('created_by', sa.UUID(), nullable=True),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('role', sa.String(length=20), nullable=False),
        sa.Column('token', sa.String(length=64), nullable=False),
        sa.Column('expires_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('consumed_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['tenant_id'], ['tenants.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['created_by'], ['users.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('token'),
    )
    op.create_index('ix_invitations_tenant_id', 'invitations', ['tenant_id'], unique=False)
    op.create_index('ix_invitations_email', 'invitations', ['email'], unique=False)
    op.create_index('ix_invitations_token', 'invitations', ['token'], unique=True)


def downgrade() -> None:
    op.drop_index('ix_invitations_token', table_name='invitations')
    op.drop_index('ix_invitations_email', table_name='invitations')
    op.drop_index('ix_invitations_tenant_id', table_name='invitations')
    op.drop_table('invitations')

    op.drop_index('ix_tenants_status', table_name='tenants')
    op.drop_column('tenants', 'rejected_reason')
    op.drop_column('tenants', 'status')
