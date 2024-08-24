import os
from typing import Any, Dict, List

import requests
import yaml


def read_yaml_file(file_path: str) -> Dict[str, Any]:
    with open(file_path, "r") as file:
        return yaml.safe_load(file)


def convert_yaml_to_package(yaml_data: Dict[str, Any]) -> Dict[str, Any]:
    return {
        "name": yaml_data.get("name", ""),
        "type": yaml_data.get("type", ""),
        "inputs": yaml_data.get("inputs", {}),
        "outputs": yaml_data.get("outputs", {}),
        "parameters": yaml_data.get("parameters", {}),
        # this script uploads global packages, not project packages
        # "project_id": project_id
    }


def create_package(api_base_url: str, package_data: Dict[str, Any]) -> Dict[str, Any]:
    url = f"{api_base_url}/packages/"
    headers = {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MjQ1MTA3NzMsInN1YiI6IjRlN2Y1ZGEwLWM3ZWItNDA4OC04OTNjLWE2YzlhZmQyZTc0YSJ9.7Xw-tM0GtUCzA6bzbo0NKpnYmj4szg8fS_rxLSXcoX0"
    }
    response = requests.post(url, json=package_data, headers=headers)
    response.raise_for_status()
    return response.json()


def upload_packages(api_base_url: str, modules_dir: str) -> List[Dict[str, Any]]:
    uploaded_packages = []

    for root, _, files in os.walk(modules_dir):
        for file in files:
            if file.endswith(("infra.yaml", "infra.yml")):
                file_path = os.path.join(root, file)
                print(f"Processing file: {file_path}")

                yaml_data = read_yaml_file(file_path)
                package_data = convert_yaml_to_package(yaml_data)

                try:
                    created_package = create_package(api_base_url, package_data)
                    uploaded_packages.append(created_package)
                    print(f"Successfully created package: {created_package['name']}")
                except requests.RequestException as e:
                    print(f"Failed to create package: {package_data['name']}")
                    print(f"Error: {str(e)}")

    return uploaded_packages


# Example usage
if __name__ == "__main__":
    API_BASE_URL = "http://localhost:8000"
    MODULES_DIR = "terraform-modules"

    uploaded_packages = upload_packages(API_BASE_URL, MODULES_DIR)
    print(f"Total packages uploaded: {len(uploaded_packages)}")
