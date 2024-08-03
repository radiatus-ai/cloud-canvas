import json
import os
import subprocess
from typing import Dict, Optional


def run_command(command: str, env_vars: Optional[Dict[str, str]] = None) -> str:
    try:
        # Start with the current environment
        env = os.environ.copy()

        # Update with any new environment variables
        if env_vars:
            env.update(env_vars)

        result = subprocess.run(
            command,
            shell=True,
            check=True,
            capture_output=True,
            text=True,
            env=env
        )
        return result.stdout
    except subprocess.CalledProcessError as e:
        return f"Command failed with error: {e.stderr}"

package = {}
package['outputs'] = {
      "type": "object",
      "properties": {
        "organization": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            }
          }
        }
      }
    }
deploy_dir = 'deployments/d623c64a-e1dc-4cd5-b167-87949764d59f'
output = run_command(f"cd {deploy_dir} && terraform output -json")
output_json = json.loads(output)
print('output json')
print(output_json)
# update output_data
output_data = {}
for output_k in package['outputs']['properties']:
    output_data[output_k] = output_json[output_k]
print(output_data)
