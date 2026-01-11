# Project Overview

This is a TypeScript monorepo for Datto RMM tooling using pnpm workspaces and Turborepo for build orchestration.

## Monorepo Structure

```
apps/           # Applications
  ├── mcp-server/  # MCP server for AI assistant integration
  └── docs/        # Human documentation (Starlight)
packages/       # Shared libraries and utilities
  └── api/         # TypeScript API client
crates/         # Rust packages
  └── datto-api/   # Rust API client
tooling/        # Shared configs, scripts (tsconfig, eslint, etc.)
```

## Applications

### MCP Server (`apps/mcp-server`)

Model Context Protocol server that exposes Datto RMM functionality to AI assistants.

- **Location**: `apps/mcp-server/`
- **Package**: `datto-rmm-mcp-server`
- **Features**: 39+ tools for managing devices, sites, alerts, jobs, and more
- **Usage**: Configure in Claude Desktop or other MCP-compatible clients

### Documentation Site (`apps/docs`)

Human-facing documentation built with [Starlight](https://starlight.astro.build/).

- **Location**: `apps/docs/`
- **Run locally**: `pnpm --filter @datto-rmm/docs dev` (port 4000)
- **Content**: `apps/docs/src/content/docs/`

All new features MUST include documentation. See `documentation.instructions.md`.

## Packages

### TypeScript API Client (`packages/api`)

Fully typed TypeScript client for the Datto RMM API.

- **Location**: `packages/api/`
- **Package**: `datto-rmm-api`
- **Features**: Auto-generated types from OpenAPI, OAuth 2.0, all 6 platforms

### Rust API Client (`crates/datto-api`)

Native Rust client with async/await support.

- **Location**: `crates/datto-api/`
- **Features**: OAuth 2.0, generated from OpenAPI via progenitor

## AI Documentation

All AI configuration lives in `.ai-docs/` as the single source of truth:

- `.ai-docs/plans/` - Architecture and implementation plans
- `.ai-docs/context/` - Project background and domain knowledge
- `.ai-docs/instructions/` - Guidelines (like this file)
- `.ai-docs/chatmodes/` - Agent definitions
- `.ai-docs/prompts/` - Slash command definitions

Files are synced to agent-specific folders via scripts in `tooling/scripts/`.

## Documentation Types

| Type | Location | Purpose |
|------|----------|---------|
| AI docs | `.ai-docs/` | Context and instructions for AI assistants |
| Human docs | `apps/docs/` | User-facing documentation site |

**Rule**: AI docs help AI work effectively. Human docs help developers use the project.
