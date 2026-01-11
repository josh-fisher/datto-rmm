# datto-api

Auto-generated Rust client for the Datto RMM API.

## Installation

Add to your `Cargo.toml`:

```toml
[dependencies]
datto-api = { path = "../path/to/datto-rmm/crates/datto-api" }
tokio = { version = "1", features = ["rt-multi-thread", "macros"] }
```

## Quick Start

```rust
use datto_api::{DattoClient, Platform, Credentials};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Create a client
    let client = DattoClient::new(
        Platform::Merlot,
        Credentials {
            api_key: std::env::var("DATTO_API_KEY")?,
            api_secret: std::env::var("DATTO_API_SECRET")?,
        },
    ).await?;

    println!("Connected to {}", client.platform());

    // Use the client...
    Ok(())
}
```

## Platforms

The Datto RMM API is hosted on multiple regional platforms:

```rust
use datto_api::Platform;

let platforms = [
    Platform::Pinotage,  // https://pinotage-api.centrastage.net/api
    Platform::Merlot,    // https://merlot-api.centrastage.net/api
    Platform::Concord,   // https://concord-api.centrastage.net/api
    Platform::Vidal,     // https://vidal-api.centrastage.net/api
    Platform::Zinfandel, // https://zinfandel-api.centrastage.net/api
    Platform::Syrah,     // https://syrah-api.centrastage.net/api
];

// Parse from string
let platform: Platform = "merlot".parse()?;
```

## Authentication

The client automatically handles OAuth 2.0 token management:

- Tokens are cached and reused
- Automatic refresh before expiry (5 minute buffer)
- Thread-safe token state management

```rust
use datto_api::{DattoClient, Platform, Credentials};

let client = DattoClient::new(
    Platform::Merlot,
    Credentials {
        api_key: "your-api-key".into(),
        api_secret: "your-api-secret".into(),
    },
).await?;

// Get a valid token (refreshes if needed)
let token = client.ensure_token().await?;
```

## Error Handling

```rust
use datto_api::Error;

match client.some_operation().await {
    Ok(result) => println!("Success: {:?}", result),
    Err(Error::Auth(msg)) => eprintln!("Authentication failed: {}", msg),
    Err(Error::HttpClient(e)) => eprintln!("HTTP error: {}", e),
    Err(Error::Api { status, message }) => {
        eprintln!("API error {}: {}", status, message)
    }
}
```

## Building

The Rust client uses `progenitor` to generate API types at build time from the OpenAPI spec.

```bash
# Ensure the spec exists
pnpm sync:openapi

# Build the crate
cargo build -p datto-api
```

## Known Limitations

**OpenAPI 3.1.0 Support**: The Datto RMM API uses OpenAPI 3.1.0, which is not yet fully supported by progenitor. The crate compiles and provides:
- Platform configuration
- OAuth token management
- HTTP client with authentication

However, the auto-generated API types are not available until progenitor adds 3.1.0 support. For now, you can make custom requests using the HTTP client directly.

## License

MIT
