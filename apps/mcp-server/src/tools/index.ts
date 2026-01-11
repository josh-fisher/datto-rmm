import type { DattoClient } from 'datto-rmm-api';

// Tool implementations
import * as accountTools from './account.js';
import * as siteTools from './sites.js';
import * as deviceTools from './devices.js';
import * as alertTools from './alerts.js';
import * as jobTools from './jobs.js';
import * as auditTools from './audit.js';
import * as activityTools from './activity.js';
import * as filterTools from './filters.js';
import * as systemTools from './system.js';
import * as variableTools from './variables.js';

/**
 * Tool definition with schema and handler.
 */
export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
  handler: (client: DattoClient, args: Record<string, unknown>) => Promise<{
    content: Array<{ type: 'text'; text: string }>;
    isError?: boolean;
  }>;
}

/**
 * All available tools.
 */
export const tools: ToolDefinition[] = [
  // ==================== Account Tools ====================
  {
    name: 'get-account',
    description: 'Get information about the authenticated Datto RMM account, including device status summary',
    inputSchema: {
      type: 'object',
      properties: {},
    },
    handler: (client) => accountTools.getAccount(client),
  },
  {
    name: 'list-sites',
    description: 'List all sites in the Datto RMM account. Supports pagination and filtering by site name.',
    inputSchema: {
      type: 'object',
      properties: {
        page: { type: 'number', description: 'Page number (default: 1)' },
        max: { type: 'number', description: 'Results per page (default: 50, max: 250)' },
        siteName: { type: 'string', description: 'Filter by site name (partial match)' },
      },
    },
    handler: (client, args) => accountTools.listSites(client, args as Parameters<typeof accountTools.listSites>[1]),
  },
  {
    name: 'list-devices',
    description: 'List all devices in the account. Supports filtering by hostname, site, device type, and OS.',
    inputSchema: {
      type: 'object',
      properties: {
        page: { type: 'number', description: 'Page number' },
        max: { type: 'number', description: 'Results per page (max: 250)' },
        hostname: { type: 'string', description: 'Filter by hostname (partial match)' },
        siteName: { type: 'string', description: 'Filter by site name (partial match)' },
        deviceType: { type: 'string', description: 'Filter by device type' },
        operatingSystem: { type: 'string', description: 'Filter by OS (partial match)' },
        filterId: { type: 'number', description: 'Apply a device filter by ID' },
      },
    },
    handler: (client, args) => accountTools.listDevices(client, args as Parameters<typeof accountTools.listDevices>[1]),
  },
  {
    name: 'list-users',
    description: 'List all users in the Datto RMM account',
    inputSchema: {
      type: 'object',
      properties: {
        page: { type: 'number', description: 'Page number' },
        max: { type: 'number', description: 'Results per page' },
      },
    },
    handler: (client, args) => accountTools.listUsers(client, args as Parameters<typeof accountTools.listUsers>[1]),
  },
  {
    name: 'list-account-variables',
    description: 'List all account-level variables',
    inputSchema: {
      type: 'object',
      properties: {
        page: { type: 'number', description: 'Page number' },
        max: { type: 'number', description: 'Results per page' },
      },
    },
    handler: (client, args) => accountTools.listAccountVariables(client, args as Parameters<typeof accountTools.listAccountVariables>[1]),
  },
  {
    name: 'list-components',
    description: 'List all available job components in the account',
    inputSchema: {
      type: 'object',
      properties: {
        page: { type: 'number', description: 'Page number' },
        max: { type: 'number', description: 'Results per page' },
      },
    },
    handler: (client, args) => accountTools.listComponents(client, args as Parameters<typeof accountTools.listComponents>[1]),
  },
  {
    name: 'list-open-alerts',
    description: 'List all open (unresolved) alerts across the entire account',
    inputSchema: {
      type: 'object',
      properties: {
        page: { type: 'number', description: 'Page number' },
        max: { type: 'number', description: 'Results per page' },
        muted: { type: 'boolean', description: 'Filter by muted status' },
      },
    },
    handler: (client, args) => accountTools.listOpenAlerts(client, args as Parameters<typeof accountTools.listOpenAlerts>[1]),
  },
  {
    name: 'list-resolved-alerts',
    description: 'List resolved alerts across the account',
    inputSchema: {
      type: 'object',
      properties: {
        page: { type: 'number', description: 'Page number' },
        max: { type: 'number', description: 'Results per page' },
        muted: { type: 'boolean', description: 'Filter by muted status' },
      },
    },
    handler: (client, args) => accountTools.listResolvedAlerts(client, args as Parameters<typeof accountTools.listResolvedAlerts>[1]),
  },

  // ==================== Site Tools ====================
  {
    name: 'get-site',
    description: 'Get detailed information about a specific site',
    inputSchema: {
      type: 'object',
      properties: {
        siteUid: { type: 'string', description: 'The unique ID of the site' },
      },
      required: ['siteUid'],
    },
    handler: (client, args) => siteTools.getSite(client, args as Parameters<typeof siteTools.getSite>[1]),
  },
  {
    name: 'list-site-devices',
    description: 'List all devices in a specific site',
    inputSchema: {
      type: 'object',
      properties: {
        siteUid: { type: 'string', description: 'The unique ID of the site' },
        page: { type: 'number', description: 'Page number' },
        max: { type: 'number', description: 'Results per page' },
        filterId: { type: 'number', description: 'Apply a device filter' },
      },
      required: ['siteUid'],
    },
    handler: (client, args) => siteTools.listSiteDevices(client, args as Parameters<typeof siteTools.listSiteDevices>[1]),
  },
  {
    name: 'list-site-open-alerts',
    description: 'List open alerts for a specific site',
    inputSchema: {
      type: 'object',
      properties: {
        siteUid: { type: 'string', description: 'The unique ID of the site' },
        page: { type: 'number', description: 'Page number' },
        max: { type: 'number', description: 'Results per page' },
        muted: { type: 'boolean', description: 'Filter by muted status' },
      },
      required: ['siteUid'],
    },
    handler: (client, args) => siteTools.listSiteOpenAlerts(client, args as Parameters<typeof siteTools.listSiteOpenAlerts>[1]),
  },
  {
    name: 'list-site-resolved-alerts',
    description: 'List resolved alerts for a specific site',
    inputSchema: {
      type: 'object',
      properties: {
        siteUid: { type: 'string', description: 'The unique ID of the site' },
        page: { type: 'number', description: 'Page number' },
        max: { type: 'number', description: 'Results per page' },
        muted: { type: 'boolean', description: 'Filter by muted status' },
      },
      required: ['siteUid'],
    },
    handler: (client, args) => siteTools.listSiteResolvedAlerts(client, args as Parameters<typeof siteTools.listSiteResolvedAlerts>[1]),
  },
  {
    name: 'list-site-variables',
    description: 'List variables for a specific site',
    inputSchema: {
      type: 'object',
      properties: {
        siteUid: { type: 'string', description: 'The unique ID of the site' },
        page: { type: 'number', description: 'Page number' },
        max: { type: 'number', description: 'Results per page' },
      },
      required: ['siteUid'],
    },
    handler: (client, args) => siteTools.listSiteVariables(client, args as Parameters<typeof siteTools.listSiteVariables>[1]),
  },
  {
    name: 'get-site-settings',
    description: 'Get settings for a specific site (including proxy configuration)',
    inputSchema: {
      type: 'object',
      properties: {
        siteUid: { type: 'string', description: 'The unique ID of the site' },
      },
      required: ['siteUid'],
    },
    handler: (client, args) => siteTools.getSiteSettings(client, args as Parameters<typeof siteTools.getSiteSettings>[1]),
  },
  {
    name: 'list-site-filters',
    description: 'List device filters for a specific site',
    inputSchema: {
      type: 'object',
      properties: {
        siteUid: { type: 'string', description: 'The unique ID of the site' },
        page: { type: 'number', description: 'Page number' },
        max: { type: 'number', description: 'Results per page' },
      },
      required: ['siteUid'],
    },
    handler: (client, args) => siteTools.listSiteFilters(client, args as Parameters<typeof siteTools.listSiteFilters>[1]),
  },
  {
    name: 'create-site',
    description: 'Create a new site in the account',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Name of the site' },
        description: { type: 'string', description: 'Site description' },
        notes: { type: 'string', description: 'Site notes' },
        onDemand: { type: 'boolean', description: 'Enable on-demand mode' },
        splashtopAutoInstall: { type: 'boolean', description: 'Auto-install Splashtop' },
      },
      required: ['name'],
    },
    handler: (client, args) => siteTools.createSite(client, args as Parameters<typeof siteTools.createSite>[1]),
  },
  {
    name: 'update-site',
    description: 'Update an existing site',
    inputSchema: {
      type: 'object',
      properties: {
        siteUid: { type: 'string', description: 'The unique ID of the site' },
        name: { type: 'string', description: 'New name for the site' },
        description: { type: 'string', description: 'New description' },
        notes: { type: 'string', description: 'New notes' },
        onDemand: { type: 'boolean', description: 'Enable/disable on-demand mode' },
        splashtopAutoInstall: { type: 'boolean', description: 'Enable/disable Splashtop auto-install' },
      },
      required: ['siteUid'],
    },
    handler: (client, args) => siteTools.updateSite(client, args as Parameters<typeof siteTools.updateSite>[1]),
  },

  // ==================== Device Tools ====================
  {
    name: 'get-device',
    description: 'Get detailed information about a specific device by its UID',
    inputSchema: {
      type: 'object',
      properties: {
        deviceUid: { type: 'string', description: 'The unique ID of the device' },
      },
      required: ['deviceUid'],
    },
    handler: (client, args) => deviceTools.getDevice(client, args as Parameters<typeof deviceTools.getDevice>[1]),
  },
  {
    name: 'get-device-by-id',
    description: 'Get device information by its numeric ID',
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: { type: 'number', description: 'The numeric ID of the device' },
      },
      required: ['deviceId'],
    },
    handler: (client, args) => deviceTools.getDeviceById(client, args as Parameters<typeof deviceTools.getDeviceById>[1]),
  },
  {
    name: 'get-device-by-mac',
    description: 'Find devices by MAC address (format: XXXXXXXXXXXX, no colons)',
    inputSchema: {
      type: 'object',
      properties: {
        macAddress: { type: 'string', description: 'MAC address without separators' },
      },
      required: ['macAddress'],
    },
    handler: (client, args) => deviceTools.getDeviceByMac(client, args as Parameters<typeof deviceTools.getDeviceByMac>[1]),
  },
  {
    name: 'list-device-open-alerts',
    description: 'List open alerts for a specific device',
    inputSchema: {
      type: 'object',
      properties: {
        deviceUid: { type: 'string', description: 'The unique ID of the device' },
        page: { type: 'number', description: 'Page number' },
        max: { type: 'number', description: 'Results per page' },
        muted: { type: 'boolean', description: 'Filter by muted status' },
      },
      required: ['deviceUid'],
    },
    handler: (client, args) => deviceTools.listDeviceOpenAlerts(client, args as Parameters<typeof deviceTools.listDeviceOpenAlerts>[1]),
  },
  {
    name: 'list-device-resolved-alerts',
    description: 'List resolved alerts for a specific device',
    inputSchema: {
      type: 'object',
      properties: {
        deviceUid: { type: 'string', description: 'The unique ID of the device' },
        page: { type: 'number', description: 'Page number' },
        max: { type: 'number', description: 'Results per page' },
        muted: { type: 'boolean', description: 'Filter by muted status' },
      },
      required: ['deviceUid'],
    },
    handler: (client, args) => deviceTools.listDeviceResolvedAlerts(client, args as Parameters<typeof deviceTools.listDeviceResolvedAlerts>[1]),
  },
  {
    name: 'move-device',
    description: 'Move a device from one site to another',
    inputSchema: {
      type: 'object',
      properties: {
        deviceUid: { type: 'string', description: 'The unique ID of the device to move' },
        siteUid: { type: 'string', description: 'The unique ID of the target site' },
      },
      required: ['deviceUid', 'siteUid'],
    },
    handler: (client, args) => deviceTools.moveDevice(client, args as Parameters<typeof deviceTools.moveDevice>[1]),
  },
  {
    name: 'create-quick-job',
    description: 'Create and run a quick job on a device using a component',
    inputSchema: {
      type: 'object',
      properties: {
        deviceUid: { type: 'string', description: 'The unique ID of the device' },
        jobName: { type: 'string', description: 'Name for the job' },
        componentUid: { type: 'string', description: 'UID of the component to run' },
        variables: {
          type: 'array',
          description: 'Variables to pass to the component',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              value: { type: 'string' },
            },
          },
        },
      },
      required: ['deviceUid', 'jobName', 'componentUid'],
    },
    handler: (client, args) => deviceTools.createQuickJob(client, args as Parameters<typeof deviceTools.createQuickJob>[1]),
  },
  {
    name: 'set-device-udf',
    description: 'Set user-defined fields (UDF1-UDF30) on a device',
    inputSchema: {
      type: 'object',
      properties: {
        deviceUid: { type: 'string', description: 'The unique ID of the device' },
        udf1: { type: 'string', description: 'User defined field 1' },
        udf2: { type: 'string', description: 'User defined field 2' },
        udf3: { type: 'string', description: 'User defined field 3' },
        udf4: { type: 'string', description: 'User defined field 4' },
        udf5: { type: 'string', description: 'User defined field 5' },
        // ... udf6-udf30 follow the same pattern
      },
      required: ['deviceUid'],
    },
    handler: (client, args) => deviceTools.setDeviceUdf(client, args as Parameters<typeof deviceTools.setDeviceUdf>[1]),
  },
  {
    name: 'set-device-warranty',
    description: 'Set the warranty date for a device (format: YYYY-MM-DD, or null to clear)',
    inputSchema: {
      type: 'object',
      properties: {
        deviceUid: { type: 'string', description: 'The unique ID of the device' },
        warrantyDate: { type: ['string', 'null'], description: 'Warranty date (YYYY-MM-DD) or null to clear' },
      },
      required: ['deviceUid', 'warrantyDate'],
    },
    handler: (client, args) => deviceTools.setDeviceWarranty(client, args as Parameters<typeof deviceTools.setDeviceWarranty>[1]),
  },

  // ==================== Alert Tools ====================
  {
    name: 'get-alert',
    description: 'Get detailed information about a specific alert',
    inputSchema: {
      type: 'object',
      properties: {
        alertUid: { type: 'string', description: 'The unique ID of the alert' },
      },
      required: ['alertUid'],
    },
    handler: (client, args) => alertTools.getAlert(client, args as Parameters<typeof alertTools.getAlert>[1]),
  },
  {
    name: 'resolve-alert',
    description: 'Resolve (close) an open alert',
    inputSchema: {
      type: 'object',
      properties: {
        alertUid: { type: 'string', description: 'The unique ID of the alert to resolve' },
      },
      required: ['alertUid'],
    },
    handler: (client, args) => alertTools.resolveAlert(client, args as Parameters<typeof alertTools.resolveAlert>[1]),
  },

  // ==================== Job Tools ====================
  {
    name: 'get-job',
    description: 'Get information about a specific job',
    inputSchema: {
      type: 'object',
      properties: {
        jobUid: { type: 'string', description: 'The unique ID of the job' },
      },
      required: ['jobUid'],
    },
    handler: (client, args) => jobTools.getJob(client, args as Parameters<typeof jobTools.getJob>[1]),
  },
  {
    name: 'get-job-components',
    description: 'Get the components of a job',
    inputSchema: {
      type: 'object',
      properties: {
        jobUid: { type: 'string', description: 'The unique ID of the job' },
        page: { type: 'number', description: 'Page number' },
        max: { type: 'number', description: 'Results per page' },
      },
      required: ['jobUid'],
    },
    handler: (client, args) => jobTools.getJobComponents(client, args as Parameters<typeof jobTools.getJobComponents>[1]),
  },
  {
    name: 'get-job-results',
    description: 'Get job execution results for a specific device',
    inputSchema: {
      type: 'object',
      properties: {
        jobUid: { type: 'string', description: 'The unique ID of the job' },
        deviceUid: { type: 'string', description: 'The unique ID of the device' },
      },
      required: ['jobUid', 'deviceUid'],
    },
    handler: (client, args) => jobTools.getJobResults(client, args as Parameters<typeof jobTools.getJobResults>[1]),
  },
  {
    name: 'get-job-stdout',
    description: 'Get the stdout output from a job execution',
    inputSchema: {
      type: 'object',
      properties: {
        jobUid: { type: 'string', description: 'The unique ID of the job' },
        deviceUid: { type: 'string', description: 'The unique ID of the device' },
      },
      required: ['jobUid', 'deviceUid'],
    },
    handler: (client, args) => jobTools.getJobStdout(client, args as Parameters<typeof jobTools.getJobStdout>[1]),
  },
  {
    name: 'get-job-stderr',
    description: 'Get the stderr output from a job execution',
    inputSchema: {
      type: 'object',
      properties: {
        jobUid: { type: 'string', description: 'The unique ID of the job' },
        deviceUid: { type: 'string', description: 'The unique ID of the device' },
      },
      required: ['jobUid', 'deviceUid'],
    },
    handler: (client, args) => jobTools.getJobStderr(client, args as Parameters<typeof jobTools.getJobStderr>[1]),
  },

  // ==================== Audit Tools ====================
  {
    name: 'get-device-audit',
    description: 'Get hardware and system audit data for a device',
    inputSchema: {
      type: 'object',
      properties: {
        deviceUid: { type: 'string', description: 'The unique ID of the device' },
      },
      required: ['deviceUid'],
    },
    handler: (client, args) => auditTools.getDeviceAudit(client, args as Parameters<typeof auditTools.getDeviceAudit>[1]),
  },
  {
    name: 'get-device-software',
    description: 'Get list of installed software on a device',
    inputSchema: {
      type: 'object',
      properties: {
        deviceUid: { type: 'string', description: 'The unique ID of the device' },
        page: { type: 'number', description: 'Page number' },
        max: { type: 'number', description: 'Results per page' },
      },
      required: ['deviceUid'],
    },
    handler: (client, args) => auditTools.getDeviceSoftware(client, args as Parameters<typeof auditTools.getDeviceSoftware>[1]),
  },
  {
    name: 'get-device-audit-by-mac',
    description: 'Get device audit data by MAC address',
    inputSchema: {
      type: 'object',
      properties: {
        macAddress: { type: 'string', description: 'MAC address without separators' },
      },
      required: ['macAddress'],
    },
    handler: (client, args) => auditTools.getDeviceAuditByMac(client, args as Parameters<typeof auditTools.getDeviceAuditByMac>[1]),
  },
  {
    name: 'get-esxi-audit',
    description: 'Get audit data for an ESXi host (including VMs)',
    inputSchema: {
      type: 'object',
      properties: {
        deviceUid: { type: 'string', description: 'The unique ID of the ESXi host' },
      },
      required: ['deviceUid'],
    },
    handler: (client, args) => auditTools.getEsxiAudit(client, args as Parameters<typeof auditTools.getEsxiAudit>[1]),
  },
  {
    name: 'get-printer-audit',
    description: 'Get audit data for a printer (including supply levels)',
    inputSchema: {
      type: 'object',
      properties: {
        deviceUid: { type: 'string', description: 'The unique ID of the printer' },
      },
      required: ['deviceUid'],
    },
    handler: (client, args) => auditTools.getPrinterAudit(client, args as Parameters<typeof auditTools.getPrinterAudit>[1]),
  },

  // ==================== Activity Log Tools ====================
  {
    name: 'get-activity-logs',
    description: 'Get activity logs with filtering options. Returns logs from last 15 minutes by default.',
    inputSchema: {
      type: 'object',
      properties: {
        size: { type: 'number', description: 'Number of records to return' },
        order: { type: 'string', enum: ['asc', 'desc'], description: 'Sort order by creation date' },
        from: { type: 'string', description: 'Start date (UTC, format: YYYY-MM-DDTHH:mm:ssZ)' },
        until: { type: 'string', description: 'End date (UTC, format: YYYY-MM-DDTHH:mm:ssZ)' },
        entities: { type: 'array', items: { type: 'string' }, description: 'Filter by entity type (device, user)' },
        categories: { type: 'array', items: { type: 'string' }, description: 'Filter by category' },
        actions: { type: 'array', items: { type: 'string' }, description: 'Filter by action' },
        siteIds: { type: 'array', items: { type: 'number' }, description: 'Filter by site IDs' },
        userIds: { type: 'array', items: { type: 'number' }, description: 'Filter by user IDs' },
      },
    },
    handler: (client, args) => activityTools.getActivityLogs(client, args as Parameters<typeof activityTools.getActivityLogs>[1]),
  },

  // ==================== Filter Tools ====================
  {
    name: 'list-default-filters',
    description: 'List the default device filters',
    inputSchema: {
      type: 'object',
      properties: {
        page: { type: 'number', description: 'Page number' },
        max: { type: 'number', description: 'Results per page' },
      },
    },
    handler: (client, args) => filterTools.listDefaultFilters(client, args as Parameters<typeof filterTools.listDefaultFilters>[1]),
  },
  {
    name: 'list-custom-filters',
    description: 'List custom device filters created by users',
    inputSchema: {
      type: 'object',
      properties: {
        page: { type: 'number', description: 'Page number' },
        max: { type: 'number', description: 'Results per page' },
      },
    },
    handler: (client, args) => filterTools.listCustomFilters(client, args as Parameters<typeof filterTools.listCustomFilters>[1]),
  },

  // ==================== System Tools ====================
  {
    name: 'get-system-status',
    description: 'Get the Datto RMM API system status (no auth required)',
    inputSchema: {
      type: 'object',
      properties: {},
    },
    handler: (client) => systemTools.getSystemStatus(client),
  },
  {
    name: 'get-rate-limit',
    description: 'Get the current API rate limit status for your account',
    inputSchema: {
      type: 'object',
      properties: {},
    },
    handler: (client) => systemTools.getRateLimit(client),
  },
  {
    name: 'get-pagination-config',
    description: 'Get the pagination configuration (default and max page sizes)',
    inputSchema: {
      type: 'object',
      properties: {},
    },
    handler: (client) => systemTools.getPaginationConfig(client),
  },

  // ==================== Variable Tools ====================
  {
    name: 'create-account-variable',
    description: 'Create a new account-level variable',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Variable name' },
        value: { type: 'string', description: 'Variable value' },
        masked: { type: 'boolean', description: 'Whether to mask the value' },
      },
      required: ['name', 'value'],
    },
    handler: (client, args) => variableTools.createAccountVariable(client, args as Parameters<typeof variableTools.createAccountVariable>[1]),
  },
  {
    name: 'update-account-variable',
    description: 'Update an existing account variable',
    inputSchema: {
      type: 'object',
      properties: {
        variableId: { type: 'number', description: 'The ID of the variable' },
        name: { type: 'string', description: 'New variable name' },
        value: { type: 'string', description: 'New variable value' },
        masked: { type: 'boolean', description: 'Whether to mask the value' },
      },
      required: ['variableId'],
    },
    handler: (client, args) => variableTools.updateAccountVariable(client, args as Parameters<typeof variableTools.updateAccountVariable>[1]),
  },
  {
    name: 'delete-account-variable',
    description: 'Delete an account variable',
    inputSchema: {
      type: 'object',
      properties: {
        variableId: { type: 'number', description: 'The ID of the variable to delete' },
      },
      required: ['variableId'],
    },
    handler: (client, args) => variableTools.deleteAccountVariable(client, args as Parameters<typeof variableTools.deleteAccountVariable>[1]),
  },
  {
    name: 'create-site-variable',
    description: 'Create a new variable for a specific site',
    inputSchema: {
      type: 'object',
      properties: {
        siteUid: { type: 'string', description: 'The unique ID of the site' },
        name: { type: 'string', description: 'Variable name' },
        value: { type: 'string', description: 'Variable value' },
        masked: { type: 'boolean', description: 'Whether to mask the value' },
      },
      required: ['siteUid', 'name', 'value'],
    },
    handler: (client, args) => variableTools.createSiteVariable(client, args as Parameters<typeof variableTools.createSiteVariable>[1]),
  },
  {
    name: 'update-site-variable',
    description: 'Update an existing site variable',
    inputSchema: {
      type: 'object',
      properties: {
        siteUid: { type: 'string', description: 'The unique ID of the site' },
        variableId: { type: 'number', description: 'The ID of the variable' },
        name: { type: 'string', description: 'New variable name' },
        value: { type: 'string', description: 'New variable value' },
        masked: { type: 'boolean', description: 'Whether to mask the value' },
      },
      required: ['siteUid', 'variableId'],
    },
    handler: (client, args) => variableTools.updateSiteVariable(client, args as Parameters<typeof variableTools.updateSiteVariable>[1]),
  },
  {
    name: 'delete-site-variable',
    description: 'Delete a site variable',
    inputSchema: {
      type: 'object',
      properties: {
        siteUid: { type: 'string', description: 'The unique ID of the site' },
        variableId: { type: 'number', description: 'The ID of the variable to delete' },
      },
      required: ['siteUid', 'variableId'],
    },
    handler: (client, args) => variableTools.deleteSiteVariable(client, args as Parameters<typeof variableTools.deleteSiteVariable>[1]),
  },
  {
    name: 'update-site-proxy',
    description: 'Configure proxy settings for a site',
    inputSchema: {
      type: 'object',
      properties: {
        siteUid: { type: 'string', description: 'The unique ID of the site' },
        type: { type: 'string', enum: ['http', 'socks4', 'socks5'], description: 'Proxy type' },
        host: { type: 'string', description: 'Proxy host' },
        port: { type: 'number', description: 'Proxy port' },
        username: { type: 'string', description: 'Proxy username (optional)' },
        password: { type: 'string', description: 'Proxy password (optional)' },
      },
      required: ['siteUid', 'type', 'host', 'port'],
    },
    handler: (client, args) => variableTools.updateSiteProxy(client, args as Parameters<typeof variableTools.updateSiteProxy>[1]),
  },
  {
    name: 'delete-site-proxy',
    description: 'Remove proxy settings from a site',
    inputSchema: {
      type: 'object',
      properties: {
        siteUid: { type: 'string', description: 'The unique ID of the site' },
      },
      required: ['siteUid'],
    },
    handler: (client, args) => variableTools.deleteSiteProxy(client, args as Parameters<typeof variableTools.deleteSiteProxy>[1]),
  },
];

/**
 * Get a tool by name.
 */
export function getTool(name: string): ToolDefinition | undefined {
  return tools.find((t) => t.name === name);
}
