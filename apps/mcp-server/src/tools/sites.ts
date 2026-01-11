import type { DattoClient } from 'datto-rmm-api';
import { normalizePagination, parsePageInfo } from '../utils/pagination.js';
import { handleResponse, handleVoidResponse, errorResult, successResult, type ToolResult } from '../utils/response.js';
import type * as T from '../types.js';

/**
 * Get site details by UID.
 */
export async function getSite(client: DattoClient, args: { siteUid: string }): Promise<ToolResult> {
  try {
    const response = await client.GET('/v2/site/{siteUid}', {
      params: {
        path: { siteUid: args.siteUid },
      },
    });
    const data = handleResponse<T.Site>(response);

    const lines = [
      `# Site: ${data.name}`,
      '',
      `**UID:** ${data.uid}`,
      `**ID:** ${data.id}`,
      `**Account UID:** ${data.accountUid ?? 'N/A'}`,
      '',
      '## Details',
      `- **Description:** ${data.description ?? 'N/A'}`,
      `- **Notes:** ${data.notes ?? 'N/A'}`,
      `- **On Demand:** ${data.onDemand ? 'Yes' : 'No'}`,
      `- **Splashtop Auto Install:** ${data.splashtopAutoInstall ? 'Yes' : 'No'}`,
      '',
      '## Device Status',
      `- Total Devices: ${data.devicesStatus?.numberOfDevices ?? 0}`,
      `- Online: ${data.devicesStatus?.numberOfOnlineDevices ?? 0}`,
      `- Offline: ${data.devicesStatus?.numberOfOfflineDevices ?? 0}`,
    ];

    if (data.proxySettings) {
      lines.push('');
      lines.push('## Proxy Settings');
      lines.push(`- **Type:** ${data.proxySettings.type ?? 'N/A'}`);
      lines.push(`- **Host:** ${data.proxySettings.host ?? 'N/A'}`);
      lines.push(`- **Port:** ${data.proxySettings.port ?? 'N/A'}`);
    }

    if (data.portalUrl) {
      lines.push('');
      lines.push(`**Portal URL:** ${data.portalUrl}`);
    }

    return successResult(lines.join('\n'));
  } catch (err) {
    return errorResult(`Error fetching site: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/**
 * List devices in a site.
 */
export async function listSiteDevices(
  client: DattoClient,
  args: { siteUid: string; page?: number; max?: number; filterId?: number }
): Promise<ToolResult> {
  try {
    const pagination = normalizePagination(args);

    const response = await client.GET('/v2/site/{siteUid}/devices', {
      params: {
        path: { siteUid: args.siteUid },
        query: {
          page: pagination.page,
          max: pagination.max,
          filterId: args.filterId,
        },
      },
    });
    const data = handleResponse<T.DevicesPage>(response);

    if (!data.devices || data.devices.length === 0) {
      return successResult('No devices found in this site');
    }

    const pageInfo = parsePageInfo(data);
    const lines = [
      `# Site Devices (${pageInfo.count} total)`,
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
      lines.push(`- **Type:** ${device.deviceType?.type ?? 'N/A'}`);
      lines.push(`- **OS:** ${device.operatingSystem ?? 'N/A'}`);
      lines.push('');
    }

    if (pageInfo.hasMore) {
      lines.push(`_Use page=${pageInfo.page + 1} to see more results_`);
    }

    return successResult(lines.join('\n'));
  } catch (err) {
    return errorResult(`Error listing site devices: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/**
 * List open alerts for a site.
 */
export async function listSiteOpenAlerts(
  client: DattoClient,
  args: { siteUid: string; page?: number; max?: number; muted?: boolean }
): Promise<ToolResult> {
  try {
    const pagination = normalizePagination(args);

    const response = await client.GET('/v2/site/{siteUid}/alerts/open', {
      params: {
        path: { siteUid: args.siteUid },
        query: {
          page: pagination.page,
          max: pagination.max,
          muted: args.muted,
        },
      },
    });
    const data = handleResponse<T.AlertsPage>(response);

    if (!data.alerts || data.alerts.length === 0) {
      return successResult('No open alerts for this site');
    }

    const pageInfo = parsePageInfo(data);
    const lines = [
      `# Site Open Alerts (${pageInfo.count} total)`,
      '',
    ];

    for (const alert of data.alerts) {
      lines.push(`## Alert ${alert.alertUid}`);
      lines.push(`- **Priority:** ${alert.priority ?? 'N/A'}`);
      lines.push(`- **Device:** ${alert.alertSourceInfo?.deviceName ?? 'N/A'}`);
      lines.push(`- **Created:** ${alert.timestamp ?? 'N/A'}`);
      lines.push('');
    }

    return successResult(lines.join('\n'));
  } catch (err) {
    return errorResult(`Error listing site alerts: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/**
 * List resolved alerts for a site.
 */
export async function listSiteResolvedAlerts(
  client: DattoClient,
  args: { siteUid: string; page?: number; max?: number; muted?: boolean }
): Promise<ToolResult> {
  try {
    const pagination = normalizePagination(args);

    const response = await client.GET('/v2/site/{siteUid}/alerts/resolved', {
      params: {
        path: { siteUid: args.siteUid },
        query: {
          page: pagination.page,
          max: pagination.max,
          muted: args.muted,
        },
      },
    });
    const data = handleResponse<T.AlertsPage>(response);

    if (!data.alerts || data.alerts.length === 0) {
      return successResult('No resolved alerts for this site');
    }

    const lines = [
      '# Site Resolved Alerts',
      '',
    ];

    for (const alert of data.alerts) {
      lines.push(`## Alert ${alert.alertUid}`);
      lines.push(`- **Priority:** ${alert.priority ?? 'N/A'}`);
      lines.push(`- **Device:** ${alert.alertSourceInfo?.deviceName ?? 'N/A'}`);
      lines.push(`- **Resolved:** ${alert.resolvedOn ?? 'N/A'}`);
      lines.push('');
    }

    return successResult(lines.join('\n'));
  } catch (err) {
    return errorResult(`Error listing site resolved alerts: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/**
 * List site variables.
 */
export async function listSiteVariables(
  client: DattoClient,
  args: { siteUid: string; page?: number; max?: number }
): Promise<ToolResult> {
  try {
    const pagination = normalizePagination(args);

    const response = await client.GET('/v2/site/{siteUid}/variables', {
      params: {
        path: { siteUid: args.siteUid },
        query: {
          page: pagination.page,
          max: pagination.max,
        },
      },
    });
    const data = handleResponse<T.VariablesPage>(response);

    if (!data.variables || data.variables.length === 0) {
      return successResult('No variables found for this site');
    }

    const lines = [
      '# Site Variables',
      '',
    ];

    for (const variable of data.variables) {
      const value = variable.masked ? '********' : (variable.value ?? 'N/A');
      lines.push(`- **${variable.name}:** ${value}${variable.masked ? ' (masked)' : ''}`);
    }

    return successResult(lines.join('\n'));
  } catch (err) {
    return errorResult(`Error listing site variables: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/**
 * Get site settings.
 */
export async function getSiteSettings(client: DattoClient, args: { siteUid: string }): Promise<ToolResult> {
  try {
    const response = await client.GET('/v2/site/{siteUid}/settings', {
      params: {
        path: { siteUid: args.siteUid },
      },
    });
    const data = handleResponse<T.SiteSettings>(response);

    const lines = [
      '# Site Settings',
      '',
    ];

    if (data.proxySettings) {
      lines.push('## Proxy Settings');
      lines.push(`- **Type:** ${data.proxySettings.type ?? 'N/A'}`);
      lines.push(`- **Host:** ${data.proxySettings.host ?? 'N/A'}`);
      lines.push(`- **Port:** ${data.proxySettings.port ?? 'N/A'}`);
      lines.push(`- **Username:** ${data.proxySettings.username ?? 'N/A'}`);
    } else {
      lines.push('No proxy settings configured');
    }

    return successResult(lines.join('\n'));
  } catch (err) {
    return errorResult(`Error fetching site settings: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/**
 * List site device filters.
 */
export async function listSiteFilters(
  client: DattoClient,
  args: { siteUid: string; page?: number; max?: number }
): Promise<ToolResult> {
  try {
    const pagination = normalizePagination(args);

    const response = await client.GET('/v2/site/{siteUid}/filters', {
      params: {
        path: { siteUid: args.siteUid },
        query: {
          page: pagination.page,
          max: pagination.max,
        },
      },
    });
    const data = handleResponse<T.FiltersPage>(response);

    if (!data.filters || data.filters.length === 0) {
      return successResult('No filters found for this site');
    }

    const lines = [
      '# Site Device Filters',
      '',
    ];

    for (const filter of data.filters) {
      lines.push(`## ${filter.name ?? 'Unknown Filter'}`);
      lines.push(`- **ID:** ${filter.id}`);
      if (filter.description) {
        lines.push(`- **Description:** ${filter.description}`);
      }
      lines.push('');
    }

    return successResult(lines.join('\n'));
  } catch (err) {
    return errorResult(`Error listing site filters: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/**
 * Create a new site.
 */
export async function createSite(
  client: DattoClient,
  args: {
    name: string;
    description?: string;
    notes?: string;
    onDemand?: boolean;
    splashtopAutoInstall?: boolean;
  }
): Promise<ToolResult> {
  try {
    const response = await client.PUT('/v2/site', {
      body: {
        name: args.name,
        description: args.description,
        notes: args.notes,
        onDemand: args.onDemand,
        splashtopAutoInstall: args.splashtopAutoInstall,
      },
    });
    const data = handleResponse<T.Site>(response);

    return successResult(`Site "${args.name}" created successfully.\nUID: ${data.uid ?? 'N/A'}`);
  } catch (err) {
    return errorResult(`Error creating site: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/**
 * Update a site.
 */
export async function updateSite(
  client: DattoClient,
  args: {
    siteUid: string;
    name: string;
    description?: string;
    notes?: string;
    onDemand?: boolean;
    splashtopAutoInstall?: boolean;
  }
): Promise<ToolResult> {
  try {
    const response = await client.POST('/v2/site/{siteUid}', {
      params: {
        path: { siteUid: args.siteUid },
      },
      body: {
        name: args.name,
        description: args.description,
        notes: args.notes,
        onDemand: args.onDemand,
        splashtopAutoInstall: args.splashtopAutoInstall,
      },
    });
    handleVoidResponse(response);

    return successResult(`Site ${args.siteUid} updated successfully`);
  } catch (err) {
    return errorResult(`Error updating site: ${err instanceof Error ? err.message : String(err)}`);
  }
}
