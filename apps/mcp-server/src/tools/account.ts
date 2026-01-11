import type { DattoClient } from 'datto-rmm-api';
import { normalizePagination, parsePageInfo } from '../utils/pagination.js';
import { handleResponse, errorResult, successResult, type ToolResult } from '../utils/response.js';
import type * as T from '../types.js';

/**
 * Get account information.
 */
export async function getAccount(client: DattoClient): Promise<ToolResult> {
  try {
    const response = await client.GET('/v2/account');
    const data = handleResponse<T.Account>(response);

    const lines = [
      '# Account Information',
      '',
      `**Name:** ${data.name ?? 'N/A'}`,
      `**UID:** ${data.uid ?? 'N/A'}`,
      `**ID:** ${data.id ?? 'N/A'}`,
      `**Currency:** ${data.currency ?? 'N/A'}`,
      '',
      '## Device Status',
      `- Total Devices: ${data.devicesStatus?.numberOfDevices ?? 0}`,
      `- Online: ${data.devicesStatus?.numberOfOnlineDevices ?? 0}`,
      `- Offline: ${data.devicesStatus?.numberOfOfflineDevices ?? 0}`,
    ];

    if (data.descriptor) {
      lines.push('');
      lines.push('## Account Details');
      lines.push(`- **Device Limit:** ${data.descriptor.deviceLimit ?? 'N/A'}`);
      lines.push(`- **Time Zone:** ${data.descriptor.timeZone ?? 'N/A'}`);
    }

    return successResult(lines.join('\n'));
  } catch (err) {
    return errorResult(`Error fetching account: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/**
 * List all sites in the account.
 */
export async function listSites(
  client: DattoClient,
  args: { page?: number; max?: number; siteName?: string }
): Promise<ToolResult> {
  try {
    const pagination = normalizePagination(args);

    const response = await client.GET('/v2/account/sites', {
      params: {
        query: {
          page: pagination.page,
          max: pagination.max,
          siteName: args.siteName,
        },
      },
    });
    const data = handleResponse<T.SitesPage>(response);

    if (!data.sites || data.sites.length === 0) {
      return successResult('No sites found');
    }

    const pageInfo = parsePageInfo(data);
    const lines = [
      `# Sites (${pageInfo.count} total)`,
      '',
    ];

    if (pageInfo.totalPages > 1) {
      lines.push(`Page ${pageInfo.page} of ${pageInfo.totalPages}`);
      lines.push('');
    }

    for (const site of data.sites) {
      const deviceCount = site.devicesStatus?.numberOfDevices ?? 0;
      const onlineCount = site.devicesStatus?.numberOfOnlineDevices ?? 0;
      lines.push(`## ${site.name}`);
      lines.push(`- **UID:** ${site.uid}`);
      lines.push(`- **Devices:** ${deviceCount} (${onlineCount} online)`);
      if (site.description) {
        lines.push(`- **Description:** ${site.description}`);
      }
      lines.push('');
    }

    if (pageInfo.hasMore) {
      lines.push(`_Use page=${pageInfo.page + 1} to see more results_`);
    }

    return successResult(lines.join('\n'));
  } catch (err) {
    return errorResult(`Error listing sites: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/**
 * List all devices in the account.
 */
export async function listDevices(
  client: DattoClient,
  args: {
    page?: number;
    max?: number;
    hostname?: string;
    siteName?: string;
    deviceType?: string;
    operatingSystem?: string;
    filterId?: number;
  }
): Promise<ToolResult> {
  try {
    const pagination = normalizePagination(args);

    const response = await client.GET('/v2/account/devices', {
      params: {
        query: {
          page: pagination.page,
          max: pagination.max,
          hostname: args.hostname,
          siteName: args.siteName,
          deviceType: args.deviceType,
          operatingSystem: args.operatingSystem,
          filterId: args.filterId,
        },
      },
    });
    const data = handleResponse<T.DevicesPage>(response);

    if (!data.devices || data.devices.length === 0) {
      return successResult('No devices found');
    }

    const pageInfo = parsePageInfo(data);
    const lines = [
      `# Devices (${pageInfo.count} total)`,
      '',
    ];

    if (pageInfo.totalPages > 1) {
      lines.push(`Page ${pageInfo.page} of ${pageInfo.totalPages}`);
      lines.push('');
    }

    for (const device of data.devices) {
      const status = device.online ? 'Online' : 'Offline';
      lines.push(`## ${device.hostname ?? 'Unknown'}`);
      lines.push(`- **UID:** ${device.uid}`);
      lines.push(`- **Status:** ${status}`);
      lines.push(`- **Site:** ${device.siteName ?? 'N/A'}`);
      lines.push(`- **Type:** ${device.deviceType?.type ?? 'N/A'}`);
      lines.push(`- **OS:** ${device.operatingSystem ?? 'N/A'}`);
      if (device.lastSeen) {
        lines.push(`- **Last Seen:** ${device.lastSeen}`);
      }
      lines.push('');
    }

    if (pageInfo.hasMore) {
      lines.push(`_Use page=${pageInfo.page + 1} to see more results_`);
    }

    return successResult(lines.join('\n'));
  } catch (err) {
    return errorResult(`Error listing devices: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/**
 * List users in the account.
 */
export async function listUsers(
  client: DattoClient,
  args: { page?: number; max?: number }
): Promise<ToolResult> {
  try {
    const pagination = normalizePagination(args);

    const response = await client.GET('/v2/account/users', {
      params: {
        query: {
          page: pagination.page,
          max: pagination.max,
        },
      },
    });
    const data = handleResponse<T.UsersPage>(response);

    if (!data.users || data.users.length === 0) {
      return successResult('No users found');
    }

    const pageInfo = parsePageInfo(data);
    const lines = [
      `# Users (${pageInfo.count} total)`,
      '',
    ];

    for (const user of data.users) {
      lines.push(`## ${user.email ?? user.username ?? 'Unknown'}`);
      lines.push(`- **Username:** ${user.username ?? 'N/A'}`);
      lines.push(`- **First Name:** ${user.firstName ?? 'N/A'}`);
      lines.push(`- **Last Name:** ${user.lastName ?? 'N/A'}`);
      lines.push(`- **Status:** ${user.status ?? 'N/A'}`);
      lines.push('');
    }

    return successResult(lines.join('\n'));
  } catch (err) {
    return errorResult(`Error listing users: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/**
 * List account variables.
 */
export async function listAccountVariables(
  client: DattoClient,
  args: { page?: number; max?: number }
): Promise<ToolResult> {
  try {
    const pagination = normalizePagination(args);

    const response = await client.GET('/v2/account/variables', {
      params: {
        query: {
          page: pagination.page,
          max: pagination.max,
        },
      },
    });
    const data = handleResponse<T.VariablesPage>(response);

    if (!data.variables || data.variables.length === 0) {
      return successResult('No account variables found');
    }

    const lines = [
      '# Account Variables',
      '',
    ];

    for (const variable of data.variables) {
      const value = variable.masked ? '********' : (variable.value ?? 'N/A');
      lines.push(`- **${variable.name}:** ${value}${variable.masked ? ' (masked)' : ''}`);
    }

    return successResult(lines.join('\n'));
  } catch (err) {
    return errorResult(`Error listing account variables: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/**
 * List available components.
 */
export async function listComponents(
  client: DattoClient,
  args: { page?: number; max?: number }
): Promise<ToolResult> {
  try {
    const pagination = normalizePagination(args);

    const response = await client.GET('/v2/account/components', {
      params: {
        query: {
          page: pagination.page,
          max: pagination.max,
        },
      },
    });
    const data = handleResponse<T.ComponentsPage>(response);

    if (!data.components || data.components.length === 0) {
      return successResult('No components found');
    }

    const pageInfo = parsePageInfo(data);
    const lines = [
      `# Components (${pageInfo.count} total)`,
      '',
    ];

    for (const component of data.components) {
      lines.push(`## ${component.name ?? 'Unknown'}`);
      lines.push(`- **UID:** ${component.uid}`);
      lines.push(`- **Category:** ${component.categoryCode ?? 'N/A'}`);
      if (component.description) {
        lines.push(`- **Description:** ${component.description}`);
      }
      lines.push('');
    }

    return successResult(lines.join('\n'));
  } catch (err) {
    return errorResult(`Error listing components: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/**
 * List open alerts for the account.
 */
export async function listOpenAlerts(
  client: DattoClient,
  args: { page?: number; max?: number; muted?: boolean }
): Promise<ToolResult> {
  try {
    const pagination = normalizePagination(args);

    const response = await client.GET('/v2/account/alerts/open', {
      params: {
        query: {
          page: pagination.page,
          max: pagination.max,
          muted: args.muted,
        },
      },
    });
    const data = handleResponse<T.AlertsPage>(response);

    if (!data.alerts || data.alerts.length === 0) {
      return successResult('No open alerts found');
    }

    const pageInfo = parsePageInfo(data);
    const lines = [
      `# Open Alerts (${pageInfo.count} total)`,
      '',
    ];

    if (pageInfo.totalPages > 1) {
      lines.push(`Page ${pageInfo.page} of ${pageInfo.totalPages}`);
      lines.push('');
    }

    for (const alert of data.alerts) {
      lines.push(`## Alert ${alert.alertUid}`);
      lines.push(`- **Priority:** ${alert.priority ?? 'N/A'}`);
      lines.push(`- **Device:** ${alert.alertSourceInfo?.deviceName ?? 'N/A'}`);
      lines.push(`- **Device UID:** ${alert.alertSourceInfo?.deviceUid ?? 'N/A'}`);
      lines.push(`- **Site:** ${alert.alertSourceInfo?.siteName ?? 'N/A'}`);
      lines.push(`- **Created:** ${alert.timestamp ?? 'N/A'}`);
      if (alert.diagnostics) {
        lines.push(`- **Diagnostics:** ${alert.diagnostics}`);
      }
      lines.push('');
    }

    if (pageInfo.hasMore) {
      lines.push(`_Use page=${pageInfo.page + 1} to see more results_`);
    }

    return successResult(lines.join('\n'));
  } catch (err) {
    return errorResult(`Error listing open alerts: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/**
 * List resolved alerts for the account.
 */
export async function listResolvedAlerts(
  client: DattoClient,
  args: { page?: number; max?: number; muted?: boolean }
): Promise<ToolResult> {
  try {
    const pagination = normalizePagination(args);

    const response = await client.GET('/v2/account/alerts/resolved', {
      params: {
        query: {
          page: pagination.page,
          max: pagination.max,
          muted: args.muted,
        },
      },
    });
    const data = handleResponse<T.AlertsPage>(response);

    if (!data.alerts || data.alerts.length === 0) {
      return successResult('No resolved alerts found');
    }

    const pageInfo = parsePageInfo(data);
    const lines = [
      `# Resolved Alerts (${pageInfo.count} total)`,
      '',
    ];

    for (const alert of data.alerts) {
      lines.push(`## Alert ${alert.alertUid}`);
      lines.push(`- **Priority:** ${alert.priority ?? 'N/A'}`);
      lines.push(`- **Device:** ${alert.alertSourceInfo?.deviceName ?? 'N/A'}`);
      lines.push(`- **Resolved:** ${alert.resolvedOn ?? 'N/A'}`);
      lines.push(`- **Resolved By:** ${alert.resolvedBy ?? 'N/A'}`);
      lines.push('');
    }

    return successResult(lines.join('\n'));
  } catch (err) {
    return errorResult(`Error listing resolved alerts: ${err instanceof Error ? err.message : String(err)}`);
  }
}
