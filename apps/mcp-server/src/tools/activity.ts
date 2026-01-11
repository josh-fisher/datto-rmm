import type { DattoClient } from 'datto-rmm-api';
import { handleResponse, errorResult, successResult, type ToolResult } from '../utils/response.js';
import type * as T from '../types.js';

/**
 * Get activity logs.
 */
export async function getActivityLogs(
  client: DattoClient,
  args: {
    size?: number;
    order?: 'asc' | 'desc';
    from?: string;
    until?: string;
    entities?: ('device' | 'user')[];
    categories?: string[];
    actions?: string[];
    siteIds?: number[];
    userIds?: number[];
  }
): Promise<ToolResult> {
  try {
    // The API expects a single entity value, not an array
    // If multiple entities are provided, we'll use the first one
    const entity = args.entities?.[0] as 'device' | 'user' | undefined;

    const response = await client.GET('/v2/activity-logs', {
      params: {
        query: {
          size: args.size,
          order: args.order,
          from: args.from,
          until: args.until,
          entities: entity,
          categories: args.categories,
          actions: args.actions,
          siteIds: args.siteIds,
          userIds: args.userIds,
        },
      },
    });
    const data = handleResponse<T.ActivityLogsPage>(response);

    if (!data.activities || data.activities.length === 0) {
      return successResult('No activity logs found');
    }

    const lines = [
      '# Activity Logs',
      '',
      `Found ${data.activities.length} entries`,
      '',
    ];

    for (const activity of data.activities) {
      // The date is a unix timestamp (number), not a string
      const timestamp = activity.date ? new Date(activity.date * 1000).toISOString() : 'Unknown time';
      lines.push(`## ${timestamp}`);
      lines.push(`- **Entity:** ${activity.entity ?? 'N/A'}`);
      lines.push(`- **Category:** ${activity.category ?? 'N/A'}`);
      lines.push(`- **Action:** ${activity.action ?? 'N/A'}`);
      if (activity.details) {
        lines.push(`- **Details:** ${activity.details}`);
      }
      if (activity.user) {
        lines.push(`- **User:** ${activity.user.userName ?? 'N/A'}`);
      }
      if (activity.site) {
        lines.push(`- **Site:** ${activity.site.name ?? 'N/A'}`);
      }
      if (activity.hostname) {
        lines.push(`- **Hostname:** ${activity.hostname}`);
      }
      lines.push('');
    }

    if (data.pageDetails?.nextPageUrl) {
      lines.push('_More results available. Use pagination to see more._');
    }

    return successResult(lines.join('\n'));
  } catch (err) {
    return errorResult(`Error fetching activity logs: ${err instanceof Error ? err.message : String(err)}`);
  }
}
