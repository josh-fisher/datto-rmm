# @datto-rmm/mcp-server

MCP (Model Context Protocol) server for Datto RMM. Enables AI assistants like Claude to interact with your Datto RMM account.

## Features

- **39 MCP Tools** covering the complete Datto RMM API
- **6 MCP Resources** for browsable data hierarchies
- **Full OAuth 2.0 support** with automatic token management
- **All 6 Datto platforms** supported (Pinotage, Merlot, Concord, Vidal, Zinfandel, Syrah)
- **Type-safe** - Built on the `@datto-rmm/api` package

## Installation

```bash
npm install @datto-rmm/mcp-server
# or
pnpm add @datto-rmm/mcp-server
```

## Configuration

The server requires the following environment variables:

| Variable | Required | Description |
|----------|----------|-------------|
| `DATTO_API_KEY` | Yes | Your Datto RMM API key |
| `DATTO_API_SECRET` | Yes | Your Datto RMM API secret |
| `DATTO_PLATFORM` | No | Platform name (default: `merlot`) |

### Platform Options

- `pinotage` - Asia Pacific
- `merlot` - US East (default)
- `concord` - US West
- `vidal` - EU (Frankfurt)
- `zinfandel` - EU (London)
- `syrah` - Canada

## Usage with Claude Desktop

Add to your Claude Desktop configuration (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "datto-rmm": {
      "command": "npx",
      "args": ["@datto-rmm/mcp-server"],
      "env": {
        "DATTO_API_KEY": "your-api-key",
        "DATTO_API_SECRET": "your-api-secret",
        "DATTO_PLATFORM": "merlot"
      }
    }
  }
}
```

## Available Tools

### Account Operations
| Tool | Description |
|------|-------------|
| `get-account` | Get account information and device status summary |
| `list-sites` | List all sites with filtering |
| `list-devices` | List all devices with filtering by hostname, site, type, OS |
| `list-users` | List account users |
| `list-account-variables` | List account-level variables |
| `list-components` | List available job components |
| `list-open-alerts` | List all open alerts |
| `list-resolved-alerts` | List resolved alerts |

### Site Operations
| Tool | Description |
|------|-------------|
| `get-site` | Get detailed site information |
| `list-site-devices` | List devices in a site |
| `list-site-open-alerts` | List open alerts for a site |
| `list-site-resolved-alerts` | List resolved alerts for a site |
| `list-site-variables` | List site variables |
| `get-site-settings` | Get site settings (proxy, etc.) |
| `list-site-filters` | List device filters for a site |
| `create-site` | Create a new site |
| `update-site` | Update site details |

### Device Operations
| Tool | Description |
|------|-------------|
| `get-device` | Get device details by UID |
| `get-device-by-id` | Get device by numeric ID |
| `get-device-by-mac` | Find devices by MAC address |
| `list-device-open-alerts` | List open alerts for a device |
| `list-device-resolved-alerts` | List resolved alerts for a device |
| `move-device` | Move device to another site |
| `create-quick-job` | Run a quick job on a device |
| `set-device-udf` | Set user-defined fields |
| `set-device-warranty` | Set warranty date |

### Alert Operations
| Tool | Description |
|------|-------------|
| `get-alert` | Get alert details |
| `resolve-alert` | Resolve an open alert |

### Job Operations
| Tool | Description |
|------|-------------|
| `get-job` | Get job details |
| `get-job-components` | Get job components |
| `get-job-results` | Get job results for a device |
| `get-job-stdout` | Get job stdout output |
| `get-job-stderr` | Get job stderr output |

### Audit Operations
| Tool | Description |
|------|-------------|
| `get-device-audit` | Get hardware/system audit data |
| `get-device-software` | List installed software |
| `get-device-audit-by-mac` | Get audit by MAC address |
| `get-esxi-audit` | Get ESXi host audit (incl. VMs) |
| `get-printer-audit` | Get printer audit (incl. supplies) |

### Activity & Filters
| Tool | Description |
|------|-------------|
| `get-activity-logs` | Get activity logs with filtering |
| `list-default-filters` | List default device filters |
| `list-custom-filters` | List custom device filters |

### System Operations
| Tool | Description |
|------|-------------|
| `get-system-status` | Get API system status |
| `get-rate-limit` | Get current rate limit status |
| `get-pagination-config` | Get pagination configuration |

### Variable Operations
| Tool | Description |
|------|-------------|
| `create-account-variable` | Create account variable |
| `update-account-variable` | Update account variable |
| `delete-account-variable` | Delete account variable |
| `create-site-variable` | Create site variable |
| `update-site-variable` | Update site variable |
| `delete-site-variable` | Delete site variable |
| `update-site-proxy` | Configure site proxy |
| `delete-site-proxy` | Remove site proxy |

## Available Resources

Browse data hierarchies via MCP resources:

| URI | Description |
|-----|-------------|
| `datto://account` | Account overview |
| `datto://sites` | List of all sites |
| `datto://sites/{siteUid}` | Site details |
| `datto://sites/{siteUid}/devices` | Devices in a site |
| `datto://devices/{deviceUid}` | Device details |
| `datto://alerts/open` | Open alerts summary |

## Example Queries

Once connected, you can ask Claude things like:

- "List all my Datto RMM sites"
- "Show me all offline devices"
- "What are the open alerts for the Main Office site?"
- "Get the hardware specs for device xyz123"
- "What software is installed on the server?"
- "Run the Windows Update component on device abc456"
- "Show me the activity logs from the last hour"

## Development

```bash
# Install dependencies
pnpm install

# Build
pnpm build

# Run in development mode
DATTO_API_KEY=xxx DATTO_API_SECRET=yyy pnpm dev
```

## License

MIT
