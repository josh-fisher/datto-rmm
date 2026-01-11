---
title: Development Guide
description: Development guidelines and best practices
---

This section contains guides for developing and contributing to the Datto RMM API clients.

## Setting Up Development Environment

### Prerequisites

- Node.js v22 (use `nvm use` to activate from `.nvmrc`)
- pnpm v9.14.2+
- Rust (latest stable)

### Initial Setup

```bash
# Clone and install
git clone https://github.com/josh-fisher/datto-rmm.git
cd datto-rmm
pnpm install

# Fetch the OpenAPI spec
pnpm sync:openapi

# Generate API clients
pnpm generate:api

# Build everything
pnpm build
```

## Development Workflow

### Making Changes to TypeScript Client

1. Edit files in `packages/api/src/`
2. Run `pnpm --filter datto-rmm-api build` to compile
3. Run `pnpm --filter datto-rmm-api typecheck` to verify types

### Making Changes to Rust Client

1. Edit files in `crates/datto-api/src/`
2. Run `cargo check -p datto-api` to verify
3. Run `cargo build -p datto-api` to compile

### Regenerating Types

When the Datto RMM API is updated:

```bash
# Fetch latest spec
pnpm sync:openapi

# Regenerate all clients
pnpm generate:api

# Rebuild
pnpm build
```

## Code Style

### TypeScript

- Strict mode enabled
- Explicit types for public APIs
- Use `type` imports: `import type { Foo } from './foo.js'`
- ESM modules with `.js` extensions in imports

### Rust

- Follow standard Rust conventions
- Use `thiserror` for error types
- Async/await with tokio

### File Naming

| Type | Convention |
|------|------------|
| TypeScript files | `kebab-case.ts` |
| Rust files | `snake_case.rs` |
| Directories | `kebab-case` |

## Testing

### TypeScript

```bash
# Run all tests
pnpm test

# Run tests for specific package
pnpm --filter datto-rmm-api test
```

### Rust

```bash
# Run all tests
cargo test

# Run tests for specific crate
cargo test -p datto-api
```

## Adding New Features

### TypeScript Client

1. Add types/interfaces in appropriate file
2. Export from `index.ts`
3. Add documentation in JSDoc comments
4. Update README if needed
5. Add tests

### Rust Client

1. Add types/functions in appropriate module
2. Export from `lib.rs`
3. Add doc comments (`///`)
4. Update README if needed
5. Add tests

## Documentation

### Human Documentation

Update docs in `apps/docs/src/content/docs/`:

```bash
# Start docs dev server
pnpm --filter @datto-rmm/docs dev
```

Visit `http://localhost:4000` to preview changes.

### Code Documentation

- TypeScript: JSDoc comments for public APIs
- Rust: Doc comments (`///`) for public items

## Common Tasks

### Adding a New Platform

If Datto adds a new regional platform:

1. **TypeScript**: Add to `packages/api/src/platforms.ts`
2. **Rust**: Add to `crates/datto-api/src/platforms.rs`
3. **Docs**: Update platform tables in documentation

### Updating Dependencies

```bash
# Update all pnpm dependencies
pnpm update

# Update Rust dependencies
cargo update
```

### Running the Full Build

```bash
# Clean, generate, build, and typecheck
pnpm clean && pnpm generate:api && pnpm build && pnpm typecheck
```

## Troubleshooting

### "OpenAPI spec not found"

Run `pnpm sync:openapi` to fetch the spec.

### TypeScript build errors after spec update

The spec may have changed. Check the generated types and update any affected code.

### Rust progenitor generation fails

Progenitor doesn't yet support OpenAPI 3.1.0. The crate will compile but without generated types.

## Getting Help

- Check existing documentation
- Review the [Architecture](../architecture/) section
- Open an issue on GitHub
