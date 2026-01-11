# AI Documentation Sync Guide

> **Purpose**: Keep AI configurations in sync when making changes to `.ai-docs/`.

## Architecture Overview

```
.ai-docs/                          (Source of Truth)
├── instructions/*.instructions.md  → Imported via @ in .claude/CLAUDE.md
├── chatmodes/*.chatmode.md         → Copied to .claude/agents/*.md
└── prompts/*.prompt.md             → Copied to .claude/commands/*.md
```

## When to Update

Update configurations when you:

- ✅ **Add** a new instruction, chatmode, or prompt file
- ✅ **Remove** any of these files
- ✅ **Rename** or **move** any of these files

## Step-by-Step Process

### Adding a New Instruction File

1. **Create the file**:
   ```bash
   # Create instruction file
   touch .ai-docs/instructions/my-feature.instructions.md
   ```

2. **Add import to CLAUDE.md**:
   ```bash
   # Edit .claude/CLAUDE.md
   # Add line in "Core Instructions" section:
   @.ai-docs/instructions/my-feature.instructions.md
   ```

3. **Validate**:
   ```bash
   pnpm validate:ai-docs
   ```

### Adding a New Command (Prompt)

1. **Create the file**:
   ```bash
   touch .ai-docs/prompts/my-command.prompt.md
   ```

2. **Sync to Claude**:
   ```bash
   pnpm setup:claude
   ```

3. **Use in Claude Code**:
   ```
   /my-command
   ```

### Adding a New Agent (Chatmode)

1. **Create the file**:
   ```bash
   touch .ai-docs/chatmodes/my-agent.chatmode.md
   ```

2. **Sync to Claude**:
   ```bash
   pnpm setup:claude
   ```

### Removing Files

1. **Delete the source file** from `.ai-docs/`
2. **Remove any imports** from `.claude/CLAUDE.md`
3. **Run sync**: `pnpm setup:claude`
4. **Validate**: `pnpm validate:ai-docs`

## File Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Instructions | `*.instructions.md` | `code-style.instructions.md` |
| Chatmodes | `*.chatmode.md` | `nestjs-expert.chatmode.md` |
| Prompts | `*.prompt.md` | `review.prompt.md` |

## Validation

Run validation before committing:

```bash
pnpm validate:ai-docs
```

**Expected output when synced:**
```
✅ Import counts match (4 files)
✅ All instruction files are imported in CLAUDE.md
✅ All CLAUDE.md imports point to existing files
✅ All chatmodes synced to .claude/agents/ (0 files)
✅ All prompts synced to .claude/commands/ (3 files)
✅ All validation checks passed!
```

## Troubleshooting

### "Mismatch: Filesystem != CLAUDE.md imports"

**Problem**: New instruction file not imported in CLAUDE.md

**Solution**:
1. Open `.claude/CLAUDE.md`
2. Add `@.ai-docs/instructions/[filename].instructions.md`
3. Re-run validation

### "Chatmodes != Claude agents"

**Problem**: Chatmodes not synced to `.claude/agents/`

**Solution**:
```bash
pnpm setup:claude
```

### "Prompts != Claude commands"

**Problem**: Prompts not synced to `.claude/commands/`

**Solution**:
```bash
pnpm setup:claude
```

## Adding Support for Other AI Tools

To add support for another AI tool (e.g., Copilot, Cursor):

1. Create a sync script in `tooling/scripts/setup-[tool]-files.sh`
2. Add script to `package.json`: `"setup:[tool]": "bash tooling/scripts/setup-[tool]-files.sh"`
3. Update `validate-ai-docs.sh` to check the new tool's config
4. Document the new tool in this file

## Quick Reference

```bash
# Sync chatmodes/prompts to Claude
pnpm setup:claude

# Validate all AI docs are in sync
pnpm validate:ai-docs

# List all instruction files
ls .ai-docs/instructions/*.instructions.md

# Check what's imported in CLAUDE.md
grep "^@.ai-docs/instructions/" .claude/CLAUDE.md
```
