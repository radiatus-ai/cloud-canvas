from datetime import datetime
from typing import Any, Dict, List

from fastapi import APIRouter, HTTPException
from gcs_service import GCSService
from pydantic import BaseModel, Field

router = APIRouter(
    prefix='/packages',
    tags=['packages'],
)

class PackageBase(BaseModel):
    name: str
    type: str
    inputs: Dict[str, Any] = Field(default_factory=dict)
    outputs: Dict[str, Any] = Field(default_factory=dict)
    parameters: Dict[str, Any] = Field(default_factory=dict)

class Package(PackageBase):
    id: str
    created_at: datetime
    updated_at: datetime

class PackageCreateOrUpdate(PackageBase):
    pass

PACKAGE_FILE = 'packages.json'
gcs_service = GCSService(project_id='radiatus-gcp-project', bucket_name='radiatus-infra-app-db')

@router.get("/", response_model=List[Package])
async def list_packages():
    packages = gcs_service.read_json_file(PACKAGE_FILE)
    if packages is None:
        return []
    return [Package(**package) for package in packages]

@router.post("/", response_model=Package)
async def create_or_update_package(package: PackageCreateOrUpdate):
    packages = gcs_service.read_json_file(PACKAGE_FILE) or []
    existing_package = next((p for p in packages if p['name'] == package.name), None)

    if existing_package:
        # Merge and update existing package
        updated_package = {**existing_package, **package.dict(), 'updated_at': datetime.now().isoformat()}
        if gcs_service.update_item_in_json_file(PACKAGE_FILE, existing_package['id'], updated_package):
            return Package(**updated_package)
        raise HTTPException(status_code=500, detail="Failed to update package")
    else:
        # Create new package
        new_package = package.dict()
        # new_package['id'] = gcs_service.generate_id()
        # new_package['created_at'] = datetime.now().isoformat()
        # new_package['updated_at'] = new_package['created_at']

        if gcs_service.append_to_json_file(PACKAGE_FILE, new_package):
            return Package(**new_package)
        raise HTTPException(status_code=500, detail="Failed to create package")

@router.get("/{package_id}", response_model=Package)
async def get_package(package_id: str):
    packages = gcs_service.read_json_file(PACKAGE_FILE)
    if packages:
        package = next((p for p in packages if p['id'] == package_id), None)
        if package:
            return Package(**package)
    raise HTTPException(status_code=404, detail="Package not found")

@router.delete("/{package_id}")
async def delete_package(package_id: str):
    if gcs_service.delete_item_from_json_file(PACKAGE_FILE, package_id):
        return {"message": "Package deleted successfully"}
    raise HTTPException(status_code=404, detail="Package not found")
