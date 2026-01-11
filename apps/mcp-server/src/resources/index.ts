import type { DattoClient } from '@datto-rmm/api';
import { formatError } from '../utils/formatting.js';
import { handleResponse } from '../utils/response.js';
import type * as T from '../types.js';

/**
 * Resource definition for MCP.
 */
export interface ResourceDefinition {
  uri: string;
  name: string;
  description: string;
  mimeType: string;
}

/**
 * Resource template definition for MCP.
 */
export interface ResourceTemplateDefinition {
  uriTemplate: string;
  name: string;
  description: string;
  mimeType: string;
}

/**
 * Static resources available.
 */
export const resources: ResourceDefinition[] = [
  {
    uri: 'datto://account',
    name: 'Account Information',
    description: 'Overview of the Datto RMM account',
    mimeType: 'text/plain',
  },
  {
    uri: 'datto://sites',
    name: 'All Sites',
    description: 'List of all managed sites',
    mimeType: 'text/plain',
  },
  {
    uri: 'datto://alerts/open',
    name: 'Open Alerts',
    description: 'All currently open alerts across the account',
    mimeType: 'text/plain',
  },
];

/**
 * Resource templates (dynamic resources).
 */
export const resourceTemplates: ResourceTemplateDefinition[] = [
  {
    uriTemplate: 'datto://sites/{siteUid}',
    name: 'Site Details',
    description: 'Detailed information about a specific site',
    mimeType: 'text/plain',
  },
  {
    uriTemplate: 'datto://sites/{siteUid}/devices',
    name: 'Site Devices',
    description: 'Devices in a specific site',
    mimeType: 'text/plain',
  },
  {
    uriTemplate: 'datto://devices/{deviceUid}',
    name: 'Device Details',
    description: 'Detailed information about a specific device',
    mimeType: 'text/plain',
  },
];

/**
 * Read a resource by URI.
 */
export async function readResource(
  client: DattoClient,
  uri: string
): Promise<{ contents: Array<{ uri: string; mimeType: string; text: string }> }> {
  // Parse the URI
  const url = new URL(uri);
  const path = url.pathname;

  try {
    // datto://account
    if (uri === 'datto://account') {
      const response = await client.GET('/v2/account');
      const data = handleResponse<T.Account>(response);

      const text = [
        `# Account: ${data.name ?? 'Unknown'}`,
        '',
        `UID: ${data.uid}`,
        `Time Zone: ${data.descriptor?.timeZone ?? 'N/A'}`,
        '',
        '## Device Summary',
        `Total: ${data.devicesStatus?.numberOfDevices ?? 0}`,
        `Online: ${data.devicesStatus?.numberOfOnlineDevices ?? 0}`,
        `Offline: ${data.devicesStatus?.numberOfOfflineDevices ?? 0}`,
      ].join('\n');

      return { contents: [{ uri, mimeType: 'text/plain', text }] };
    }

    // datto://sites
    if (uri === 'datto://sites') {
      const response = await client.GET('/v2/account/sites', {
        params: { query: { max: 100 } },
      });
      const data = handleResponse<T.SitesPage>(response);

      const lines = ['# Sites', ''];
      for (const site of data.sites ?? []) {
        lines.push(`- ${site.name} (${site.uid})`);
        lines.push(`  Devices: ${site.devicesStatus?.numberOfDevices ?? 0}`);
      }

      return { contents: [{ uri, mimeType: 'text/plain', text: lines.join('\n') }] };
    }

    // datto://alerts/open
    if (uri === 'datto://alerts/open') {
      const response = await client.GET('/v2/account/alerts/open', {
        params: { query: { max: 50 } },
      });
      const data = handleResponse<T.AlertsPage>(response);

      const lines = [`# Open Alerts (${data.pageDetails?.count ?? 0} total)`, ''];
      for (const alert of data.alerts ?? []) {
        lines.push(`- [${alert.priority}] ${alert.alertUid}`);
        lines.push(`  Device: ${alert.alertSourceInfo?.deviceName ?? 'N/A'}`);
        if (alert.diagnostics) {
          lines.push(`  Diagnostics: ${alert.diagnostics}`);
        }
        lines.push('');
      }

      return { contents: [{ uri, mimeType: 'text/plain', text: lines.join('\n') }] };
    }

    // datto://sites/{siteUid}
    const siteMatch = path.match(/^\/sites\/([^/]+)$/);
    if (siteMatch) {
      const siteUid = siteMatch[1]!;
      const response = await client.GET('/v2/site/{siteUid}', {
        params: { path: { siteUid } },
      });
      const data = handleResponse<T.Site>(response);

      const text = [
        `# Site: ${data.name}`,
        '',
        `UID: ${data.uid}`,
        `Description: ${data.description ?? 'N/A'}`,
        '',
        '## Devices',
        `Total: ${data.devicesStatus?.numberOfDevices ?? 0}`,
        `Online: ${data.devicesStatus?.numberOfOnlineDevices ?? 0}`,
        `Offline: ${data.devicesStatus?.numberOfOfflineDevices ?? 0}`,
      ].join('\n');

      return { contents: [{ uri, mimeType: 'text/plain', text }] };
    }

    // datto://sites/{siteUid}/devices
    const siteDevicesMatch = path.match(/^\/sites\/([^/]+)\/devices$/);
    if (siteDevicesMatch) {
      const siteUid = siteDevicesMatch[1]!;
      const response = await client.GET('/v2/site/{siteUid}/devices', {
        params: { path: { siteUid }, query: { max: 100 } },
      });
      const data = handleResponse<T.DevicesPage>(response);

      const lines = ['# Site Devices', ''];
      for (const device of data.devices ?? []) {
        const status = device.online ? 'Online' : 'Offline';
        lines.push(`- ${device.hostname} [${status}]`);
        lines.push(`  UID: ${device.uid}`);
        lines.push(`  OS: ${device.operatingSystem ?? 'N/A'}`);
        lines.push('');
      }

      return { contents: [{ uri, mimeType: 'text/plain', text: lines.join('\n') }] };
    }

    // datto://devices/{deviceUid}
    const deviceMatch = path.match(/^\/devices\/([^/]+)$/);
    if (deviceMatch) {
      const deviceUid = deviceMatch[1]!;
      const response = await client.GET('/v2/device/{deviceUid}', {
        params: { path: { deviceUid } },
      });
      const data = handleResponse<T.Device>(response);

      const status = data.online ? 'Online' : 'Offline';
      const text = [
        `# Device: ${data.hostname}`,
        '',
        `UID: ${data.uid}`,
        `Status: ${status}`,
        `Site: ${data.siteName}`,
        `OS: ${data.operatingSystem ?? 'N/A'}`,
        `Type: ${data.deviceType?.type ?? 'N/A'}`,
        `Last Seen: ${data.lastSeen ?? 'N/A'}`,
      ].join('\n');

      return { contents: [{ uri, mimeType: 'text/plain', text }] };
    }

    throw new Error(`Unknown resource: ${uri}`);
  } catch (err) {
    const errorText = `Error reading resource: ${formatError(err)}`;
    return { contents: [{ uri, mimeType: 'text/plain', text: errorText }] };
  }
}
