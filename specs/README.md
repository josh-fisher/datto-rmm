# OpenAPI Specifications

This directory contains cached OpenAPI specifications used for generating API clients.

## Files

- `datto-rmm-openapi.json` - Datto RMM API OpenAPI 3.1.0 specification

## Managing the Spec

### Syncing the Latest Spec

To fetch the latest OpenAPI spec from Datto RMM:

```bash
pnpm sync:openapi
```

This fetches from the Merlot platform by default. To use a different platform:

```bash
DATTO_PLATFORM=pinotage pnpm sync:openapi
```

### Available Platforms

| Platform   | API URL                                      |
|------------|----------------------------------------------|
| pinotage   | https://pinotage-api.centrastage.net/api     |
| merlot     | https://merlot-api.centrastage.net/api       |
| concord    | https://concord-api.centrastage.net/api      |
| vidal      | https://vidal-api.centrastage.net/api        |
| zinfandel  | https://zinfandel-api.centrastage.net/api    |
| syrah      | https://syrah-api.centrastage.net/api        |

All platforms share the same API schema, so you only need to sync from one.

## Regenerating Clients

After updating the spec, regenerate the API clients:

```bash
pnpm generate:api
```

This regenerates both TypeScript and Rust clients from the cached spec.

## Version Tracking

The spec file is committed to git so that:
- Builds are reproducible without network access
- API changes are tracked in version control
- Breaking changes are visible in pull request reviews
