# Claude Configuration

This folder contains Claude Code configuration for this project.

## Structure

```
.claude/
├── CLAUDE.md          # Main project instructions (tracked)
├── settings.json      # Tool/model configuration (tracked)
├── README.md          # This file (tracked)
├── agents/            # Auto-generated from .ai-docs/chatmodes/ (git-ignored)
└── commands/          # Auto-generated from .ai-docs/prompts/ (git-ignored)
```

## Auto-Generated Files

The `agents/` and `commands/` directories are **automatically generated** by running:

```bash
pnpm setup:claude
```

This copies files from `.ai-docs/` (the single source of truth):
- `.ai-docs/chatmodes/*.chatmode.md` → `.claude/agents/*.md`
- `.ai-docs/prompts/*.prompt.md` → `.claude/commands/*.md`

## Why This Approach?

1. **Single source of truth**: All AI configuration lives in `.ai-docs/`
2. **Multi-agent support**: Other AI tools can also read from `.ai-docs/`
3. **Cross-platform**: Script-based copying works on Windows without symlinks
4. **Git-friendly**: Source files tracked, generated files ignored

## Adding New Commands or Agents

1. Create the file in `.ai-docs/`:
   - For commands: `.ai-docs/prompts/my-command.prompt.md`
   - For agents: `.ai-docs/chatmodes/my-agent.chatmode.md`
2. Run `pnpm setup:claude` to generate the Claude files
3. Use `/my-command` or the agent in Claude Code
