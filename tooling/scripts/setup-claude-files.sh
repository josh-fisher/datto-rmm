#!/bin/bash
# setup-claude-files.sh
# Copies AI documentation from .ai-docs/ to .claude/ for Claude Code consumption
# This solves Windows symlink issues and maintains .ai-docs as single source of truth

set -e

# Get workspace root (parent of tooling/scripts directory)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Source and destination directories
AI_DOCS_DIR="$WORKSPACE_ROOT/.ai-docs"
CLAUDE_DIR="$WORKSPACE_ROOT/.claude"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Setting up Claude files...${NC}"
echo "Workspace: $WORKSPACE_ROOT"

# Create destination directories
mkdir -p "$CLAUDE_DIR/agents"
mkdir -p "$CLAUDE_DIR/commands"

# Counter for copied files
agents_copied=0
commands_copied=0

# Copy chatmodes to agents
# .ai-docs/chatmodes/*.chatmode.md -> .claude/agents/*.md
if [ -d "$AI_DOCS_DIR/chatmodes" ]; then
    shopt -s nullglob
    for chatmode_file in "$AI_DOCS_DIR/chatmodes"/*.chatmode.md; do
        basename_file=$(basename "$chatmode_file")
        # Remove .chatmode.md extension, add .md
        target_name="${basename_file%.chatmode.md}.md"
        target_path="$CLAUDE_DIR/agents/$target_name"
        cp "$chatmode_file" "$target_path"
        echo -e "  ${GREEN}✓${NC} agents/$target_name"
        ((agents_copied++)) || true
    done
    shopt -u nullglob
fi

# Copy prompts to commands
# .ai-docs/prompts/*.prompt.md -> .claude/commands/*.md
if [ -d "$AI_DOCS_DIR/prompts" ]; then
    shopt -s nullglob
    for prompt_file in "$AI_DOCS_DIR/prompts"/*.prompt.md; do
        basename_file=$(basename "$prompt_file")
        # Remove .prompt.md extension, add .md
        target_name="${basename_file%.prompt.md}.md"
        target_path="$CLAUDE_DIR/commands/$target_name"
        cp "$prompt_file" "$target_path"
        echo -e "  ${GREEN}✓${NC} commands/$target_name"
        ((commands_copied++)) || true
    done
    shopt -u nullglob
fi

echo ""
echo -e "${GREEN}Claude files setup complete!${NC}"
echo "  Agents copied: $agents_copied"
echo "  Commands copied: $commands_copied"

if [ $agents_copied -eq 0 ] && [ $commands_copied -eq 0 ]; then
    echo -e "${YELLOW}Note: No chatmode or prompt files found in .ai-docs/${NC}"
    echo "  Add files to:"
    echo "    - .ai-docs/chatmodes/*.chatmode.md (for agents)"
    echo "    - .ai-docs/prompts/*.prompt.md (for commands)"
fi
