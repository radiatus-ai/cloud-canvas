import enum
import json
import uuid

from cryptography.fernet import Fernet
from sqlalchemy import Column, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.core.config import settings
from app.db.base_class import Base


class CredentialType(enum.Enum):
    API_KEY = "api_key"
    GITHUB_PAT = "github_pat"
    GCP_SERVICE_ACCOUNT = "gcp_service_account"
    OTHER = "other"


class Credential(Base):
    __tablename__ = "credentials"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, index=True)
    credential_type = Column(String)
    encrypted_data = Column(Text)
    organization_id = Column(
        UUID(as_uuid=True), ForeignKey("organization_references.id"), nullable=False
    )
    organization = relationship("OrganizationReference")

    def set_data(self, data: dict):
        """Encrypt and set the credential data"""
        self.encrypted_data = encrypt(data)

    def get_data(self) -> dict:
        """Decrypt and return the credential data"""
        return decrypt(self.encrypted_data)


def get_fernet():
    return Fernet(settings.CREDENTIAL_ENCRYPTION_KEY.encode())


def encrypt(data: dict) -> str:
    """
    Encrypt the data dictionary.
    """
    fernet = get_fernet()
    return fernet.encrypt(json.dumps(data).encode()).decode()


def decrypt(encrypted_data: str) -> dict:
    """
    Decrypt the encrypted data string back into a dictionary.
    """
    fernet = get_fernet()
    return json.loads(fernet.decrypt(encrypted_data.encode()).decode())
