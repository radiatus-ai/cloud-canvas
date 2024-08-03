import json
import os
from typing import Any, Dict, List, Tuple

from package_utils import DeployStatus
from utils import run_command


def deploy_package(project_id: str, package_id: str, package: Dict, connected_input_data: Dict[str, Any]) -> Tuple[str, List[str], Dict[str, Any]]:
    parameter_data = package.get('parameter_data', {})
    deploy_dir = f'deployments/{package_id}'
    os.makedirs(deploy_dir, exist_ok=True)

    package_type = package.get('type').split('/')[1]
    run_command(f"cp -R terraform-modules/{package_type}/* {deploy_dir}")

    combined_data = {**parameter_data, **connected_input_data}
    params_file_path = f'{deploy_dir}/{package_id}_inputs.auto.tfvars.json'
    with open(params_file_path, 'w') as f:
        json.dump(combined_data, f, indent=2)

    backend_file_path = f'{deploy_dir}/backend.tf'
    bucket_name = 'radiatus-infra-app-package-states'
    prefix = f"projects/{project_id}/packages/{package_id}"
    backend_content = f"""
terraform {{
  backend "gcs" {{
    bucket = "{bucket_name}"
    prefix = "{prefix}"
  }}
}}
"""
    with open(backend_file_path, 'w') as f:
        f.write(backend_content)

    commands = [
        f"echo 'Deployment started for package {package_id}'",
        f"cat {params_file_path}",
        f"cd {deploy_dir} && terraform init",
        f"cd {deploy_dir} && terraform plan",
        f"cd {deploy_dir} && terraform apply -auto-approve",
        "echo 'Deployment completed'"
    ]

    command_outputs = []
    for command in commands:
        output = run_command(command, env_vars={'GITHUB_TOKEN': os.environ.get('GITHUB_TOKEN')})
        command_outputs.append(output)

    output = run_command(f"cd {deploy_dir} && terraform output -json")
    output_json = json.loads(output)

    processed_output = {k: v.get('value', v) for k, v in output_json.items()}

    output_data = {k: processed_output[k] for k in package.get('outputs', {}).get('properties', {}) if k in processed_output}

    output_file_path = f'{deploy_dir}/{package_id}_output.json'
    with open(output_file_path, 'w') as f:
        json.dump(output_data, f, indent=2)

    provisioner_output_file_path = f'{deploy_dir}/{package_id}_provisioner.log'
    with open(provisioner_output_file_path, 'w') as f:
        f.write("\n".join(command_outputs))

    return params_file_path, command_outputs, output_data

def destroy_package(project_id: str, package_id: str, package: Dict, connected_input_data: Dict[str, Any]) -> Tuple[str, List[str]]:
    if package['deploy_status'] == DeployStatus.UNDEPLOYED:
        return '', []

    deploy_dir = f'deployments/{package_id}'
    os.makedirs(deploy_dir, exist_ok=True)

    package_type = package.get('type').split('/')[1]
    run_command(f"cp -R terraform-modules/{package_type}/* {deploy_dir}")

    combined_data = {**package.get('parameter_data', {}), **connected_input_data}
    params_file_path = f'{deploy_dir}/{package_id}_inputs.auto.tfvars.json'
    with open(params_file_path, 'w') as f:
        json.dump(combined_data, f, indent=2)

    backend_file_path = f'{deploy_dir}/backend.tf'
    bucket_name = 'radiatus-infra-app-package-states'
    prefix = f"projects/{project_id}/packages/{package_id}"
    backend_content = f"""
terraform {{
  backend "gcs" {{
    bucket = "{bucket_name}"
    prefix = "{prefix}"
  }}
}}
"""
    with open(backend_file_path, 'w') as f:
        f.write(backend_content)

    commands = [
        f"echo 'Destruction started for package {package_id}'",
        f"cat {params_file_path}",
        f"cd {deploy_dir} && terraform init",
        f"cd {deploy_dir} && terraform plan",
        f"cd {deploy_dir} && terraform destroy -auto-approve",
        "echo 'Destruction completed'"
    ]

    command_outputs = []
    for command in commands:
        output = run_command(command)
        command_outputs.append(output)

    return params_file_path, command_outputs
