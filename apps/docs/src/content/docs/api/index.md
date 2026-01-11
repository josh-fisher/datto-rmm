---
title: API Reference
description: Documentation for the Datto RMM tooling packages
---

This section contains documentation for all Datto RMM tooling packages.

## Available Packages

| Package | Description |
|---------|-------------|
| [MCP Server](./mcp-server) | AI assistant integration via Model Context Protocol |
| [TypeScript Client](./typescript-client) | Fully typed TypeScript/JavaScript client |
| [Rust Client](./rust-client) | Native async Rust client |

## MCP Server

The MCP server (`datto-rmm-mcp-server`) enables AI assistants like Claude to interact with Datto RMM through natural language. It exposes 39+ tools for managing:

- Devices, sites, and alerts
- Jobs and components
- Audit data (hardware, software, ESXi, printers)
- Activity logs and system status

See the [MCP Server documentation](./mcp-server) for configuration and usage.

## API Clients

Both the TypeScript and Rust clients are generated from the [Datto RMM OpenAPI specification](https://merlot-api.centrastage.net/api/swagger-ui/index.html).

### Available Endpoints

The API provides endpoints for:

- **Account** - Account information and settings
- **Sites** - Site management and configuration
- **Devices** - Device inventory and management
- **Alerts** - Alert monitoring and resolution
- **Jobs** - Quick job scheduling and monitoring
- **Audit** - Device audit data (software, hardware, etc.)
- **Filters** - Device filter management
- **Users** - User management
- **Activity Logs** - Audit trail of actions

### Authentication

All packages use OAuth 2.0 client credentials flow:

1. Obtain API Key and Secret from your Datto RMM portal (your user profile → API Details)
   - API keys are generated per-user from each user's profile settings
2. The client exchanges credentials for an access token
3. Tokens are cached and automatically refreshed before expiry

### Rate Limiting

The Datto RMM API has rate limits. Check the `X-RateLimit-*` headers in responses for current limits and usage. The MCP server includes a `get-rate-limit` tool to check your current status.

### Platforms

All packages support all 6 Datto RMM regional platforms:

- Pinotage
- Merlot
- Concord
- Vidal
- Zinfandel
- Syrah
