import type { DattoClient } from '@datto-rmm/api';
import { handleResponse, handleVoidResponse, errorResult, successResult, type ToolResult } from '../utils/response.js';
import type * as T from '../types.js';

/**
 * Get alert by UID.
 */
export async function getAlert(client: DattoClient, args: { alertUid: string }): Promise<ToolResult> {
  try {
    const response = await client.GET('/v2/alert/{alertUid}', {
      params: {
        path: { alertUid: args.alertUid },
      },
    });
    const data = handleResponse<T.Alert>(response);

    const lines = [
      `# Alert ${data.alertUid}`,
      '',
      `**Priority:** ${data.priority ?? 'N/A'}`,
      `**Resolved:** ${data.resolved ? 'Yes' : 'No'}`,
      `**Muted:** ${data.muted ? 'Yes' : 'No'}`,
      '',
      '## Device Information',
      `- **Device Name:** ${data.alertSourceInfo?.deviceName ?? 'N/A'}`,
      `- **Device UID:** ${data.alertSourceInfo?.deviceUid ?? 'N/A'}`,
      `- **Site Name:** ${data.alertSourceInfo?.siteName ?? 'N/A'}`,
      `- **Site UID:** ${data.alertSourceInfo?.siteUid ?? 'N/A'}`,
      '',
      '## Timing',
      `- **Created:** ${data.timestamp ?? 'N/A'}`,
      `- **Resolved At:** ${data.resolvedOn ?? 'N/A'}`,
      `- **Resolved By:** ${data.resolvedBy ?? 'N/A'}`,
    ];

    if (data.diagnostics) {
      lines.push('');
      lines.push('## Diagnostics');
      lines.push(data.diagnostics);
    }

    if (data.alertContext) {
      lines.push('');
      lines.push('## Context');
      lines.push(JSON.stringify(data.alertContext, null, 2));
    }

    return successResult(lines.join('\n'));
  } catch (err) {
    return errorResult(`Error fetching alert: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/**
 * Resolve an alert.
 */
export async function resolveAlert(client: DattoClient, args: { alertUid: string }): Promise<ToolResult> {
  try {
    const response = await client.POST('/v2/alert/{alertUid}/resolve', {
      params: {
        path: { alertUid: args.alertUid },
      },
    });
    handleVoidResponse(response);

    return successResult(`Alert ${args.alertUid} resolved successfully`);
  } catch (err) {
    return errorResult(`Error resolving alert: ${err instanceof Error ? err.message : String(err)}`);
  }
}
