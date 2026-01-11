# Contributing to Datto RMM API

Thanks for your interest in contributing! This document provides guidelines and instructions for contributing to this project.

## Getting Started

### Prerequisites

- Node.js v22+ (see [`.nvmrc`](./.nvmrc))
- pnpm v9.14.2+
- Rust (latest stable) - for Rust client development

### Setup

```bash
# Clone the repository
git clone https://github.com/josh-fisher/datto-rmm.git
cd datto-rmm

# Install dependencies
pnpm install

# Generate API clients
pnpm generate:api

# Build all packages
pnpm build

# Run tests
pnpm test
cargo test
```

## Development Workflow

### Making Changes

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following the code style guidelines below
3. **Add tests** for any new functionality
4. **Run the test suite** to ensure nothing is broken
5. **Submit a pull request**

### Code Style

#### TypeScript

- Use TypeScript strict mode
- Follow existing patterns in the codebase
- Export types explicitly when needed
- Use ESM imports (`.js` extensions for local imports)

#### Rust

- Follow standard Rust conventions
- Run `cargo clippy` before submitting
- Run `cargo fmt` to format code
- Document public APIs with doc comments

### Running Tests

```bash
# TypeScript tests
pnpm test

# TypeScript tests in watch mode
pnpm --filter datto-rmm-api test:watch

# Rust tests
cargo test -p datto-api

# Run all checks
pnpm build && pnpm typecheck && pnpm test && cargo test
```

### Regenerating API Clients

If the OpenAPI spec has been updated:

```bash
# Fetch latest spec from Datto RMM
pnpm sync:openapi

# Regenerate TypeScript and Rust clients
pnpm generate:api
```

## Commit Messages

This project uses [Conventional Commits](https://www.conventionalcommits.org/) and enforces them via commitlint. All commits must follow this format:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Code style (formatting, semicolons, etc) |
| `refactor` | Code refactoring |
| `perf` | Performance improvement |
| `test` | Adding or updating tests |
| `build` | Build system or dependencies |
| `ci` | CI configuration |
| `chore` | Other changes (tooling, etc) |
| `revert` | Revert a previous commit |

### Scopes (optional)

| Scope | Description |
|-------|-------------|
| `api` | TypeScript API client |
| `rust` | Rust API client |
| `docs` | Documentation |
| `specs` | OpenAPI specs |
| `ci` | CI/CD workflows |
| `deps` | Dependencies |

### Examples

```bash
feat(api): add retry logic for failed requests
fix(rust): handle token expiry edge case
docs: update installation instructions
chore(deps): upgrade openapi-typescript to v7.7
```

### Breaking Changes

For breaking changes, add `!` after the type/scope or include `BREAKING CHANGE:` in the footer:

```bash
feat(api)!: change authentication API

BREAKING CHANGE: The `auth` option now requires `getToken` instead of `token`.
```

## Pull Request Process

1. **Update documentation** if you're changing functionality
2. **Add a clear PR description** explaining what and why
3. **Link any related issues** using GitHub keywords (Fixes #123)
4. **Ensure CI passes** - all checks must be green
5. **Request review** from maintainers

### PR Title Format

Use conventional commit format for PR titles (same as commit messages above).

## Project Structure

```
datto-rmm/
├── apps/docs/           # Documentation site (Starlight)
├── packages/api/        # TypeScript client (datto-rmm-api)
│   ├── src/
│   │   ├── auth/        # Authentication middleware
│   │   ├── generated/   # Auto-generated types (don't edit)
│   │   ├── client.ts    # Client factory
│   │   └── platforms.ts # Platform configuration
│   └── scripts/         # Build scripts
├── crates/datto-api/    # Rust client
│   ├── src/
│   │   ├── client.rs    # Client implementation
│   │   └── platforms.rs # Platform enum
│   └── build.rs         # Code generation
├── specs/               # Cached OpenAPI specification
└── tooling/scripts/     # Shared build scripts
```

## Reporting Issues

### Bug Reports

Include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details (Node/Rust version, OS)
- Error messages or stack traces

### Feature Requests

Include:
- Clear description of the feature
- Use case / motivation
- Proposed API (if applicable)
- Any alternatives considered

## Questions?

- Open a [GitHub Discussion](https://github.com/josh-fisher/datto-rmm/discussions) for questions
- Check existing [issues](https://github.com/josh-fisher/datto-rmm/issues) for similar problems

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
