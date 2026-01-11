#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
SPECS_DIR="$WORKSPACE_ROOT/specs"

# Default to merlot, can be overridden with DATTO_PLATFORM env var
PLATFORM="${DATTO_PLATFORM:-merlot}"
SPEC_URL="https://${PLATFORM}-api.centrastage.net/api/v3/api-docs/Datto-RMM"
OUTPUT_FILE="$SPECS_DIR/datto-rmm-openapi.json"

echo "Fetching OpenAPI spec from $PLATFORM..."
echo "URL: $SPEC_URL"

mkdir -p "$SPECS_DIR"

# Fetch and format JSON
if ! curl -sf "$SPEC_URL" | jq '.' > "$OUTPUT_FILE.tmp"; then
    echo "Error: Failed to fetch or parse OpenAPI spec"
    rm -f "$OUTPUT_FILE.tmp"
    exit 1
fi

# Check if spec changed
if [ -f "$OUTPUT_FILE" ]; then
    OLD_HASH=$(sha256sum "$OUTPUT_FILE" | cut -d' ' -f1)
    NEW_HASH=$(sha256sum "$OUTPUT_FILE.tmp" | cut -d' ' -f1)

    if [ "$OLD_HASH" = "$NEW_HASH" ]; then
        echo "Spec unchanged (hash: ${OLD_HASH:0:12}...)"
        rm "$OUTPUT_FILE.tmp"
        exit 0
    fi

    echo "Spec changed!"
    echo "  Old hash: ${OLD_HASH:0:12}..."
    echo "  New hash: ${NEW_HASH:0:12}..."
fi

mv "$OUTPUT_FILE.tmp" "$OUTPUT_FILE"
echo "Spec saved to $OUTPUT_FILE"

# Show some stats about the spec
PATHS_COUNT=$(jq '.paths | length' "$OUTPUT_FILE")
SCHEMAS_COUNT=$(jq '.components.schemas | length' "$OUTPUT_FILE")
VERSION=$(jq -r '.info.version' "$OUTPUT_FILE")

echo ""
echo "Spec details:"
echo "  Version: $VERSION"
echo "  Endpoints: $PATHS_COUNT"
echo "  Schemas: $SCHEMAS_COUNT"
