from enum import Enum
from typing import Any, Dict

from fastapi import HTTPException
from gcs_service import GCSService


class DeployStatus(str, Enum):
    UNDEPLOYED = "undeployed"
    DEPLOYING = "deploying"
    DEPLOYED = "deployed"
    DESTROYING = "destroying"
    FAILED = "failed"

gcs_service = GCSService(project_id='radiatus-gcp-project', bucket_name='radiatus-infra-app-db')

def get_project_packages_file_name(project_id: str) -> str:
    return f'project/{project_id}/packages.json'

def get_connections_file_name(project_id: str) -> str:
    return f'project/{project_id}/connections.json'

def get_package_data(project_id: str, package_id: str) -> Dict:
    packages_file = get_project_packages_file_name(project_id)
    packages_data = gcs_service.read_json_file(packages_file)
    if not packages_data:
        raise HTTPException(status_code=404, detail="No packages found for this project")

    package = next((p for p in packages_data if p['id'] == package_id), None)
    if not package:
        raise HTTPException(status_code=404, detail="Package not found in this project")

    return package

def get_connected_input_data(project_id: str, package_id: str) -> Dict[str, Any]:
    packages_file = get_project_packages_file_name(project_id)
    packages_data = gcs_service.read_json_file(packages_file)
    connections_file = get_connections_file_name(project_id)
    connections_data = gcs_service.read_json_file(connections_file)
    if connections_data is None:
        connections_data = []

    related_connections = [
        conn for conn in connections_data
        if conn['target'] == package_id
    ]

    connected_input_data = {}

    for conn in related_connections:
        source_package_id = conn['source']
        source_package = next((p for p in packages_data if p['id'] == source_package_id), None)

        if source_package and 'output_data' in source_package:
            source_handle = conn['sourceHandle']
            target_handle = conn['targetHandle']

            if source_handle in source_package['output_data']:
                connected_input_data[target_handle] = source_package['output_data'][source_handle]

    return connected_input_data

def update_package_status(project_id: str, package_id: str, status: DeployStatus, output_data: Dict[str, Any] = None):
    packages_file = get_project_packages_file_name(project_id)
    package = get_package_data(project_id, package_id)
    package['deploy_status'] = status
    if output_data is not None:
        package['output_data'] = output_data
    gcs_service.update_item_in_json_file(packages_file, package_id, package)

def handle_deployment_error(project_id: str, package_id: str, error: Exception):
    update_package_status(project_id, package_id, DeployStatus.FAILED)
    return {
        "message": f"Package {package_id} has failed to deploy for {project_id}. Error: {str(error)}",
        "status": "failed",
        "command_outputs": [],
        "deploy_status": DeployStatus.FAILED
    }

def delete_package_entry(project_id: str, package_id: str):
    packages_file = get_project_packages_file_name(project_id)
    package = get_package_data(project_id, package_id)
    if package.get('deploy_status') is None:
      package['deploy_status'] = DeployStatus.UNDEPLOYED

    if package.get('deploy_status') != DeployStatus.UNDEPLOYED:
        raise HTTPException(status_code=400, detail="Cannot delete deployed package. Tear down infrastructure first.")
    gcs_service.delete_item_from_json_file(packages_file, package_id)

def handle_teardown_error(project_id: str, package_id: str, error: Exception):
    update_package_status(project_id, package_id, DeployStatus.FAILED)
    return {
        "message": f"Package {package_id} has failed to tear down for {project_id}. Error: {str(error)}",
        "status": "failed",
        "command_outputs": [],
        "deploy_status": DeployStatus.FAILED
    }
