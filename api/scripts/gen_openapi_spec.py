import sys
from pathlib import Path

import yaml

# Add the parent directory of 'scripts' to the Python path
sys.path.append(str(Path(__file__).parent.parent))

from fastapi.openapi.utils import get_openapi

from app.main import app

# Update the output file path
output_file = Path(__file__).parent.parent.parent / "data" / "openapi-spec.yaml"

# Ensure the data directory exists
output_file.parent.mkdir(parents=True, exist_ok=True)

# Generate the OpenAPI spec
openapi_spec = get_openapi(
    title=app.title,
    version=app.version,
    openapi_version=app.openapi_version,
    description=app.description,
    routes=app.routes,
)

# Write the spec to a YAML file
with open(output_file, "w") as f:
    yaml.dump(openapi_spec, f, sort_keys=False)

print(f"OpenAPI specification generated at: {output_file}")
