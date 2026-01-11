import type { DattoClient } from '@datto-rmm/api';
import { normalizePagination, parsePageInfo } from '../utils/pagination.js';
import { handleResponse, handleVoidResponse, errorResult, successResult, type ToolResult } from '../utils/response.js';
import type * as T from '../types.js';

/**
 * Get device by UID.
 */
export async function getDevice(client: DattoClient, args: { deviceUid: string }): Promise<ToolResult> {
  try {
    const response = await client.GET('/v2/device/{deviceUid}', {
      params: {
        path: { deviceUid: args.deviceUid },
      },
    });
    const data = handleResponse<T.Device>(response);

    const status = data.online ? 'Online' : 'Offline';
    const lines = [
      `# Device: ${data.hostname ?? 'Unknown'}`,
      '',
      `**UID:** ${data.uid}`,
      `**ID:** ${data.id}`,
      `**Status:** ${status}`,
      '',
      '## Basic Information',
      `- **Site:** ${data.siteName ?? 'N/A'} (${data.siteUid ?? 'N/A'})`,
      `- **Device Type:** ${data.deviceType?.type ?? 'N/A'}`,
      `- **Device Class:** ${data.deviceClass ?? 'N/A'}`,
      '',
      '## System Information',
      `- **Operating System:** ${data.operatingSystem ?? 'N/A'}`,
      `- **Domain:** ${data.domain ?? 'N/A'}`,
      `- **Description:** ${data.description ?? 'N/A'}`,
      '',
      '## Status',
      `- **Last Seen:** ${data.lastSeen ?? 'N/A'}`,
      `- **Last Audit:** ${data.lastAuditDate ?? 'N/A'}`,
      `- **Last Reboot:** ${data.lastReboot ?? 'N/A'}`,
    ];

    if (data.intIpAddress || data.extIpAddress) {
      lines.push('');
      lines.push('## Network');
      lines.push(`- **Internal IP:** ${data.intIpAddress ?? 'N/A'}`);
      lines.push(`- **External IP:** ${data.extIpAddress ?? 'N/A'}`);
    }

    if (data.warrantyDate) {
      lines.push('');
      lines.push(`**Warranty Date:** ${data.warrantyDate}`);
    }

    if (data.portalUrl) {
      lines.push('');
      lines.push(`**Portal URL:** ${data.portalUrl}`);
    }

    return successResult(lines.join('\n'));
  } catch (err) {
    return errorResult(`Error fetching device: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/**
 * Get device by ID (numeric).
 */
export async function getDeviceById(client: DattoClient, args: { deviceId: number }): Promise<ToolResult> {
  try {
    const response = await client.GET('/v2/device/id/{deviceId}', {
      params: {
        path: { deviceId: args.deviceId },
      },
    });
    const data = handleResponse<T.Device>(response);

    const status = data.online ? 'Online' : 'Offline';
    const lines = [
      `# Device: ${data.hostname ?? 'Unknown'}`,
      '',
      `**UID:** ${data.uid}`,
      `**ID:** ${data.id}`,
      `**Status:** ${status}`,
      `**Site:** ${data.siteName ?? 'N/A'}`,
      `**OS:** ${data.operatingSystem ?? 'N/A'}`,
      `**Type:** ${data.deviceType?.type ?? 'N/A'}`,
    ];

    return successResult(lines.join('\n'));
  } catch (err) {
    return errorResult(`Error fetching device: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/**
 * Get device by MAC address.
 */
export async function getDeviceByMac(client: DattoClient, args: { macAddress: string }): Promise<ToolResult> {
  try {
    const response = await client.GET('/v2/device/macAddress/{macAddress}', {
      params: {
        path: { macAddress: args.macAddress },
      },
    });
    const data = handleResponse<T.Device[]>(response);

    if (data.length === 0) {
      return successResult('No devices found with this MAC address');
    }

    const lines = [
      `# Devices with MAC ${args.macAddress}`,
      '',
      `Found ${data.length} device(s)`,
      '',
    ];

    for (const device of data) {
      const status = device.online ? 'Online' : 'Offline';
      lines.push(`## ${device.hostname ?? 'Unknown'}`);
      lines.push(`- **UID:** ${device.uid}`);
      lines.push(`- **Status:** ${status}`);
      lines.push(`- **Site:** ${device.siteName ?? 'N/A'}`);
      lines.push(`- **OS:** ${device.operatingSystem ?? 'N/A'}`);
      lines.push('');
    }

    return successResult(lines.join('\n'));
  } catch (err) {
    return errorResult(`Error fetching device: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/**
 * Get device open alerts.
 */
export async function listDeviceOpenAlerts(
  client: DattoClient,
  args: { deviceUid: string; page?: number; max?: number; muted?: boolean }
): Promise<ToolResult> {
  try {
    const pagination = normalizePagination(args);

    const response = await client.GET('/v2/device/{deviceUid}/alerts/open', {
      params: {
        path: { deviceUid: args.deviceUid },
        query: {
          page: pagination.page,
          max: pagination.max,
          muted: args.muted,
        },
      },
    });
    const data = handleResponse<T.AlertsPage>(response);

    if (!data.alerts || data.alerts.length === 0) {
      return successResult('No open alerts for this device');
    }

    const pageInfo = parsePageInfo(data);
    const lines = [
      `# Device Open Alerts (${pageInfo.count} total)`,
      '',
    ];

    for (const alert of data.alerts) {
      lines.push(`## Alert ${alert.alertUid}`);
      lines.push(`- **Priority:** ${alert.priority ?? 'N/A'}`);
      lines.push(`- **Created:** ${alert.timestamp ?? 'N/A'}`);
      if (alert.diagnostics) {
        lines.push(`- **Diagnostics:** ${alert.diagnostics}`);
      }
      lines.push('');
    }

    return successResult(lines.join('\n'));
  } catch (err) {
    return errorResult(`Error listing device alerts: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/**
 * Get device resolved alerts.
 */
export async function listDeviceResolvedAlerts(
  client: DattoClient,
  args: { deviceUid: string; page?: number; max?: number; muted?: boolean }
): Promise<ToolResult> {
  try {
    const pagination = normalizePagination(args);

    const response = await client.GET('/v2/device/{deviceUid}/alerts/resolved', {
      params: {
        path: { deviceUid: args.deviceUid },
        query: {
          page: pagination.page,
          max: pagination.max,
          muted: args.muted,
        },
      },
    });
    const data = handleResponse<T.AlertsPage>(response);

    if (!data.alerts || data.alerts.length === 0) {
      return successResult('No resolved alerts for this device');
    }

    const lines = [
      '# Device Resolved Alerts',
      '',
    ];

    for (const alert of data.alerts) {
      lines.push(`## Alert ${alert.alertUid}`);
      lines.push(`- **Priority:** ${alert.priority ?? 'N/A'}`);
      lines.push(`- **Resolved:** ${alert.resolvedOn ?? 'N/A'}`);
      lines.push('');
    }

    return successResult(lines.join('\n'));
  } catch (err) {
    return errorResult(`Error listing device resolved alerts: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/**
 * Move device to another site.
 */
export async function moveDevice(
  client: DattoClient,
  args: { deviceUid: string; siteUid: string }
): Promise<ToolResult> {
  try {
    const response = await client.PUT('/v2/device/{deviceUid}/site/{siteUid}', {
      params: {
        path: {
          deviceUid: args.deviceUid,
          siteUid: args.siteUid,
        },
      },
    });
    handleVoidResponse(response);

    return successResult(`Device ${args.deviceUid} moved to site ${args.siteUid} successfully`);
  } catch (err) {
    return errorResult(`Error moving device: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/**
 * Create a quick job on a device.
 */
export async function createQuickJob(
  client: DattoClient,
  args: {
    deviceUid: string;
    jobName: string;
    componentUid: string;
    variables?: Array<{ name: string; value: string }>;
  }
): Promise<ToolResult> {
  try {
    const response = await client.PUT('/v2/device/{deviceUid}/quickjob', {
      params: {
        path: { deviceUid: args.deviceUid },
      },
      body: {
        jobName: args.jobName,
        jobComponent: {
          componentUid: args.componentUid,
          variables: args.variables,
        },
      },
    });
    const data = handleResponse<T.CreateQuickJobResponse>(response);

    const lines = [
      '# Quick Job Created',
      '',
      `**Job Name:** ${args.jobName}`,
      `**Job UID:** ${data.job?.uid ?? 'N/A'}`,
      `**Status:** ${data.job?.status ?? 'N/A'}`,
    ];

    return successResult(lines.join('\n'));
  } catch (err) {
    return errorResult(`Error creating quick job: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/**
 * Set device user-defined fields (UDF).
 */
export async function setDeviceUdf(
  client: DattoClient,
  args: {
    deviceUid: string;
    udf1?: string;
    udf2?: string;
    udf3?: string;
    udf4?: string;
    udf5?: string;
    udf6?: string;
    udf7?: string;
    udf8?: string;
    udf9?: string;
    udf10?: string;
    udf11?: string;
    udf12?: string;
    udf13?: string;
    udf14?: string;
    udf15?: string;
    udf16?: string;
    udf17?: string;
    udf18?: string;
    udf19?: string;
    udf20?: string;
    udf21?: string;
    udf22?: string;
    udf23?: string;
    udf24?: string;
    udf25?: string;
    udf26?: string;
    udf27?: string;
    udf28?: string;
    udf29?: string;
    udf30?: string;
  }
): Promise<ToolResult> {
  try {
    const { deviceUid, ...udfFields } = args;

    const response = await client.POST('/v2/device/{deviceUid}/udf', {
      params: {
        path: { deviceUid },
      },
      body: udfFields,
    });
    handleVoidResponse(response);

    return successResult(`Device UDF fields updated successfully for ${deviceUid}`);
  } catch (err) {
    return errorResult(`Error setting device UDF: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/**
 * Set device warranty date.
 */
export async function setDeviceWarranty(
  client: DattoClient,
  args: { deviceUid: string; warrantyDate?: string }
): Promise<ToolResult> {
  try {
    const response = await client.POST('/v2/device/{deviceUid}/warranty', {
      params: {
        path: { deviceUid: args.deviceUid },
      },
      body: {
        warrantyDate: args.warrantyDate,
      },
    });
    handleVoidResponse(response);

    const dateDisplay = args.warrantyDate ?? 'cleared';
    return successResult(`Device warranty date ${dateDisplay} for ${args.deviceUid}`);
  } catch (err) {
    return errorResult(`Error setting device warranty: ${err instanceof Error ? err.message : String(err)}`);
  }
}
