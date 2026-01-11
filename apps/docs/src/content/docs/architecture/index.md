---
title: Architecture Overview
description: High-level architecture and design decisions
---

This section documents the architectural decisions and design patterns used in the Datto RMM API clients.

## Design Principles

1. **Auto-generation First** - Types and client code are generated from OpenAPI specs
2. **Type Safety** - Full type coverage with strict TypeScript and Rust
3. **Platform Agnostic** - Support all 6 Datto RMM regional platforms
4. **OAuth Handled** - Automatic token management and refresh

## Code Generation Pipeline

```
OpenAPI Spec (specs/datto-rmm-openapi.json)
         │
         ├──→ openapi-typescript ──→ TypeScript types
         │
         └──→ progenitor ──→ Rust types (when 3.1.0 supported)
```

### TypeScript Generation

Uses `openapi-typescript` to generate types, paired with `openapi-fetch` for runtime:

- **Input**: OpenAPI 3.1.0 JSON specification
- **Output**: TypeScript type definitions in `src/generated/types.ts`
- **Runtime**: `openapi-fetch` provides a typed fetch wrapper

### Rust Generation

Uses `progenitor` from Oxide Computer:

- **Input**: OpenAPI specification
- **Output**: Rust types and client code (when OpenAPI 3.1.0 is supported)
- **Current Status**: Manual client with OAuth, awaiting progenitor 3.1.0 support

## Authentication Architecture

### OAuth 2.0 Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │────→│   Token     │────→│  Datto API  │
│   Request   │     │   Manager   │     │   Server    │
└─────────────┘     └─────────────┘     └─────────────┘
                          │
                          ├── Cache token in memory
                          ├── Refresh 5 min before expiry
                          └── Dedupe concurrent refreshes
```

### Token Management

Both clients implement:

1. **Token Caching** - Store access tokens in memory
2. **Proactive Refresh** - Refresh tokens before they expire (5 minute buffer)
3. **Request Deduplication** - Prevent multiple concurrent refresh requests
4. **Middleware Pattern** - Inject auth headers transparently

## Platform Configuration

All 6 Datto RMM platforms share the same API schema:

| Platform | Region | Base URL |
|----------|--------|----------|
| Pinotage | - | `https://pinotage-api.centrastage.net/api` |
| Merlot | - | `https://merlot-api.centrastage.net/api` |
| Concord | - | `https://concord-api.centrastage.net/api` |
| Vidal | - | `https://vidal-api.centrastage.net/api` |
| Zinfandel | - | `https://zinfandel-api.centrastage.net/api` |
| Syrah | - | `https://syrah-api.centrastage.net/api` |

The platform is selected at client creation time and determines:
- API base URL
- OAuth token endpoint

## Package Architecture

### TypeScript (`@datto-rmm/api`)

```
┌─────────────────────────────────────────────────┐
│                    index.ts                      │
│           (main exports & re-exports)            │
└─────────────────────────────────────────────────┘
         │              │              │
         ▼              ▼              ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  client.ts  │  │ platforms.ts│  │   auth/     │
│  (factory)  │  │ (URLs/enum) │  │ (OAuth)     │
└─────────────┘  └─────────────┘  └─────────────┘
         │                              │
         ▼                              ▼
┌─────────────────────────────┐  ┌─────────────┐
│     generated/types.ts      │  │ middleware  │
│   (auto-generated types)    │  │  (inject)   │
└─────────────────────────────┘  └─────────────┘
```

### Rust (`datto-api`)

```
┌─────────────────────────────────────────────────┐
│                     lib.rs                       │
│              (main exports)                      │
└─────────────────────────────────────────────────┘
         │              │
         ▼              ▼
┌─────────────┐  ┌─────────────┐
│  client.rs  │  │platforms.rs │
│  (DattoClient)│ │ (Platform)  │
└─────────────┘  └─────────────┘
         │
         ▼
┌─────────────────────────────┐
│       generated.rs          │
│    (progenitor output)      │
└─────────────────────────────┘
```

## Error Handling

### TypeScript

Uses the `openapi-fetch` error model:

```typescript
const { data, error, response } = await client.GET('/path');
// data: typed response body (if success)
// error: typed error body (if error)
// response: raw Response object
```

### Rust

Uses a typed `Error` enum:

```rust
pub enum Error {
    HttpClient(reqwest::Error),
    Auth(String),
    Api { status: u16, message: String },
}
```

## Related Documentation

- [TypeScript Client](/api/typescript-client/)
- [Rust Client](/api/rust-client/)
- [Development Guide](/development/)
