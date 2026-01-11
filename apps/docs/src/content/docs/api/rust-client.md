---
title: Rust Client
description: Using the datto-api Rust crate
---

The `datto-api` crate provides an async Rust client for the Datto RMM API.

## Installation

Add to your `Cargo.toml`:

```toml
[dependencies]
datto-api = { path = "path/to/datto-rmm/crates/datto-api" }
tokio = { version = "1", features = ["rt-multi-thread", "macros"] }
```

## Quick Start

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
    println!("Base URL: {}", client.base_url());

    Ok(())
}
```

## Platforms

Choose the platform that matches your Datto RMM account:

```rust
use datto_api::Platform;

// Available platforms
let platforms = [
    Platform::Pinotage,  // https://pinotage-api.centrastage.net/api
    Platform::Merlot,    // https://merlot-api.centrastage.net/api
    Platform::Concord,   // https://concord-api.centrastage.net/api
    Platform::Vidal,     // https://vidal-api.centrastage.net/api
    Platform::Zinfandel, // https://zinfandel-api.centrastage.net/api
    Platform::Syrah,     // https://syrah-api.centrastage.net/api
];

// Get the base URL
let url = Platform::Merlot.base_url();
// => "https://merlot-api.centrastage.net/api"

// Parse from string
let platform: Platform = "merlot".parse()?;
```

## Authentication

The client automatically handles OAuth 2.0 token management:

```rust
use datto_api::{DattoClient, Platform, Credentials};

let client = DattoClient::new(
    Platform::Merlot,
    Credentials {
        api_key: "your-api-key".into(),
        api_secret: "your-api-secret".into(),
    },
).await?;

// Tokens are managed automatically
// - Cached in memory
// - Refreshed 5 minutes before expiry
// - Thread-safe (uses RwLock internally)

// You can manually get a token if needed
let token = client.ensure_token().await?;
```

## Error Handling

The client provides typed errors:

```rust
use datto_api::Error;

async fn example(client: &DattoClient) {
    match some_operation().await {
        Ok(result) => {
            println!("Success: {:?}", result);
        }
        Err(Error::Auth(msg)) => {
            // Authentication failed (invalid credentials, token expired, etc.)
            eprintln!("Authentication failed: {}", msg);
        }
        Err(Error::HttpClient(e)) => {
            // Network or HTTP client error
            eprintln!("HTTP error: {}", e);
        }
        Err(Error::Api { status, message }) => {
            // API returned an error response
            eprintln!("API error {}: {}", status, message);
        }
    }
}
```

## Generated Types

The Rust client generates types from the OpenAPI spec at build time using [progenitor](https://github.com/oxidecomputer/progenitor).

When the spec is available, types are exported from the crate:

```rust
// These types will be available when compiled with the OpenAPI spec
use datto_api::types::{Device, Alert, Site};
```

## Building

The crate uses a build script to generate code from the OpenAPI spec:

```bash
# Ensure the spec exists
pnpm sync:openapi

# Build the crate
cargo build -p datto-api

# Run tests
cargo test -p datto-api
```

## Making Custom Requests

For endpoints not covered by the generated client, use the HTTP client directly:

```rust
use datto_api::{DattoClient, Platform, Credentials};

let client = DattoClient::new(
    Platform::Merlot,
    Credentials { api_key: "...".into(), api_secret: "...".into() },
).await?;

// Get a valid token
let token = client.ensure_token().await?;

// Make a custom request
let response = client
    .http_client()
    .get(format!("{}/v2/custom/endpoint", client.base_url()))
    .header("Authorization", format!("Bearer {}", token))
    .send()
    .await?;
```

## Dependencies

The crate uses:
- `reqwest` with `rustls-tls` for HTTP requests
- `tokio` for async runtime
- `serde` for serialization
- `thiserror` for error handling
- `progenitor` for code generation (build-time)
