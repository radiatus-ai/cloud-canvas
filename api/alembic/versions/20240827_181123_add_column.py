"""add column

Revision ID: 664b594ea9ca
Revises: 14da7f07a83a
Create Date: 2024-08-27 18:11:23.392587

"""

from typing import Sequence, Union

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "664b594ea9ca"
down_revision: Union[str, None] = "14da7f07a83a"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create Enum type
    projectpackagestatus = postgresql.ENUM(
        "NOT_DEPLOYED",
        "DEPLOYING",
        "DESTROYING",
        "DEPLOYED",
        "FAILED",
        name="projectpackagestatus",
    )
    projectpackagestatus.create(op.get_bind())

    # Add column
    op.add_column(
        "project_packages",
        sa.Column(
            "deploy_status",
            projectpackagestatus,
            nullable=False,
            server_default="NOT_DEPLOYED",
        ),
    )


def downgrade() -> None:
    # Drop column
    op.drop_column("project_packages", "deploy_status")

    # Drop Enum type
    op.execute("DROP TYPE projectpackagestatus")
