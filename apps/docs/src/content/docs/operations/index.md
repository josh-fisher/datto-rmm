---
title: Operations
description: Operational guides and maintenance procedures
---

This section contains operational documentation for maintaining and updating the Datto RMM API clients.

## Regular Maintenance

### Updating the OpenAPI Spec

The Datto RMM API may be updated periodically. To sync the latest spec:

```bash
# Fetch latest spec from Datto RMM
pnpm sync:openapi

# Check what changed
git diff specs/datto-rmm-openapi.json

# Regenerate clients
pnpm generate:api

# Build and test
pnpm build && pnpm typecheck
```

### Changing the Spec Platform

By default, the spec is fetched from Merlot. To use a different platform:

```bash
DATTO_PLATFORM=pinotage pnpm sync:openapi
```

All platforms should have identical specs.

## CI/CD Integration

### Recommended CI Steps

```yaml
# Example GitHub Actions workflow
- name: Install dependencies
  run: pnpm install

- name: Generate API clients
  run: pnpm generate:api

- name: Build
  run: pnpm build

- name: Type check
  run: pnpm typecheck

- name: Test
  run: pnpm test

- name: Build Rust
  run: cargo build -p datto-api
```

### Caching

Cache these directories for faster CI:

- `node_modules/` - pnpm dependencies
- `.turbo/` - Turborepo cache
- `~/.cargo/` - Cargo registry and cache
- `target/` - Rust build artifacts

## Monitoring API Changes

### Detecting Breaking Changes

When updating the OpenAPI spec:

1. Compare the new spec with the old one
2. Look for removed endpoints or changed parameters
3. Check for schema changes in response types
4. Run the full test suite

```bash
# Show spec differences
git diff specs/datto-rmm-openapi.json | head -100
```

### Version Tracking

The spec includes version information:

```bash
# Check current spec version
jq '.info.version' specs/datto-rmm-openapi.json
```

## Troubleshooting

### API Authentication Errors

**401 Unauthorized**
- Verify API key and secret are correct
- Check if credentials have been revoked
- Ensure you're using the correct platform

**403 Forbidden**
- Verify API permissions in Datto RMM portal
- Check if the endpoint requires specific permissions

### Token Refresh Issues

Both clients cache tokens and refresh proactively. If you see token issues:

1. Check token expiry (Datto tokens expire after 100 hours)
2. Verify the token endpoint is accessible
3. Check for rate limiting

### Network Issues

**Connection Timeouts**
- Verify network connectivity to Datto API servers
- Check firewall rules for outbound HTTPS
- Verify DNS resolution for `*.centrastage.net`

### Generation Failures

**TypeScript generation fails**
- Ensure the spec is valid JSON
- Check openapi-typescript version compatibility

**Rust generation fails**
- progenitor doesn't yet support OpenAPI 3.1.0
- The crate will compile but without generated types

## Platform Information

### API Endpoints

| Platform | API URL | Swagger UI |
|----------|---------|------------|
| Pinotage | `pinotage-api.centrastage.net` | [Swagger](https://pinotage-api.centrastage.net/api/swagger-ui/index.html) |
| Merlot | `merlot-api.centrastage.net` | [Swagger](https://merlot-api.centrastage.net/api/swagger-ui/index.html) |
| Concord | `concord-api.centrastage.net` | [Swagger](https://concord-api.centrastage.net/api/swagger-ui/index.html) |
| Vidal | `vidal-api.centrastage.net` | [Swagger](https://vidal-api.centrastage.net/api/swagger-ui/index.html) |
| Zinfandel | `zinfandel-api.centrastage.net` | [Swagger](https://zinfandel-api.centrastage.net/api/swagger-ui/index.html) |
| Syrah | `syrah-api.centrastage.net` | [Swagger](https://syrah-api.centrastage.net/api/swagger-ui/index.html) |

### Rate Limits

The Datto RMM API has rate limits. Check response headers:

- `X-RateLimit-Limit` - Maximum requests per window
- `X-RateLimit-Remaining` - Requests remaining
- `X-RateLimit-Reset` - Window reset time

## Backup and Recovery

### Spec Backup

The OpenAPI spec is committed to git in `specs/`. This ensures:

- Reproducible builds without network access
- Version history of API changes
- Easy rollback if needed

### Recovering from Spec Issues

If the spec becomes corrupted or incompatible:

```bash
# Revert to last known good spec
git checkout HEAD~1 -- specs/datto-rmm-openapi.json

# Or fetch fresh from Datto
pnpm sync:openapi
```
