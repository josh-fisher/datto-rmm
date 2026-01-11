# Datto RMM MCP Server Implementation Plan

## Problem Statement

There is no MCP (Model Context Protocol) server for Datto RMM, which means AI assistants like Claude, Cursor, and other MCP-compatible tools cannot directly interact with Datto RMM data. This limits the ability of MSPs and IT administrators to use AI for:

- Querying device status and information across managed sites
- Monitoring and responding to alerts
- Running quick jobs on devices
- Auditing software and hardware inventory
- Analyzing activity logs and user actions

This project already has a fully-typed TypeScript API client (`@datto-rmm/api`) with OAuth 2.0 support, making it the ideal foundation for an MCP server.

---

## Proposed Solution

Create a new app `apps/mcp-server` that implements a full-featured MCP server using the `@modelcontextprotocol/sdk`. The server will:

1. **Leverage the existing `@datto-rmm/api` package** for all API interactions
2. **Expose MCP Tools** for read and write operations
3. **Expose MCP Resources** for browsable data hierarchies
4. **Support all 6 Datto platforms** (Pinotage, Merlot, Concord, Vidal, Zinfandel, Syrah)
5. **Handle pagination automatically** for list operations
6. **Provide rich, structured responses** suitable for AI consumption

### Why TypeScript (Not Rust)

- **MCP SDK maturity**: The official `@modelcontextprotocol/sdk` is TypeScript-first
- **API client ready**: `@datto-rmm/api` already handles OAuth complexity
- **I/O bound, not CPU bound**: HTTP latency dominates; Rust's speed advantage is negligible
- **Faster iteration**: TypeScript enables rapid development and debugging
- **Community alignment**: Most MCP server examples and patterns are TypeScript

---

## Complete API Endpoint Mapping

Based on analysis of the OpenAPI spec (`specs/datto-rmm-openapi.json`), here are all available endpoints organized by domain:

### Account Operations (`/v2/account`)
| Endpoint | Method | Description | MCP Mapping |
|----------|--------|-------------|-------------|
| `/v2/account` | GET | Get authenticated user's account | Tool: `get-account` |
| `/v2/account/sites` | GET | List all sites (paginated, filterable) | Tool: `list-sites` |
| `/v2/account/devices` | GET | List all devices (paginated, filterable) | Tool: `list-devices` |
| `/v2/account/users` | GET | List account users | Tool: `list-users` |
| `/v2/account/variables` | GET | List account variables | Tool: `list-account-variables` |
| `/v2/account/variable` | PUT | Create account variable | Tool: `create-account-variable` |
| `/v2/account/variable/{id}` | POST | Update account variable | Tool: `update-account-variable` |
| `/v2/account/variable/{id}` | DELETE | Delete account variable | Tool: `delete-account-variable` |
| `/v2/account/components` | GET | List available components | Tool: `list-components` |
| `/v2/account/alerts/open` | GET | List open alerts | Tool: `list-open-alerts` |
| `/v2/account/alerts/resolved` | GET | List resolved alerts | Tool: `list-resolved-alerts` |
| `/v2/account/dnet-site-mappings` | GET | List Datto Network site mappings | Tool: `list-dnet-mappings` |

### Site Operations (`/v2/site`)
| Endpoint | Method | Description | MCP Mapping |
|----------|--------|-------------|-------------|
| `/v2/site` | PUT | Create new site | Tool: `create-site` |
| `/v2/site/{uid}` | GET | Get site details | Tool: `get-site` |
| `/v2/site/{uid}` | POST | Update site | Tool: `update-site` |
| `/v2/site/{uid}/devices` | GET | List site devices | Tool: `list-site-devices` |
| `/v2/site/{uid}/devices/network-interface` | GET | List devices with network info | Tool: `list-site-devices-network` |
| `/v2/site/{uid}/alerts/open` | GET | List site open alerts | Tool: `list-site-open-alerts` |
| `/v2/site/{uid}/alerts/resolved` | GET | List site resolved alerts | Tool: `list-site-resolved-alerts` |
| `/v2/site/{uid}/variables` | GET | List site variables | Tool: `list-site-variables` |
| `/v2/site/{uid}/variable` | PUT | Create site variable | Tool: `create-site-variable` |
| `/v2/site/{uid}/variable/{id}` | POST | Update site variable | Tool: `update-site-variable` |
| `/v2/site/{uid}/variable/{id}` | DELETE | Delete site variable | Tool: `delete-site-variable` |
| `/v2/site/{uid}/settings` | GET | Get site settings | Tool: `get-site-settings` |
| `/v2/site/{uid}/settings/proxy` | POST | Update site proxy | Tool: `update-site-proxy` |
| `/v2/site/{uid}/settings/proxy` | DELETE | Delete site proxy | Tool: `delete-site-proxy` |
| `/v2/site/{uid}/filters` | GET | List site device filters | Tool: `list-site-filters` |

### Device Operations (`/v2/device`)
| Endpoint | Method | Description | MCP Mapping |
|----------|--------|-------------|-------------|
| `/v2/device/{uid}` | GET | Get device by UID | Tool: `get-device` |
| `/v2/device/id/{id}` | GET | Get device by ID | Tool: `get-device-by-id` |
| `/v2/device/macAddress/{mac}` | GET | Get device(s) by MAC | Tool: `get-device-by-mac` |
| `/v2/device/{uid}/site/{siteUid}` | PUT | Move device to site | Tool: `move-device` |
| `/v2/device/{uid}/quickjob` | PUT | Create quick job | Tool: `create-quick-job` |
| `/v2/device/{uid}/alerts/open` | GET | List device open alerts | Tool: `list-device-open-alerts` |
| `/v2/device/{uid}/alerts/resolved` | GET | List device resolved alerts | Tool: `list-device-resolved-alerts` |
| `/v2/device/{uid}/udf` | POST | Set user-defined fields | Tool: `set-device-udf` |
| `/v2/device/{uid}/warranty` | POST | Set device warranty | Tool: `set-device-warranty` |

### Alert Operations (`/v2/alert`)
| Endpoint | Method | Description | MCP Mapping |
|----------|--------|-------------|-------------|
| `/v2/alert/{uid}` | GET | Get alert details | Tool: `get-alert` |
| `/v2/alert/{uid}/resolve` | POST | Resolve alert | Tool: `resolve-alert` |

### Job Operations (`/v2/job`)
| Endpoint | Method | Description | MCP Mapping |
|----------|--------|-------------|-------------|
| `/v2/job/{uid}` | GET | Get job details | Tool: `get-job` |
| `/v2/job/{uid}/components` | GET | Get job components | Tool: `get-job-components` |
| `/v2/job/{uid}/results/{deviceUid}` | GET | Get job results for device | Tool: `get-job-results` |
| `/v2/job/{uid}/results/{deviceUid}/stdout` | GET | Get job stdout | Tool: `get-job-stdout` |
| `/v2/job/{uid}/results/{deviceUid}/stderr` | GET | Get job stderr | Tool: `get-job-stderr` |

### Audit Operations (`/v2/audit`)
| Endpoint | Method | Description | MCP Mapping |
|----------|--------|-------------|-------------|
| `/v2/audit/device/{uid}` | GET | Get device audit data | Tool: `get-device-audit` |
| `/v2/audit/device/{uid}/software` | GET | Get device software | Tool: `get-device-software` |
| `/v2/audit/device/macAddress/{mac}` | GET | Get audit by MAC | Tool: `get-device-audit-by-mac` |
| `/v2/audit/esxihost/{uid}` | GET | Get ESXi host audit | Tool: `get-esxi-audit` |
| `/v2/audit/printer/{uid}` | GET | Get printer audit | Tool: `get-printer-audit` |

### Filter Operations (`/v2/filter`)
| Endpoint | Method | Description | MCP Mapping |
|----------|--------|-------------|-------------|
| `/v2/filter/default-filters` | GET | Get default filters | Tool: `list-default-filters` |
| `/v2/filter/custom-filters` | GET | Get custom filters | Tool: `list-custom-filters` |

### Activity Log Operations (`/v2/activity-logs`)
| Endpoint | Method | Description | MCP Mapping |
|----------|--------|-------------|-------------|
| `/v2/activity-logs` | GET | Get activity logs | Tool: `get-activity-logs` |

### System Operations (`/v2/system`)
| Endpoint | Method | Description | MCP Mapping |
|----------|--------|-------------|-------------|
| `/v2/system/status` | GET | Get system status | Tool: `get-system-status` |
| `/v2/system/request_rate` | GET | Get rate limit status | Tool: `get-rate-limit` |
| `/v2/system/pagination` | GET | Get pagination config | Tool: `get-pagination-config` |

### User Operations (`/v2/user`)
| Endpoint | Method | Description | MCP Mapping |
|----------|--------|-------------|-------------|
| `/v2/user/resetApiKeys` | POST | Reset API keys | Tool: `reset-api-keys` (dangerous) |

---

## Implementation Steps

### Phase 1: Project Setup

1. **Create app directory structure**
   ```
   apps/mcp-server/
   ├── package.json
   ├── tsconfig.json
   ├── src/
   │   ├── index.ts           # Server entry point
   │   ├── server.ts          # MCP server configuration
   │   ├── config.ts          # Environment/configuration
   │   ├── tools/             # MCP tool implementations
   │   │   ├── index.ts       # Tool registry
   │   │   ├── account.ts     # Account tools
   │   │   ├── sites.ts       # Site tools
   │   │   ├── devices.ts     # Device tools
   │   │   ├── alerts.ts      # Alert tools
   │   │   ├── jobs.ts        # Job tools
   │   │   ├── audit.ts       # Audit tools
   │   │   ├── filters.ts     # Filter tools
   │   │   ├── activity.ts    # Activity log tools
   │   │   └── system.ts      # System tools
   │   ├── resources/         # MCP resource implementations
   │   │   ├── index.ts       # Resource registry
   │   │   ├── sites.ts       # Site resources
   │   │   └── devices.ts     # Device resources
   │   └── utils/             # Shared utilities
   │       ├── pagination.ts  # Pagination helpers
   │       └── formatting.ts  # Response formatting
   └── README.md              # Usage documentation
   ```

2. **Configure package.json**
   ```json
   {
     "name": "@datto-rmm/mcp-server",
     "version": "0.1.0",
     "type": "module",
     "bin": {
       "datto-rmm-mcp": "./dist/index.js"
     },
     "scripts": {
       "build": "tsc",
       "dev": "tsx src/index.ts",
       "start": "node dist/index.js"
     },
     "dependencies": {
       "@datto-rmm/api": "workspace:*",
       "@modelcontextprotocol/sdk": "^1.0.0"
     }
   }
   ```

3. **Add to turbo.json pipeline**

### Phase 2: Core Infrastructure

1. **Server setup** (`src/server.ts`)
   - Initialize MCP server with stdio transport
   - Configure server metadata
   - Register tool and resource handlers

2. **Configuration** (`src/config.ts`)
   - Environment variable handling (API key, secret, platform)
   - Validation and defaults

3. **Client initialization**
   - Create Datto client on startup
   - Handle OAuth token lifecycle

### Phase 3: Tool Implementation (Priority Order)

#### Tier 1: Essential Read Operations
1. `get-account` - Account information
2. `list-sites` - All managed sites
3. `list-devices` - All devices with filtering
4. `get-device` - Single device details
5. `list-open-alerts` - Active alerts across account
6. `get-alert` - Single alert details

#### Tier 2: Site & Device Management
7. `get-site` - Site details
8. `list-site-devices` - Devices in a site
9. `list-site-open-alerts` - Alerts for a site
10. `get-device-audit` - Device hardware/software audit
11. `get-device-software` - Installed software list

#### Tier 3: Job & Activity Operations
12. `list-components` - Available job components
13. `create-quick-job` - Run a quick job on device
14. `get-job` - Job status
15. `get-job-results` - Job execution results
16. `get-job-stdout` / `get-job-stderr` - Job output
17. `get-activity-logs` - Activity audit trail

#### Tier 4: Alert Management
18. `resolve-alert` - Resolve an alert
19. `list-resolved-alerts` - Historical alerts
20. `list-device-open-alerts` - Device-specific alerts

#### Tier 5: Variables & Settings
21. `list-account-variables` - Account-level variables
22. `list-site-variables` - Site-level variables
23. `create-account-variable` / `update` / `delete`
24. `create-site-variable` / `update` / `delete`
25. `get-site-settings` - Site configuration
26. `update-site-proxy` / `delete-site-proxy`

#### Tier 6: Advanced Operations
27. `create-site` - Create new site
28. `update-site` - Modify site
29. `move-device` - Move device between sites
30. `set-device-udf` - Set user-defined fields
31. `set-device-warranty` - Set warranty date
32. `list-users` - Account users
33. `get-esxi-audit` / `get-printer-audit` - Specialized audits

#### Tier 7: System & Filters
34. `get-system-status` - API status
35. `get-rate-limit` - Rate limit status
36. `get-pagination-config` - Pagination limits
37. `list-default-filters` / `list-custom-filters` - Device filters
38. `list-site-filters` - Site-specific filters
39. `list-dnet-mappings` - Datto Network mappings

### Phase 4: Resource Implementation

MCP Resources provide browsable data hierarchies:

1. **`datto://sites`** - List of all sites
2. **`datto://sites/{uid}`** - Site details
3. **`datto://sites/{uid}/devices`** - Devices in site
4. **`datto://devices/{uid}`** - Device details
5. **`datto://alerts/open`** - Open alerts summary

### Phase 5: Documentation & Examples

1. **README.md** with:
   - Installation instructions
   - Configuration (environment variables)
   - Claude Desktop / Cursor setup
   - Tool reference with examples

2. **Update main project README**

3. **Add to docs site** (`apps/docs`)

---

## Files to Create

### New Files
| File | Purpose |
|------|---------|
| `apps/mcp-server/package.json` | Package configuration |
| `apps/mcp-server/tsconfig.json` | TypeScript configuration |
| `apps/mcp-server/src/index.ts` | Entry point |
| `apps/mcp-server/src/server.ts` | MCP server setup |
| `apps/mcp-server/src/config.ts` | Configuration handling |
| `apps/mcp-server/src/tools/index.ts` | Tool registry |
| `apps/mcp-server/src/tools/account.ts` | Account tools |
| `apps/mcp-server/src/tools/sites.ts` | Site tools |
| `apps/mcp-server/src/tools/devices.ts` | Device tools |
| `apps/mcp-server/src/tools/alerts.ts` | Alert tools |
| `apps/mcp-server/src/tools/jobs.ts` | Job tools |
| `apps/mcp-server/src/tools/audit.ts` | Audit tools |
| `apps/mcp-server/src/tools/filters.ts` | Filter tools |
| `apps/mcp-server/src/tools/activity.ts` | Activity log tools |
| `apps/mcp-server/src/tools/system.ts` | System tools |
| `apps/mcp-server/src/resources/index.ts` | Resource registry |
| `apps/mcp-server/src/resources/sites.ts` | Site resources |
| `apps/mcp-server/src/resources/devices.ts` | Device resources |
| `apps/mcp-server/src/utils/pagination.ts` | Pagination helpers |
| `apps/mcp-server/src/utils/formatting.ts` | Response formatting |
| `apps/mcp-server/README.md` | Usage documentation |

### Files to Modify
| File | Change |
|------|--------|
| `turbo.json` | Add mcp-server to build pipeline |
| `README.md` | Add MCP server to project overview |

---

## Testing Approach

### Unit Tests
1. **Tool input validation** - Ensure parameters are validated
2. **Response formatting** - Verify structured output
3. **Error handling** - Test API error scenarios
4. **Pagination logic** - Test auto-pagination

### Integration Tests
1. **Mock API server** - Test against mocked Datto API
2. **Tool execution** - End-to-end tool calls
3. **Resource browsing** - Resource URI resolution

### Manual Testing
1. **Claude Desktop integration**
   ```json
   {
     "mcpServers": {
       "datto-rmm": {
         "command": "npx",
         "args": ["@datto-rmm/mcp-server"],
         "env": {
           "DATTO_API_KEY": "...",
           "DATTO_API_SECRET": "...",
           "DATTO_PLATFORM": "merlot"
         }
       }
     }
   }
   ```

2. **MCP Inspector** - Use official MCP debugging tools

3. **Real API testing** - Test against actual Datto RMM account

---

## Potential Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Rate limiting** | API calls blocked | Implement rate limit awareness via `get-rate-limit`, add backoff |
| **Large data sets** | Memory issues, slow responses | Implement pagination limits, streaming where possible |
| **OAuth token expiry** | Failed requests mid-operation | Token manager handles refresh automatically |
| **Sensitive data exposure** | Security concern | Mask sensitive fields, warn on destructive operations |
| **API changes** | Breaking changes | Pin API version, regenerate types on spec updates |
| **Destructive operations** | Accidental data modification | Require confirmation for write operations, clear tool descriptions |

---

## Security Considerations

1. **Credential handling**
   - API credentials via environment variables only
   - Never log credentials
   - Use secure token storage

2. **Destructive operations**
   - `reset-api-keys` should require explicit confirmation
   - Write operations should be clearly marked
   - Consider read-only mode flag

3. **Data exposure**
   - Mask sensitive variables (masked=true)
   - Don't expose internal IDs unnecessarily
   - Respect API access controls

---

## Success Criteria

1. **All 39 tools implemented** and documented
2. **Resource browsing** works for sites and devices
3. **Claude Desktop integration** verified
4. **npm publishable** as `@datto-rmm/mcp-server`
5. **Documentation** complete in apps/docs
6. **Tests passing** for critical paths

---

## Future Enhancements

1. **Prompts** - Pre-built prompt templates for common queries
2. **Caching** - Cache frequently-accessed data
3. **Webhooks** - Real-time alert notifications (if Datto supports)
4. **Multi-account** - Support multiple Datto accounts
5. **Offline mode** - Cache data for offline querying

---

## Decision Points

Before implementation, confirm:

1. **Tool naming convention**: `kebab-case` (recommended) vs `camelCase`?
2. **Pagination behavior**: Auto-paginate all results vs return first page with "more available" indicator?
3. **Write operations**: Include all write operations or start read-only?
4. **npm package name**: `@datto-rmm/mcp-server` or `datto-rmm-mcp`?

---

## References

- [Model Context Protocol Specification](https://modelcontextprotocol.io/)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [Datto RMM API Documentation](https://rmm.datto.com/help/en/Content/4WEBPORTAL/APIv2/Index.htm)
- [OpenAPI Spec](specs/datto-rmm-openapi.json)
