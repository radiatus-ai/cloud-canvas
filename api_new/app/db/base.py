# ruff: noqa
# app/db/base.py

# Import all the models, so that Base has them before being
# imported by Alembic
# Import any other models here

from app.db.base_class import Base
from app.models import (
    APIToken,
    ChatMessage,
    Chat,
    Credential,
    # Organization,
    OrganizationReference,
    Project,
    # User,
    UserReference,
)

# You can also import and register your models automatically:
# import pkgutil
# import importlib
# import app.models
#
# for _, model_name, _ in pkgutil.iter_modules(app.models.__path__):
#     importlib.import_module(f'app.models.{model_name}')
