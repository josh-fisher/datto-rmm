---
title: Project Structure
description: Understanding the monorepo structure and organization
---

This page explains how the Datto RMM monorepo is organized and the purpose of each directory.

## Root Structure

```text
datto-rmm/
├── apps/                   # Applications
│   ├── mcp-server/        # MCP server for AI assistants
│   └── docs/              # This documentation site (Starlight)
├── packages/              # TypeScript packages
│   └── api/               # datto-rmm-api - TypeScript client
├── crates/                # Rust packages
│   └── datto-api/         # Rust API client
├── specs/                 # OpenAPI specifications
│   └── datto-rmm-openapi.json
├── tooling/               # Build tools and scripts
│   └── scripts/           # Utility scripts
├── .ai-docs/              # AI assistant configuration
├── Cargo.toml             # Rust workspace
├── turbo.json             # Turborepo configuration
├── pnpm-workspace.yaml    # pnpm workspace configuration
└── package.json           # Root package.json
```

## Key Directories

### `apps/mcp-server/`

The MCP (Model Context Protocol) server that enables AI assistants to interact with Datto RMM.

```text
apps/mcp-server/
├── src/
│   ├── index.ts           # Entry point
│   ├── server.ts          # MCP server setup
│   ├── config.ts          # Configuration
│   ├── types.ts           # Type definitions
│   ├── tools/             # MCP tool implementations
│   │   ├── account.ts     # Account tools
│   │   ├── sites.ts       # Site tools
│   │   ├── devices.ts     # Device tools
│   │   ├── alerts.ts      # Alert tools
│   │   ├── jobs.ts        # Job tools
│   │   ├── audit.ts       # Audit tools
│   │   ├── activity.ts    # Activity log tools
│   │   └── system.ts      # System tools
│   ├── resources/         # MCP resource handlers
│   └── utils/             # Utility functions
├── package.json
└── tsconfig.json
```

### `packages/api/`

The TypeScript API client package.

```text
packages/api/
├── src/
│   ├── index.ts           # Main exports
│   ├── client.ts          # Client factory
│   ├── platforms.ts       # Platform configuration
│   ├── auth/              # OAuth handling
│   │   ├── middleware.ts  # Auth middleware
│   │   └── oauth.ts       # Token manager
│   └── generated/
│       └── types.ts       # Auto-generated types
├── scripts/
│   └── generate.ts        # Type generation script
├── package.json
└── tsconfig.json
```

### `crates/datto-api/`

The Rust API client crate.

```text
crates/datto-api/
├── src/
│   ├── lib.rs             # Main exports
│   ├── client.rs          # Client implementation
│   └── platforms.rs       # Platform configuration
├── build.rs               # Code generation
├── Cargo.toml
└── README.md
```

### `specs/`

Cached OpenAPI specifications used for code generation.

```text
specs/
├── datto-rmm-openapi.json  # Datto RMM API spec
└── README.md               # Spec management docs
```

### `tooling/scripts/`

Utility scripts for development:

| Script | Description |
|--------|-------------|
| `sync-openapi-spec.sh` | Fetch latest OpenAPI spec |
| `generate-api-clients.sh` | Regenerate all clients |
| `setup-claude-files.sh` | Set up AI assistant config |

### `apps/docs/`

This documentation site, built with [Starlight](https://starlight.astro.build/).

```text
apps/docs/
├── src/
│   ├── content/
│   │   └── docs/          # Documentation pages
│   └── assets/            # Images and static files
├── astro.config.mjs       # Astro configuration
└── package.json
```

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| TypeScript packages | `datto-rmm-name` | `datto-rmm-api` |
| Rust crates | `datto-name` | `datto-api` |
| Files | `kebab-case` | `oauth-middleware.ts` |

## Workspace Configuration

### pnpm (TypeScript)

Defined in `pnpm-workspace.yaml`:

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'tooling/*'
```

### Cargo (Rust)

Defined in `Cargo.toml`:

```toml
[workspace]
resolver = "2"
members = ["crates/*"]
```

## Build Orchestration

Turborepo manages the TypeScript build pipeline:

| Task | Description |
|------|-------------|
| `build` | Build all packages |
| `dev` | Start development servers |
| `generate` | Generate API types |
| `test` | Run tests |
| `lint` | Check code quality |
| `typecheck` | TypeScript type checking |
| `clean` | Clean build artifacts |

### Task Dependencies

```text
generate → build → test
              ↓
           typecheck
              ↓
            lint
```

The `datto-rmm-api#build` task depends on `generate` to ensure types are generated before building. The `datto-rmm-mcp-server#build` task depends on `datto-rmm-api#build` since it uses the API client.
