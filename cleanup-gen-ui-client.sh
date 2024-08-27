#!/bin/bash

# Path to your ApiClient.js file
file_path="ui/canvas-client/src/ApiClient.js"

# Temporary file
temp_file=$(mktemp)

# Use awk to comment out the specified lines
awk '
    /request\.end\(\(error, response\) => {/,/}\);/ {
        print "        // " $0
        next
    }
    { print }
' "$file_path" > "$temp_file"

# Replace the original file with the modified version
mv "$temp_file" "$file_path"

echo "The specified part of $file_path has been commented out."
