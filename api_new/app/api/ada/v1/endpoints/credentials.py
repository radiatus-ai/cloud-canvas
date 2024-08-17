# app/api/v1/endpoints/credentials.py

from typing import List

from fastapi import APIRouter, Depends, HTTPException

from app.core.dependencies import get_db_and_current_user
from app.crud.credential import credential
from app.schemas.credential import Credential, CredentialCreate, CredentialUpdate

router = APIRouter(
    prefix="/credentials",
    tags=["credentials"],
)


@router.post("/", response_model=Credential)
async def create_credential(
    *,
    credential_in: CredentialCreate,
    deps: dict = Depends(get_db_and_current_user),
):
    """
    Create a new credential.
    """
    db = deps["db"]
    current_user = deps["current_user"]
    # Check if the user has permission to create credentials for their organization
    # if not current_user.is_superuser and not current_user.can_manage_credentials:
    #     raise HTTPException(status_code=403, detail="Not enough permissions")

    # Check if a credential with the same name already exists for this organization
    existing_credential = await credential.get_by_name_and_organization(
        db, name=credential_in.name, organization_id=current_user.organization_id
    )
    if existing_credential:
        raise HTTPException(
            status_code=400, detail="Credential with this name already exists"
        )

    new_credential = await credential.create_with_organization(
        db, obj_in=credential_in, organization_id=current_user.organization_id
    )
    return new_credential


@router.get("/", response_model=List[Credential])
async def read_credentials(
    skip: int = 0,
    limit: int = 100,
    deps: dict = Depends(get_db_and_current_user),
):
    """
    Retrieve credentials.
    """
    db = deps["db"]
    current_user = deps["current_user"]
    credentials = await credential.get_multi_by_organization(
        db, organization_id=current_user.organization_id, skip=skip, limit=limit
    )
    return credentials


@router.get("/{credential_id}", response_model=Credential)
async def read_credential(
    *,
    credential_id: int,
    deps: dict = Depends(get_db_and_current_user),
):
    """
    Get a specific credential by ID.
    """
    db = deps["db"]
    current_user = deps["current_user"]
    cred = await credential.get(db, id=credential_id)
    if not cred:
        raise HTTPException(status_code=404, detail="Credential not found")
    if cred.organization_id != current_user.organization_id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return cred


@router.put("/{credential_id}", response_model=Credential)
async def update_credential(
    *,
    credential_id: int,
    credential_in: CredentialUpdate,
    deps: dict = Depends(get_db_and_current_user),
):
    """
    Update a credential.
    """
    db = deps["db"]
    current_user = deps["current_user"]
    cred = await credential.get(db, id=credential_id)
    if not cred:
        raise HTTPException(status_code=404, detail="Credential not found")
    if cred.organization_id != current_user.organization_id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    # if not current_user.is_superuser and not current_user.can_manage_credentials:
    #     raise HTTPException(status_code=403, detail="Not enough permissions")

    cred = await credential.update(db, db_obj=cred, obj_in=credential_in)
    return cred


@router.delete("/{credential_id}", response_model=Credential)
async def delete_credential(
    *,
    credential_id: int,
    deps: dict = Depends(get_db_and_current_user),
):
    """
    Delete a credential.
    """
    db = deps["db"]
    current_user = deps["current_user"]
    cred = await credential.get(db, id=credential_id)
    if not cred:
        raise HTTPException(status_code=404, detail="Credential not found")
    if cred.organization_id != current_user.organization_id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    # if not current_user.is_superuser and not current_user.can_manage_credentials:
    #     raise HTTPException(status_code=403, detail="Not enough permissions")

    cred = await credential.remove(db, id=credential_id)
    return cred
