import os
from typing import Any, Dict

import requests
import yaml
from config import config

# Configuration
API_BASE_URL = config.API_BASE_URL
MODULES_DIR = "terraform-modules"

def read_yaml_file(file_path: str) -> Dict[str, Any]:
    with open(file_path, 'r') as file:
        return yaml.safe_load(file)

def convert_yaml_to_package(yaml_data: Dict[str, Any]) -> Dict[str, Any]:
    return {
        "name": yaml_data.get("name", ""),
        "type": yaml_data.get("type", ""),
        "inputs": yaml_data.get("inputs", {}),
        "outputs": yaml_data.get("outputs", {}),
        "parameters": yaml_data.get("parameters", {})
    }

def update_package(package_data: Dict[str, Any]):
    url = f"{API_BASE_URL}/packages/"
    response = requests.post(url, json=package_data)
    if response.status_code == 200:
        print(f"Successfully updated package: {package_data['name']}")
    else:
        print(f"Failed to update package: {package_data['name']}")
        print(f"Status code: {response.status_code}")
        print(f"Response: {response.text}")

def main():
    for root, dirs, files in os.walk(MODULES_DIR):
        for file in files:
            if file.endswith(("infra.yaml", "infra.yml")):
                file_path = os.path.join(root, file)
                print(f"Processing file: {file_path}")
                yaml_data = read_yaml_file(file_path)
                package_data = convert_yaml_to_package(yaml_data)
                update_package(package_data)

if __name__ == "__main__":
    main()
