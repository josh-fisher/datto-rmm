import type { DattoClient } from 'datto-rmm-api';
import { formatBytes } from '../utils/formatting.js';
import { normalizePagination, parsePageInfo } from '../utils/pagination.js';
import { handleResponse, errorResult, successResult, type ToolResult } from '../utils/response.js';
import type * as T from '../types.js';

/**
 * Get device audit data.
 */
export async function getDeviceAudit(client: DattoClient, args: { deviceUid: string }): Promise<ToolResult> {
  try {
    const response = await client.GET('/v2/audit/device/{deviceUid}', {
      params: {
        path: { deviceUid: args.deviceUid },
      },
    });
    const data = handleResponse<T.DeviceAudit>(response);

    const lines = [
      '# Device Audit',
      '',
    ];

    // System Info
    if (data.systemInfo) {
      lines.push('## System Information');
      lines.push(`- **Manufacturer:** ${data.systemInfo.manufacturer ?? 'N/A'}`);
      lines.push(`- **Model:** ${data.systemInfo.model ?? 'N/A'}`);
      lines.push(`- **Username:** ${data.systemInfo.username ?? 'N/A'}`);
      lines.push(`- **.NET Version:** ${data.systemInfo.dotNetVersion ?? 'N/A'}`);
      lines.push(`- **Total Memory:** ${formatBytes(data.systemInfo.totalPhysicalMemory)}`);
      lines.push(`- **CPU Cores:** ${data.systemInfo.totalCpuCores ?? 'N/A'}`);
      lines.push('');
    }

    // BIOS
    if (data.bios) {
      lines.push('## BIOS');
      lines.push(`- **Instance:** ${data.bios.instance ?? 'N/A'}`);
      lines.push(`- **Serial Number:** ${data.bios.serialNumber ?? 'N/A'}`);
      lines.push(`- **SM BIOS Version:** ${data.bios.smBiosVersion ?? 'N/A'}`);
      lines.push(`- **Release Date:** ${data.bios.releaseDate ?? 'N/A'}`);
      lines.push('');
    }

    // Base Board
    if (data.baseBoard) {
      lines.push('## Base Board');
      lines.push(`- **Manufacturer:** ${data.baseBoard.manufacturer ?? 'N/A'}`);
      lines.push(`- **Product:** ${data.baseBoard.product ?? 'N/A'}`);
      lines.push('');
    }

    // Processors
    if (data.processors && data.processors.length > 0) {
      lines.push('## Processors');
      for (const proc of data.processors) {
        lines.push(`- ${proc.name ?? 'Unknown'}`);
      }
      lines.push('');
    }

    // Physical Memory
    if (data.physicalMemory && data.physicalMemory.length > 0) {
      lines.push('## Physical Memory');
      for (const mem of data.physicalMemory) {
        lines.push(`- **${mem.module ?? 'Module'}:** ${formatBytes(mem.size)} ${mem.type ?? ''} ${mem.speed ?? ''}`);
      }
      lines.push('');
    }

    // Logical Disks
    if (data.logicalDisks && data.logicalDisks.length > 0) {
      lines.push('## Logical Disks');
      for (const disk of data.logicalDisks) {
        const usedPercent = disk.size && disk.freespace
          ? Math.round((1 - disk.freespace / disk.size) * 100)
          : 'N/A';
        lines.push(`- **${disk.diskIdentifier ?? 'Disk'}:** ${formatBytes(disk.size)} total, ${formatBytes(disk.freespace)} free (${usedPercent}% used)`);
        if (disk.description) {
          lines.push(`  - Description: ${disk.description}`);
        }
      }
      lines.push('');
    }

    // Network Interfaces
    if (data.nics && data.nics.length > 0) {
      lines.push('## Network Interfaces');
      for (const nic of data.nics) {
        lines.push(`- **${nic.instance ?? 'NIC'}**`);
        lines.push(`  - IPv4: ${nic.ipv4 ?? 'N/A'}`);
        lines.push(`  - IPv6: ${nic.ipv6 ?? 'N/A'}`);
        lines.push(`  - MAC: ${nic.macAddress ?? 'N/A'}`);
      }
      lines.push('');
    }

    // Displays
    if (data.displays && data.displays.length > 0) {
      lines.push('## Displays');
      for (const display of data.displays) {
        lines.push(`- **${display.instance ?? 'Display'}:** ${display.screenWidth}x${display.screenHeight}`);
      }
      lines.push('');
    }

    // Portal URL
    if (data.portalUrl) {
      lines.push(`**Portal URL:** ${data.portalUrl}`);
    }

    return successResult(lines.join('\n'));
  } catch (err) {
    return errorResult(`Error fetching device audit: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/**
 * Get device software list.
 */
export async function getDeviceSoftware(
  client: DattoClient,
  args: { deviceUid: string; page?: number; max?: number }
): Promise<ToolResult> {
  try {
    const pagination = normalizePagination(args);

    const response = await client.GET('/v2/audit/device/{deviceUid}/software', {
      params: {
        path: { deviceUid: args.deviceUid },
        query: {
          page: pagination.page,
          max: pagination.max,
        },
      },
    });
    const data = handleResponse<T.SoftwarePage>(response);

    if (!data.software || data.software.length === 0) {
      return successResult('No software found for this device');
    }

    const pageInfo = parsePageInfo(data);
    const lines = [
      `# Installed Software (${pageInfo.count} total)`,
      '',
    ];

    if (pageInfo.totalPages > 1) {
      lines.push(`Page ${pageInfo.page} of ${pageInfo.totalPages}`);
      lines.push('');
    }

    for (const software of data.software) {
      lines.push(`- **${software.name ?? 'Unknown'}** v${software.version ?? 'N/A'}`);
    }

    if (pageInfo.hasMore) {
      lines.push('');
      lines.push(`_Use page=${pageInfo.page + 1} to see more results_`);
    }

    return successResult(lines.join('\n'));
  } catch (err) {
    return errorResult(`Error fetching device software: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/**
 * Get device audit by MAC address.
 */
export async function getDeviceAuditByMac(client: DattoClient, args: { macAddress: string }): Promise<ToolResult> {
  try {
    const response = await client.GET('/v2/audit/device/macAddress/{macAddress}', {
      params: {
        path: { macAddress: args.macAddress },
      },
    });
    const data = handleResponse<T.DeviceAudit[]>(response);

    if (data.length === 0) {
      return successResult('No device audit data found for this MAC address');
    }

    const lines = [
      `# Device Audit by MAC: ${args.macAddress}`,
      '',
      `Found ${data.length} device(s)`,
      '',
    ];

    for (const device of data) {
      lines.push(`## Device`);
      lines.push(`- **Manufacturer:** ${device.systemInfo?.manufacturer ?? 'N/A'}`);
      lines.push(`- **Model:** ${device.systemInfo?.model ?? 'N/A'}`);
      lines.push(`- **Portal URL:** ${device.portalUrl ?? 'N/A'}`);
      lines.push('');
    }

    return successResult(lines.join('\n'));
  } catch (err) {
    return errorResult(`Error fetching device audit: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/**
 * Get ESXi host audit data.
 */
export async function getEsxiAudit(client: DattoClient, args: { deviceUid: string }): Promise<ToolResult> {
  try {
    const response = await client.GET('/v2/audit/esxihost/{deviceUid}', {
      params: {
        path: { deviceUid: args.deviceUid },
      },
    });
    const data = handleResponse<T.ESXiHostAudit>(response);

    const lines = [
      '# ESXi Host Audit',
      '',
    ];

    // System Info
    if (data.systemInfo) {
      lines.push('## System Information');
      lines.push(`- **Name:** ${data.systemInfo.name ?? 'N/A'}`);
      lines.push(`- **Manufacturer:** ${data.systemInfo.manufacturer ?? 'N/A'}`);
      lines.push(`- **Model:** ${data.systemInfo.model ?? 'N/A'}`);
      lines.push(`- **Service Tag:** ${data.systemInfo.serviceTag ?? 'N/A'}`);
      lines.push(`- **Snapshots:** ${data.systemInfo.numberOfSnapshots ?? 0}`);
      lines.push('');
    }

    // Guests (VMs)
    if (data.guests && data.guests.length > 0) {
      lines.push('## Virtual Machines');
      for (const guest of data.guests) {
        lines.push(`- **${guest.guestName ?? 'Unknown'}**`);
        if (guest.numberOfSnapshots) {
          lines.push(`  - Snapshots: ${guest.numberOfSnapshots}`);
        }
      }
      lines.push('');
    }

    // Datastores
    if (data.datastores && data.datastores.length > 0) {
      lines.push('## Datastores');
      for (const ds of data.datastores) {
        lines.push(`- **${ds.datastoreName ?? 'Unknown'}:** ${formatBytes(ds.size)} total, ${formatBytes(ds.freeSpace)} free`);
      }
      lines.push('');
    }

    // Portal URL
    if (data.portalUrl) {
      lines.push(`**Portal URL:** ${data.portalUrl}`);
    }

    return successResult(lines.join('\n'));
  } catch (err) {
    return errorResult(`Error fetching ESXi audit: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/**
 * Get printer audit data.
 */
export async function getPrinterAudit(client: DattoClient, args: { deviceUid: string }): Promise<ToolResult> {
  try {
    const response = await client.GET('/v2/audit/printer/{deviceUid}', {
      params: {
        path: { deviceUid: args.deviceUid },
      },
    });
    const data = handleResponse<T.PrinterAudit>(response);

    const lines = [
      '# Printer Audit',
      '',
    ];

    // System Info
    if (data.systemInfo) {
      lines.push('## System Information');
      lines.push(`- **Manufacturer:** ${data.systemInfo.manufacturer ?? 'N/A'}`);
      lines.push(`- **Model:** ${data.systemInfo.model ?? 'N/A'}`);
      lines.push('');
    }

    // Printer Stats
    if (data.printer) {
      lines.push('## Printer Statistics');
      lines.push(`- **Printed Page Count:** ${data.printer.printedPageCount ?? 'N/A'}`);
      lines.push('');
    }

    // Marker Supplies
    if (data.printerMarkerSupplies && data.printerMarkerSupplies.length > 0) {
      lines.push('## Marker Supplies');
      for (const supply of data.printerMarkerSupplies) {
        lines.push(`- **${supply.description ?? 'Unknown'}:** ${supply.suppliesLevel ?? 'N/A'} / ${supply.maxCapacity ?? 'N/A'}`);
      }
      lines.push('');
    }

    // Network Interfaces
    if (data.nics && data.nics.length > 0) {
      lines.push('## Network Interfaces');
      for (const nic of data.nics) {
        lines.push(`- **${nic.instance ?? 'NIC'}**`);
        lines.push(`  - IPv4: ${nic.ipv4 ?? 'N/A'}`);
        lines.push(`  - MAC: ${nic.macAddress ?? 'N/A'}`);
      }
      lines.push('');
    }

    // Portal URL
    if (data.portalUrl) {
      lines.push(`**Portal URL:** ${data.portalUrl}`);
    }

    return successResult(lines.join('\n'));
  } catch (err) {
    return errorResult(`Error fetching printer audit: ${err instanceof Error ? err.message : String(err)}`);
  }
}
