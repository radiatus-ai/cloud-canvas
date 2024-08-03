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

