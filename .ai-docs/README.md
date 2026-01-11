# AI Documentation

This folder is the **single source of truth** for all AI-assisted development documentation. It's designed to be agent-agnostic, allowing multiple AI tools (Claude, Copilot, Cursor, etc.) to consume the same configurations.

## Structure

```
.ai-docs/
├── chatmodes/      # Agent definitions (*.chatmode.md)
├── prompts/        # Slash command definitions (*.prompt.md)
├── instructions/   # Shared instructions and guidelines
├── context/        # Project background and domain knowledge
└── plans/          # Architecture decisions and implementation plans
```

## File Naming Conventions

| Folder | File Pattern | Purpose |
|--------|-------------|---------|
| `chatmodes/` | `*.chatmode.md` | Define specialized AI agents/personas |
| `prompts/` | `*.prompt.md` | Define reusable slash commands |
| `instructions/` | `*.instructions.md` | Shared guidelines for AI tools |
| `context/` | `*.md` | Domain knowledge and background |
| `plans/` | `*.md` | Implementation plans and decisions |

## How It Works

### For Claude Code

Files are synced to `.claude/` via `pnpm setup:claude`:

- `chatmodes/*.chatmode.md` → `.claude/agents/*.md`
- `prompts/*.prompt.md` → `.claude/commands/*.md`

### For Other AI Tools

Other tools can directly reference files in `.ai-docs/` or have their own sync scripts added to `tooling/scripts/`.

## Adding New Commands

1. Create `.ai-docs/prompts/my-command.prompt.md`
2. Run `pnpm setup:claude`
3. Use `/my-command` in Claude Code

## Adding New Agents

1. Create `.ai-docs/chatmodes/my-agent.chatmode.md`
2. Run `pnpm setup:claude`
3. Reference the agent in Claude Code

## Example Files

### Prompt Example (`.ai-docs/prompts/example.prompt.md`)

```markdown
You are performing [task]. Follow these steps:

1. First step
2. Second step
3. Final step

Output the result in [format].
```

### Chatmode Example (`.ai-docs/chatmodes/example.chatmode.md`)

```markdown
You are an expert in [domain].

## Expertise
- Area 1
- Area 2

## Guidelines
- Always consider X
- Prefer Y over Z
```
