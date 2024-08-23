from typing import List

from fastapi import APIRouter, Depends, HTTPException
from pydantic import UUID4

from app.core.dependencies import get_db_and_current_user
from app.crud.credential import credential as crud_credential
from app.schemas.credential import Credential, CredentialCreate, CredentialUpdate

router = APIRouter()


@router.get(
    "/organizations/{organization_id}/credentials/", response_model=List[Credential]
)
async def list_credentials(
    organization_id: UUID4,
    skip: int = 0,
    limit: int = 100,
    deps: dict = Depends(get_db_and_current_user),
):
    db = deps["db"]
    return await crud_credential.get_credentials_by_organization(
        db, organization_id=organization_id, skip=skip, limit=limit
    )


@router.post("/organizations/{organization_id}/credentials/", response_model=Credential)
async def create_credential(
    organization_id: UUID4,
    credential: CredentialCreate,
    deps: dict = Depends(get_db_and_current_user),
):
    db = deps["db"]
    return await crud_credential.create_credential(
        db, obj_in=credential, organization_id=organization_id
    )


@router.get(
    "/organizations/{organization_id}/credentials/{credential_id}",
    response_model=Credential,
)
async def get_credential(
    organization_id: UUID4,
    credential_id: UUID4,
    deps: dict = Depends(get_db_and_current_user),
):
    db = deps["db"]
    credential = await crud_credential.get_credential(db, id=credential_id)
    if not credential or credential.organization_id != organization_id:
        raise HTTPException(status_code=404, detail="Credential not found")
    return credential


@router.patch(
    "/organizations/{organization_id}/credentials/{credential_id}",
    response_model=Credential,
)
async def update_credential(
    organization_id: UUID4,
    credential_id: UUID4,
    credential: CredentialUpdate,
    deps: dict = Depends(get_db_and_current_user),
):
    db = deps["db"]
    db_credential = await crud_credential.get_credential(db, id=credential_id)
    if not db_credential or db_credential.organization_id != organization_id:
        raise HTTPException(status_code=404, detail="Credential not found")
    return await crud_credential.update(db, db_obj=db_credential, obj_in=credential)


@router.delete(
    "/organizations/{organization_id}/credentials/{credential_id}",
    response_model=Credential,
)
async def delete_credential(
    organization_id: UUID4,
    credential_id: UUID4,
    deps: dict = Depends(get_db_and_current_user),
):
    db = deps["db"]
    credential = await crud_credential.get_credential(db, id=credential_id)
    if not credential or credential.organization_id != organization_id:
        raise HTTPException(status_code=404, detail="Credential not found")
    return await crud_credential.delete_credential(db, id=credential_id)
