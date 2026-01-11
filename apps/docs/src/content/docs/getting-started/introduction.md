---
title: Introduction
description: An introduction to the Datto RMM tooling monorepo
---

Welcome to the Datto RMM Tooling documentation. This monorepo provides a complete toolkit for working with [Datto RMM](https://www.datto.com/products/rmm): an MCP server for AI assistant integration, type-safe API clients, and comprehensive documentation.

## What's in this Monorepo?

This repository contains:

- **MCP Server** (`datto-rmm-mcp-server`) - Integrate Datto RMM with AI assistants like Claude
- **TypeScript Client** (`datto-rmm-api`) - Fully typed API client with auto-generated types
- **Rust Client** (`datto-api`) - Async Rust client with OAuth support
- **Documentation** - This documentation site

### Available Packages

| Package | Description | Status |
|---------|-------------|--------|
| [datto-rmm-mcp-server](../../api/mcp-server/) | MCP server for AI assistants | Stable |
| [datto-rmm-api](../../api/typescript-client/) | TypeScript API client | Stable |
| [datto-api](../../api/rust-client/) | Rust API client | Stable |

## Key Features

- **AI Integration** - Use natural language to manage Datto RMM through the MCP server
- **Auto-generated types** from OpenAPI 3.1.0 specification
- **OAuth 2.0 authentication** with automatic token refresh
- **All 6 Datto RMM platforms** supported (Pinotage, Merlot, Concord, Vidal, Zinfandel, Syrah)
- **Type-safe API calls** with full IDE autocomplete

## Quick Examples

### MCP Server (AI Integration)

Configure in Claude Desktop and interact with natural language:

```
> "Show me all offline devices"
> "What open alerts do we have?"
> "Get the audit information for device abc-123"
```

### TypeScript Client

```typescript
import { createDattoClient, Platform } from 'datto-rmm-api';

const client = createDattoClient({
  platform: Platform.MERLOT,
  auth: {
    apiKey: process.env.DATTO_API_KEY!,
    apiSecret: process.env.DATTO_API_SECRET!,
  },
});

// Fully typed - your IDE will autocomplete paths and parameters
const { data, error } = await client.GET('/v2/account/devices');
```

## Getting Started

1. **[Quick Start](../quick-start/)** - Install and set up the packages
2. **[Project Structure](../project-structure/)** - Understand the codebase
3. **[MCP Server](../../api/mcp-server/)** - AI assistant integration guide
4. **[TypeScript Client](../../api/typescript-client/)** - Full TypeScript usage guide
5. **[Rust Client](../../api/rust-client/)** - Rust client documentation

## Datto RMM API

The clients are generated from the official Datto RMM OpenAPI specification. The API provides access to:

- **Devices** - Inventory, status, and management
- **Alerts** - Monitoring and resolution
- **Sites** - Site configuration and settings
- **Jobs** - Quick job scheduling
- **Audit** - Software, hardware, and configuration data
- **Users** - User management
- **Activity Logs** - Audit trail of actions

For the official API documentation, see:

- [Datto RMM API Guide](https://rmm.datto.com/help/en/Content/2SETUP/APIv2.htm)
- [Swagger UI](https://merlot-api.centrastage.net/api/swagger-ui/index.html)
