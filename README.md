<p align="center">
  <h1 align="center">Datto RMM Tooling</h1>
  <p align="center">
    <strong>A complete toolkit for Datto RMM: API clients, MCP server, and developer tools</strong>
  </p>
  <p align="center">
    <a href="https://github.com/josh-fisher/datto-rmm/actions"><img src="https://github.com/josh-fisher/datto-rmm/workflows/CI/badge.svg" alt="CI Status"></a>
    <a href="https://www.npmjs.com/package/datto-rmm-api"><img src="https://img.shields.io/npm/v/datto-rmm-api.svg" alt="npm version"></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.7-blue.svg" alt="TypeScript"></a>
    <a href="https://www.rust-lang.org/"><img src="https://img.shields.io/badge/Rust-2021-orange.svg" alt="Rust"></a>
    <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License"></a>
  </p>
</p>

---

A monorepo providing everything you need to work with [Datto RMM](https://www.datto.com/products/rmm): type-safe API clients, an MCP server for AI assistant integration, and comprehensive documentation.

## Features

- **MCP Server** - Integrate Datto RMM with AI assistants like Claude using the Model Context Protocol
- **TypeScript Client** - Fully typed API client with auto-generated types from OpenAPI 3.1.0
- **Rust Client** - Native Rust client with async/await support
- **OAuth 2.0** - Automatic token management and refresh
- **All 6 Platforms** - Supports Pinotage, Merlot, Concord, Vidal, Zinfandel, and Syrah

## Packages

| Package | Description | Status |
|---------|-------------|--------|
| [`datto-rmm-mcp-server`](./apps/mcp-server) | MCP server for AI assistant integration | Stable |
| [`datto-rmm-api`](./packages/api) | TypeScript client with auto-generated types | Stable |
| [`datto-api`](./crates/datto-api) | Rust client with OAuth support | Stable |

## Quick Start

### MCP Server (AI Integration)

Add to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "datto-rmm": {
      "command": "node",
      "args": ["/path/to/datto-rmm/apps/mcp-server/dist/index.js"],
      "env": {
        "DATTO_API_KEY": "your-api-key",
        "DATTO_API_SECRET": "your-api-secret",
        "DATTO_PLATFORM": "merlot"
      }
    }
  }
}
```

Then interact with Datto RMM through natural language:
- "Show me all offline devices"
- "What open alerts do we have?"
- "Get the audit information for device abc-123"

See the [MCP Server documentation](./apps/mcp-server/README.md) for the full list of 39+ available tools.

### TypeScript

```bash
pnpm add datto-rmm-api
```

```typescript
import { createDattoClient, Platform } from 'datto-rmm-api';

const client = createDattoClient({
  platform: Platform.MERLOT,
  auth: {
    apiKey: process.env.DATTO_API_KEY!,
    apiSecret: process.env.DATTO_API_SECRET!,
  },
});

// Fully typed - IDE autocomplete for paths and responses
const { data, error } = await client.GET('/v2/account/devices');

if (data) {
  for (const device of data.devices ?? []) {
    console.log(device.hostname, device.lastSeen);
  }
}
```

### Rust

```toml
[dependencies]
datto-api = { git = "https://github.com/josh-fisher/datto-rmm" }
tokio = { version = "1", features = ["rt-multi-thread", "macros"] }
```

```rust
use datto_api::{DattoClient, Platform, Credentials};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = DattoClient::new(
        Platform::Merlot,
        Credentials {
            api_key: std::env::var("DATTO_API_KEY")?,
            api_secret: std::env::var("DATTO_API_SECRET")?,
        },
    ).await?;

    println!("Connected to {}", client.platform());
    Ok(())
}
```

## Platforms

The Datto RMM API is available on multiple regional platforms:

| Platform | API Endpoint |
|----------|--------------|
| Pinotage | `https://pinotage-api.centrastage.net/api` |
| Merlot | `https://merlot-api.centrastage.net/api` |
| Concord | `https://concord-api.centrastage.net/api` |
| Vidal | `https://vidal-api.centrastage.net/api` |
| Zinfandel | `https://zinfandel-api.centrastage.net/api` |
| Syrah | `https://syrah-api.centrastage.net/api` |

## Development

### Prerequisites

- Node.js v22+ (see [`.nvmrc`](./.nvmrc))
- pnpm v9.14.2+
- Rust (latest stable) - optional, for Rust client

### Setup

```bash
# Clone the repository
git clone https://github.com/josh-fisher/datto-rmm.git
cd datto-rmm

# Install dependencies
pnpm install

# Sync OpenAPI spec and generate clients
pnpm sync:openapi
pnpm generate:api

# Build all packages
pnpm build
```

### Commands

| Command | Description |
|---------|-------------|
| `pnpm build` | Build all packages |
| `pnpm dev` | Start development servers |
| `pnpm test` | Run tests |
| `pnpm lint` | Lint code |
| `pnpm typecheck` | TypeScript type checking |
| `pnpm sync:openapi` | Fetch latest OpenAPI spec |
| `pnpm generate:api` | Regenerate API clients |

### Project Structure

```
datto-rmm/
├── apps/
│   ├── mcp-server/      # MCP server for AI assistants (datto-rmm-mcp-server)
│   └── docs/            # Documentation site (Starlight)
├── packages/
│   └── api/             # TypeScript client (datto-rmm-api)
├── crates/
│   └── datto-api/       # Rust client
├── specs/               # Cached OpenAPI specification
├── tooling/scripts/     # Build scripts
└── .github/workflows/   # CI/CD pipelines
```

## Documentation

Full documentation is available at **[apps/docs](./apps/docs)**, built with [Starlight](https://starlight.astro.build/). Run locally with:

```bash
pnpm --filter @datto-rmm/docs dev
```

### Resources

- **[MCP Server Guide](./apps/mcp-server/README.md)** - AI assistant integration
- **[TypeScript Client](./packages/api/README.md)** - TypeScript/JavaScript usage
- **[Rust Client](./crates/datto-api/README.md)** - Rust usage
- **[API Reference](./apps/docs/src/content/docs/api/)** - Full API documentation
- **[Datto RMM API Docs](https://rmm.datto.com/help/en/Content/2SETUP/APIv2.htm)** - Official API documentation
- **[Swagger UI](https://merlot-api.centrastage.net/api/swagger-ui/index.html)** - Interactive API explorer

## Contributing

Contributions are welcome! Please read our [Contributing Guide](./CONTRIBUTING.md) before submitting a pull request.

This project follows:

- **[Semantic Versioning](https://semver.org/)** for releases
- **[Conventional Commits](https://www.conventionalcommits.org/)** for commit messages (enforced via commitlint)

```bash
# Example commit messages
feat(mcp-server): add device filtering tool
feat(api): add retry logic for failed requests
fix(rust): handle token expiry edge case
docs: update installation instructions
```

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Acknowledgments

- [Model Context Protocol](https://modelcontextprotocol.io/) - AI assistant integration standard
- [openapi-typescript](https://github.com/openapi-ts/openapi-typescript) - TypeScript type generation
- [openapi-fetch](https://github.com/openapi-ts/openapi-typescript/tree/main/packages/openapi-fetch) - Type-safe fetch client
- [progenitor](https://github.com/oxidecomputer/progenitor) - Rust client generation
- [Datto](https://www.datto.com/) - For providing the RMM API
