from uuid import UUID

import pytest
from sqlalchemy.future import select

from app.crud.credential import credential as crud_credential
from app.models.credential import Credential, CredentialType
from app.models.organization_reference import OrganizationReference
from app.schemas.credential import CredentialCreate


@pytest.mark.asyncio
async def test_create_credential(async_session_test):
    # Create an OrganizationReference instead of using Organization
    org_ref = OrganizationReference(
        id=UUID("2320a0d6-8cbb-4727-8f33-6573d017d980"), name="Test Org"
    )
    async_session_test.add(org_ref)
    await async_session_test.flush()

    # Prepare test data
    credential_in = CredentialCreate(
        name="Test API Key",
        credential_type=CredentialType.API_KEY,
        data={"api_key": "test_key_123"},
        organization_id=org_ref.id,
    )

    # Call the create_credential method
    credential = await crud_credential.create(async_session_test, obj_in=credential_in)

    # Assert credential was created
    assert credential.id is not None
    assert isinstance(credential.id, UUID)
    assert credential.name == "Test API Key"
    assert credential.credential_type == CredentialType.API_KEY
    assert credential.organization_id == org_ref.id

    # Verify the credential data is encrypted
    assert credential.encrypted_data is not None
    assert credential.encrypted_data != '{"api_key": "test_key_123"}'

    # Verify we can retrieve and decrypt the data
    decrypted_data = credential.get_data()
    assert decrypted_data == {"api_key": "test_key_123"}

    # Verify the total number of credentials
    result = await async_session_test.execute(select(Credential))
    credentials = result.scalars().all()
    assert len(credentials) == 1


@pytest.mark.asyncio
async def test_get_credential(async_session_test):
    # First, create an OrganizationReference and a credential
    org_ref = OrganizationReference(
        id=UUID("2320a0d6-8cbb-4727-8f33-6573d017d980"), name="Test Org"
    )
    async_session_test.add(org_ref)
    await async_session_test.flush()

    credential_in = CredentialCreate(
        name="Get Test Credential",
        credential_type=CredentialType.GITHUB_PAT,
        data={"token": "github_pat_123"},
        organization_id=org_ref.id,
    )
    created_credential = await crud_credential.create(
        async_session_test, obj_in=credential_in
    )

    # Now, try to get the credential by id
    retrieved_credential = await crud_credential.get(
        async_session_test, id=created_credential.id
    )

    assert retrieved_credential is not None
    assert retrieved_credential.id == created_credential.id
    assert retrieved_credential.name == "Get Test Credential"
    assert retrieved_credential.credential_type == CredentialType.GITHUB_PAT
    assert retrieved_credential.get_data() == {"token": "github_pat_123"}


@pytest.mark.asyncio
async def test_get_credentials_by_organization(async_session_test):
    # First, create an OrganizationReference and multiple credentials for it
    org_ref = OrganizationReference(
        id=UUID("2320a0d6-8cbb-4727-8f33-6573d017d980"), name="Test Org"
    )
    async_session_test.add(org_ref)
    await async_session_test.flush()

    credential_data = [
        {
            "name": "Cred 1",
            "credential_type": CredentialType.API_KEY,
            "data": {"key": "1"},
        },
        {
            "name": "Cred 2",
            "credential_type": CredentialType.GITHUB_PAT,
            "data": {"token": "2"},
        },
        {
            "name": "Cred 3",
            "credential_type": CredentialType.GCP_SERVICE_ACCOUNT,
            "data": {"json": "3"},
        },
    ]

    for data in credential_data:
        await crud_credential.create(
            async_session_test,
            obj_in=CredentialCreate(**data, organization_id=org_ref.id),
        )

    # Now, get all credentials for the organization
    credentials = await crud_credential.get_multi_by_organization(
        async_session_test, organization_id=org_ref.id
    )

    assert len(credentials) == 3
    assert {cred.name for cred in credentials} == {"Cred 1", "Cred 2", "Cred 3"}
    assert {cred.credential_type for cred in credentials} == {
        CredentialType.API_KEY,
        CredentialType.GITHUB_PAT,
        CredentialType.GCP_SERVICE_ACCOUNT,
    }
