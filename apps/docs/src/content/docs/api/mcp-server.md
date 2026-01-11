---
title: MCP Server
description: Using the datto-rmm-mcp-server for AI assistant integration
---

The `datto-rmm-mcp-server` package provides a [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) server that exposes Datto RMM functionality to AI assistants like Claude.

## Overview

MCP is a protocol that allows AI assistants to interact with external tools and data sources. The Datto RMM MCP server exposes 39+ tools for managing devices, sites, alerts, and more through natural language interactions.

## Installation

```bash
pnpm add datto-rmm-mcp-server
```

## Configuration

### Environment Variables

The MCP server requires the following environment variables:

```bash
# Required
DATTO_API_KEY=your-api-key
DATTO_API_SECRET=your-api-secret
DATTO_PLATFORM=merlot  # or pinotage, concord, vidal, zinfandel, syrah
```

### Claude Desktop Configuration

Add the server to your Claude Desktop configuration (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "datto-rmm": {
      "command": "node",
      "args": ["/path/to/datto-rmm/apps/mcp-server/dist/index.js"],
      "env": {
        "DATTO_API_KEY": "your-api-key",
        "DATTO_API_SECRET": "your-api-secret",
        "DATTO_PLATFORM": "merlot"
      }
    }
  }
}
```

### Running Standalone

```bash
# From the monorepo root
cd apps/mcp-server
pnpm build

# Set environment variables
export DATTO_API_KEY=your-api-key
export DATTO_API_SECRET=your-api-secret
export DATTO_PLATFORM=merlot

# Run the server
node dist/index.js
```

## Available Tools

### Account Tools

| Tool | Description |
|------|-------------|
| `get-account` | Get account details and device summary |
| `list-account-sites` | List all sites in the account |
| `list-account-devices` | List all devices in the account |
| `list-account-open-alerts` | List all open alerts |
| `list-account-resolved-alerts` | List resolved alerts |
| `list-account-users` | List account users |
| `list-account-components` | List available components |

### Site Tools

| Tool | Description |
|------|-------------|
| `get-site` | Get site details by UID |
| `list-site-devices` | List devices in a site |
| `list-site-open-alerts` | List open alerts for a site |
| `list-site-resolved-alerts` | List resolved alerts for a site |
| `create-site` | Create a new site |
| `update-site` | Update site settings |
| `set-site-proxy` | Configure site proxy settings |
| `delete-site-proxy` | Remove site proxy settings |
| `get-site-settings` | Get site settings |
| `get-site-variables` | Get site variables |
| `set-site-variable` | Set a site variable |
| `delete-site-variable` | Delete a site variable |

### Device Tools

| Tool | Description |
|------|-------------|
| `get-device` | Get device details by UID |
| `get-device-by-id` | Get device by numeric ID |
| `get-device-by-mac` | Find devices by MAC address |
| `list-device-open-alerts` | List open alerts for a device |
| `list-device-resolved-alerts` | List resolved alerts for a device |
| `move-device` | Move device to another site |
| `create-quick-job` | Run a component on a device |
| `set-device-udf` | Set user-defined fields |
| `set-device-warranty` | Set warranty date |

### Alert Tools

| Tool | Description |
|------|-------------|
| `get-alert` | Get alert details |
| `resolve-alert` | Resolve an alert |

### Job Tools

| Tool | Description |
|------|-------------|
| `get-job` | Get job details |
| `get-job-components` | List job components |
| `get-job-results` | Get job execution results |
| `get-job-stdout` | Get job standard output |
| `get-job-stderr` | Get job error output |

### Audit Tools

| Tool | Description |
|------|-------------|
| `get-device-audit` | Get device hardware/software audit |
| `get-device-software` | List installed software |
| `get-device-audit-by-mac` | Get audit data by MAC address |
| `get-esxi-audit` | Get ESXi host audit data |
| `get-printer-audit` | Get printer audit data |

### Activity Tools

| Tool | Description |
|------|-------------|
| `get-activity-logs` | Get activity/audit logs |

### System Tools

| Tool | Description |
|------|-------------|
| `get-system-status` | Get API system status |
| `get-rate-limit` | Get current rate limit status |
| `get-pagination-config` | Get pagination configuration |

## Available Resources

MCP resources provide read-only access to commonly needed data:

| Resource URI | Description |
|--------------|-------------|
| `datto://account` | Account overview with device counts |
| `datto://sites` | List of all managed sites |
| `datto://alerts/open` | Currently open alerts |
| `datto://sites/{siteUid}` | Details for a specific site |
| `datto://sites/{siteUid}/devices` | Devices in a specific site |
| `datto://devices/{deviceUid}` | Details for a specific device |

## Example Interactions

Once configured, you can interact with Datto RMM through natural language:

### View Account Status
> "Show me my Datto RMM account status and how many devices are online"

### Find Problem Devices
> "List all devices that are currently offline"

### Investigate Alerts
> "What open alerts do we have? Show me the high priority ones"

### Device Information
> "Get the audit information for device abc-123, including installed software"

### Site Management
> "How many devices are at the Main Office site?"

### Job Execution
> "Run the 'Windows Update' component on device xyz-456"

## Pagination

Tools that return lists support pagination:

- `page`: Page number (1-based, default: 1)
- `max`: Items per page (default: 50)

Example: "List the second page of devices, 25 per page"

## Output Format

All tools return human-readable markdown output with:
- Headers for organization
- Bold labels for key fields
- Lists for multiple items
- Status indicators (Online/Offline, Resolved/Open)

## Error Handling

The server handles errors gracefully:
- Authentication errors return clear messages about credentials
- Rate limiting is reported with current limits
- Invalid parameters are validated before API calls
- Network errors include retry guidance

## Security Considerations

- API credentials are passed via environment variables, not stored in config files
- The server runs locally and communicates via stdio
- No credentials are logged or exposed in tool outputs
- All API calls use HTTPS with OAuth 2.0 authentication

## Troubleshooting

### Server Won't Start

1. Verify environment variables are set:
   ```bash
   echo $DATTO_API_KEY
   echo $DATTO_PLATFORM
   ```

2. Check the platform name is valid (lowercase):
   - `pinotage`, `merlot`, `concord`, `vidal`, `zinfandel`, `syrah`

3. Ensure the package is built:
   ```bash
   cd apps/mcp-server && pnpm build
   ```

### Authentication Errors

1. Verify your API key and secret are correct (keys are generated per-user in Datto RMM)
2. Check that your user account has the required permissions for the operations you're performing
3. Ensure the platform matches your account's region

### Rate Limiting

Use the `get-rate-limit` tool to check your current rate limit status. The API has rolling rate limits per account.
