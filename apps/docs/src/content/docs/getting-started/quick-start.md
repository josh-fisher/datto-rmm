---
title: Quick Start
description: Get up and running with the Datto RMM API clients
---

This guide will help you install and start using the Datto RMM API clients.

## Prerequisites

### For TypeScript Client

- **Node.js** v22 or higher (see `.nvmrc`)
- **pnpm** v9.14.2 or higher

### For Rust Client

- **Rust** (latest stable)
- **Cargo**

### For Development

- **Git**
- All of the above

## Installation

### TypeScript Client

Install from the monorepo or add as a dependency:

```bash
pnpm add datto-rmm-api
```

### Rust Client

Add to your `Cargo.toml`:

```toml
[dependencies]
datto-api = { git = "https://github.com/josh-fisher/datto-rmm", path = "crates/datto-api" }
tokio = { version = "1", features = ["rt-multi-thread", "macros"] }
```

## Getting API Credentials

1. Log in to your Datto RMM portal
2. Navigate to **Setup** > **API**
3. Create a new API key pair
4. Note your **API Key** and **API Secret**

## TypeScript Usage

```typescript
import { createDattoClient, Platform } from 'datto-rmm-api';

// Create a client
const client = createDattoClient({
  platform: Platform.MERLOT,  // Choose your platform
  auth: {
    apiKey: process.env.DATTO_API_KEY!,
    apiSecret: process.env.DATTO_API_SECRET!,
  },
});

// Make API calls
const { data, error } = await client.GET('/v2/account/devices');

if (error) {
  console.error('Error:', error);
} else {
  console.log('Devices:', data?.devices);
}
```

## Rust Usage

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

## Development Setup

To work on the clients themselves:

```bash
# Clone the repository
git clone https://github.com/josh-fisher/datto-rmm.git
cd datto-rmm

# Install dependencies
pnpm install

# Sync the OpenAPI spec
pnpm sync:openapi

# Generate API clients
pnpm generate:api

# Build everything
pnpm build
```

## Available Commands

| Command | Description |
|---------|-------------|
| `pnpm install` | Install dependencies |
| `pnpm build` | Build all packages |
| `pnpm dev` | Start development servers |
| `pnpm sync:openapi` | Fetch latest OpenAPI spec |
| `pnpm generate:api` | Regenerate API clients |
| `pnpm typecheck` | Run TypeScript type checking |
| `pnpm lint` | Check code quality |
| `pnpm test` | Run tests |

## Next Steps

- Read the [TypeScript Client](/api/typescript-client/) documentation
- Check the [Project Structure](/getting-started/project-structure/) guide
- Explore the [API Reference](/api/)
