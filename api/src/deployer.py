import json
import logging
import os
from typing import Any, Dict, List, Tuple

from config import config
from package_utils import DeployStatus
from utils import run_command

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def deploy_package(project_id: str, package_id: str, package: Dict, connected_input_data: Dict[str, Any]) -> Tuple[str, List[str], Dict[str, Any]]:
    logger.info(f"Starting deployment for package {package_id} in project {project_id}")

    parameter_data = package.get('parameter_data', {})
    deploy_dir = f'deployments/{package_id}'
    os.makedirs(deploy_dir, exist_ok=True)
    logger.info(f"Created deployment directory: {deploy_dir}")

    package_type = package.get('type').split('/')[1]
    run_command(f"cp -R terraform-modules/{package_type}/* {deploy_dir}")
    logger.info(f"Copied terraform module files for package type: {package_type}")

    combined_data = {**parameter_data, **connected_input_data}
    params_file_path = f'{deploy_dir}/{package_id}_inputs.auto.tfvars.json'
    with open(params_file_path, 'w') as f:
        json.dump(combined_data, f, indent=2)
    logger.info(f"Created parameter file: {params_file_path}")

    backend_file_path = f'{deploy_dir}/backend.tf'
    bucket_name = config.BUCKET_NAME
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
    logger.info(f"Created backend configuration file: {backend_file_path}")

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
        logger.info(f"Executing command: {command}")
        output = run_command(command, env_vars={'GITHUB_TOKEN': os.environ.get('GITHUB_TOKEN')})
        command_outputs.append(output)
        logger.info(f"Command output: {output[:200]}...")  # Log first 200 characters of output

    logger.info("Retrieving terraform outputs")
    output = run_command(f"cd {deploy_dir} && terraform output -json")
    output_json = json.loads(output)

    processed_output = {k: v.get('value', v) for k, v in output_json.items()}
    logger.info(f"Processed terraform outputs: {processed_output}")

    output_data = {k: processed_output[k] for k in package.get('outputs', {}).get('properties', {}) if k in processed_output}
    logger.info(f"Final output data: {output_data}")

    output_file_path = f'{deploy_dir}/{package_id}_output.json'
    with open(output_file_path, 'w') as f:
        json.dump(output_data, f, indent=2)
    logger.info(f"Wrote output data to file: {output_file_path}")

    provisioner_output_file_path = f'{deploy_dir}/{package_id}_provisioner.log'
    with open(provisioner_output_file_path, 'w') as f:
        f.write("\n".join(command_outputs))
    logger.info(f"Wrote provisioner logs to file: {provisioner_output_file_path}")

    logger.info(f"Deployment completed successfully for package {package_id} in project {project_id}")
    return params_file_path, command_outputs, output_data

def destroy_package(project_id: str, package_id: str, package: Dict, connected_input_data: Dict[str, Any]) -> Tuple[str, List[str]]:
    logger.info(f"Starting destruction for package {package_id} in project {project_id}")

    if package['deploy_status'] == DeployStatus.UNDEPLOYED:
        logger.info(f"Package {package_id} is already undeployed. No action needed.")
        return '', []

    deploy_dir = f'deployments/{package_id}'
    os.makedirs(deploy_dir, exist_ok=True)
    logger.info(f"Created deployment directory: {deploy_dir}")

    package_type = package.get('type').split('/')[1]
    run_command(f"cp -R terraform-modules/{package_type}/* {deploy_dir}")
    logger.info(f"Copied terraform module files for package type: {package_type}")

    combined_data = {**package.get('parameter_data', {}), **connected_input_data}
    params_file_path = f'{deploy_dir}/{package_id}_inputs.auto.tfvars.json'
    with open(params_file_path, 'w') as f:
        json.dump(combined_data, f, indent=2)
    logger.info(f"Created parameter file: {params_file_path}")

    backend_file_path = f'{deploy_dir}/backend.tf'
    bucket_name = config.BUCKET_NAME
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
    logger.info(f"Created backend configuration file: {backend_file_path}")

    commands = [
        f"echo 'Destruction started for package {package_id}'",
        f"cat {params_file_path}",
        f"cd {deploy_dir} && terraform init",
        f"cd {deploy_dir} && terraform plan -destroy",
        f"cd {deploy_dir} && terraform destroy -auto-approve",
        "echo 'Destruction completed'"
    ]

    command_outputs = []
    for command in commands:
        logger.info(f"Executing command: {command}")
        output = run_command(command)
        command_outputs.append(output)
        logger.info(f"Command output: {output[:200]}...")  # Log first 200 characters of output

    logger.info(f"Destruction completed successfully for package {package_id} in project {project_id}")
    return params_file_path, command_outputs
