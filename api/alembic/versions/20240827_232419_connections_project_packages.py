"""connections project packages

Revision ID: dc9023c4b79c
Revises: 664b594ea9ca
Create Date: 2024-08-27 23:24:19.468347

"""

from typing import Sequence, Union

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "dc9023c4b79c"
down_revision: Union[str, None] = "664b594ea9ca"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(
        "connections_source_package_id_fkey", "connections", type_="foreignkey"
    )
    op.drop_constraint(
        "connections_target_package_id_fkey", "connections", type_="foreignkey"
    )
    op.create_foreign_key(
        None, "connections", "project_packages", ["target_package_id"], ["id"]
    )
    op.create_foreign_key(
        None, "connections", "project_packages", ["source_package_id"], ["id"]
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, "connections", type_="foreignkey")
    op.drop_constraint(None, "connections", type_="foreignkey")
    op.create_foreign_key(
        "connections_target_package_id_fkey",
        "connections",
        "packages",
        ["target_package_id"],
        ["id"],
    )
    op.create_foreign_key(
        "connections_source_package_id_fkey",
        "connections",
        "packages",
        ["source_package_id"],
        ["id"],
    )
    # ### end Alembic commands ###
