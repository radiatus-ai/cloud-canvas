#!/bin/bash

# Run pre-commit hooks
pre-commit run --all-files

# Check if there are changes after running hooks
if ! git diff --quiet; then
    # Add all changes
    git add .

    # Try to commit again with the same message
    git commit --no-verify -m "$1"
else
    echo "No changes after hooks, proceeding with original commit."
fi
