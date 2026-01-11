#!/usr/bin/env bash
# Validate AI Agent Documentation Sync
#
# This script checks that all instruction files are properly referenced
# in CLAUDE.md and that chatmodes/prompts are synced to .claude/

set -e

# Colors for output
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly NC='\033[0m' # No Color

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$REPO_ROOT"

echo "🔍 Validating AI Agent Documentation..."
echo ""

# Track overall validation status
VALIDATION_PASSED=true

# =============================================================================
# Count Files
# =============================================================================

# Count instruction files
INSTRUCTION_COUNT=$(find .ai-docs/instructions -name "*.instructions.md" 2>/dev/null | wc -l | tr -d ' ')
CLAUDE_IMPORT_COUNT=$(grep -c "@.ai-docs/instructions/.*\.instructions\.md" .claude/CLAUDE.md 2>/dev/null || echo "0")

# Count chatmodes and prompts
CHATMODES_COUNT=$(find .ai-docs/chatmodes -name "*.chatmode.md" 2>/dev/null | wc -l | tr -d ' ')
PROMPTS_COUNT=$(find .ai-docs/prompts -name "*.prompt.md" 2>/dev/null | wc -l | tr -d ' ')

# Count generated files
CLAUDE_AGENTS_COUNT=$(find .claude/agents -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
CLAUDE_COMMANDS_COUNT=$(find .claude/commands -name "*.md" 2>/dev/null | wc -l | tr -d ' ')

echo "📊 File Counts:"
echo ""
echo "  Instructions:"
echo "    .ai-docs/instructions:  $INSTRUCTION_COUNT files"
echo "    .claude/CLAUDE.md:      $CLAUDE_IMPORT_COUNT imports"
echo ""
echo "  Chatmodes → Agents:"
echo "    .ai-docs/chatmodes:     $CHATMODES_COUNT files"
echo "    .claude/agents:         $CLAUDE_AGENTS_COUNT files (auto-generated)"
echo ""
echo "  Prompts → Commands:"
echo "    .ai-docs/prompts:       $PROMPTS_COUNT files"
echo "    .claude/commands:       $CLAUDE_COMMANDS_COUNT files (auto-generated)"
echo ""

# =============================================================================
# Validate Instruction Imports
# =============================================================================

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}📋 Validating instruction imports in CLAUDE.md...${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if counts match
if [ "$INSTRUCTION_COUNT" != "$CLAUDE_IMPORT_COUNT" ]; then
    echo -e "${RED}❌ Mismatch: Filesystem ($INSTRUCTION_COUNT) != CLAUDE.md imports ($CLAUDE_IMPORT_COUNT)${NC}"
    VALIDATION_PASSED=false
else
    echo -e "${GREEN}✅ Import counts match ($INSTRUCTION_COUNT files)${NC}"
fi

# Find files in filesystem but missing from CLAUDE.md
if [ "$INSTRUCTION_COUNT" -gt 0 ]; then
    MISSING_FROM_CLAUDE=""
    while IFS= read -r file; do
        basename_file=$(basename "$file")
        if ! grep -q "$basename_file" .claude/CLAUDE.md 2>/dev/null; then
            MISSING_FROM_CLAUDE="${MISSING_FROM_CLAUDE}${basename_file}\n"
        fi
    done < <(find .ai-docs/instructions -name "*.instructions.md" 2>/dev/null)

    if [ -n "$MISSING_FROM_CLAUDE" ]; then
        echo -e "${RED}❌ Files missing from .claude/CLAUDE.md:${NC}"
        echo -e "$MISSING_FROM_CLAUDE" | grep -v '^$' | sed 's/^/  - /'
        VALIDATION_PASSED=false
    else
        echo -e "${GREEN}✅ All instruction files are imported in CLAUDE.md${NC}"
    fi
fi

# Find broken imports in CLAUDE.md
BROKEN_IMPORTS=""
while IFS= read -r import_line; do
    if [ -n "$import_line" ]; then
        # Extract path after @
        import_path=$(echo "$import_line" | sed 's/^@//')
        if [ ! -f "$import_path" ]; then
            BROKEN_IMPORTS="${BROKEN_IMPORTS}${import_path}\n"
        fi
    fi
done < <(grep "^@.ai-docs/instructions/.*\.instructions\.md" .claude/CLAUDE.md 2>/dev/null || true)

if [ -n "$BROKEN_IMPORTS" ]; then
    echo -e "${RED}❌ Broken imports in CLAUDE.md:${NC}"
    echo -e "$BROKEN_IMPORTS" | grep -v '^$' | sed 's/^/  - /'
    VALIDATION_PASSED=false
else
    echo -e "${GREEN}✅ All CLAUDE.md imports point to existing files${NC}"
fi
echo ""

# =============================================================================
# Validate Auto-Generated Files
# =============================================================================

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}📋 Validating auto-generated Claude files...${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check chatmodes → agents sync
if [ "$CHATMODES_COUNT" != "$CLAUDE_AGENTS_COUNT" ]; then
    echo -e "${YELLOW}⚠️  Chatmodes ($CHATMODES_COUNT) != Claude agents ($CLAUDE_AGENTS_COUNT)${NC}"
    echo "   Run: pnpm setup:claude"
    VALIDATION_PASSED=false
else
    if [ "$CHATMODES_COUNT" -gt 0 ]; then
        echo -e "${GREEN}✅ All chatmodes synced to .claude/agents/ ($CHATMODES_COUNT files)${NC}"
    else
        echo -e "${YELLOW}ℹ️  No chatmodes defined yet${NC}"
    fi
fi

# Check prompts → commands sync
if [ "$PROMPTS_COUNT" != "$CLAUDE_COMMANDS_COUNT" ]; then
    echo -e "${YELLOW}⚠️  Prompts ($PROMPTS_COUNT) != Claude commands ($CLAUDE_COMMANDS_COUNT)${NC}"
    echo "   Run: pnpm setup:claude"
    VALIDATION_PASSED=false
else
    if [ "$PROMPTS_COUNT" -gt 0 ]; then
        echo -e "${GREEN}✅ All prompts synced to .claude/commands/ ($PROMPTS_COUNT files)${NC}"
    else
        echo -e "${YELLOW}ℹ️  No prompts defined yet${NC}"
    fi
fi
echo ""

# =============================================================================
# Summary
# =============================================================================

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ "$VALIDATION_PASSED" = true ]; then
    echo -e "${GREEN}✅ All validation checks passed!${NC}"
    echo "AI agent documentation is in sync."
    exit 0
else
    echo -e "${YELLOW}⚠️  Validation found issues.${NC}"
    echo ""
    echo "To fix:"
    echo "  1. Add missing @imports to .claude/CLAUDE.md"
    echo "  2. Run: pnpm setup:claude"
    echo ""
    echo "See .ai-docs/instructions/ai-docs-sync.instructions.md for guidance."
    exit 1
fi
