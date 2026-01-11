import type { DattoClient } from 'datto-rmm-api';
import { handleResponse, errorResult, successResult, type ToolResult } from '../utils/response.js';
import type * as T from '../types.js';

/**
 * Get system status.
 */
export async function getSystemStatus(client: DattoClient): Promise<ToolResult> {
  try {
    const response = await client.GET('/v2/system/status');
    const data = handleResponse<T.StatusResponse>(response);

    const lines = [
      '# System Status',
      '',
      `**Status:** ${data.status ?? 'N/A'}`,
      `**Version:** ${data.version ?? 'N/A'}`,
      `**Started:** ${data.started ?? 'N/A'}`,
    ];

    return successResult(lines.join('\n'));
  } catch (err) {
    return errorResult(`Error fetching system status: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/**
 * Get rate limit status.
 */
export async function getRateLimit(client: DattoClient): Promise<ToolResult> {
  try {
    const response = await client.GET('/v2/system/request_rate');
    const data = handleResponse<T.RateStatusResponse>(response);

    const lines = [
      '# Rate Limit Status',
      '',
      `**Account UID:** ${data.accountUid ?? 'N/A'}`,
      `**Account Request Count:** ${data.accountCount ?? 'N/A'}`,
      `**Account Rate Limit:** ${data.accountRateLimit ?? 'N/A'}`,
      `**Time Window (seconds):** ${data.slidingTimeWindowSizeSeconds ?? 'N/A'}`,
      `**Cut Off Ratio:** ${data.accountCutOffRatio ?? 'N/A'}`,
    ];

    return successResult(lines.join('\n'));
  } catch (err) {
    return errorResult(`Error fetching rate limit: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/**
 * Get pagination configuration.
 */
export async function getPaginationConfig(client: DattoClient): Promise<ToolResult> {
  try {
    const response = await client.GET('/v2/system/pagination');
    const data = handleResponse<T.PaginationConfiguration>(response);

    const lines = [
      '# Pagination Configuration',
      '',
      `**Max Page Size:** ${data.max ?? 'N/A'}`,
    ];

    return successResult(lines.join('\n'));
  } catch (err) {
    return errorResult(`Error fetching pagination config: ${err instanceof Error ? err.message : String(err)}`);
  }
}
