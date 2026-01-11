import type { DattoClient } from 'datto-rmm-api';
import { normalizePagination, parsePageInfo } from '../utils/pagination.js';
import { handleResponse, errorResult, successResult, type ToolResult } from '../utils/response.js';
import type * as T from '../types.js';

/**
 * List default device filters.
 */
export async function listDefaultFilters(
  client: DattoClient,
  args: { page?: number; max?: number }
): Promise<ToolResult> {
  try {
    const pagination = normalizePagination(args);

    const response = await client.GET('/v2/filter/default-filters', {
      params: {
        query: {
          page: pagination.page,
          max: pagination.max,
        },
      },
    });
    const data = handleResponse<T.FiltersPage>(response);

    if (!data.filters || data.filters.length === 0) {
      return successResult('No default filters found');
    }

    const pageInfo = parsePageInfo(data);
    const lines = [
      `# Default Device Filters (${pageInfo.count} total)`,
      '',
    ];

    for (const filter of data.filters) {
      lines.push(`## ${filter.name ?? 'Unknown'}`);
      lines.push(`- **ID:** ${filter.id}`);
      if (filter.description) {
        lines.push(`- **Description:** ${filter.description}`);
      }
      lines.push('');
    }

    return successResult(lines.join('\n'));
  } catch (err) {
    return errorResult(`Error listing default filters: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/**
 * List custom device filters.
 */
export async function listCustomFilters(
  client: DattoClient,
  args: { page?: number; max?: number }
): Promise<ToolResult> {
  try {
    const pagination = normalizePagination(args);

    const response = await client.GET('/v2/filter/custom-filters', {
      params: {
        query: {
          page: pagination.page,
          max: pagination.max,
        },
      },
    });
    const data = handleResponse<T.FiltersPage>(response);

    if (!data.filters || data.filters.length === 0) {
      return successResult('No custom filters found');
    }

    const pageInfo = parsePageInfo(data);
    const lines = [
      `# Custom Device Filters (${pageInfo.count} total)`,
      '',
    ];

    for (const filter of data.filters) {
      lines.push(`## ${filter.name ?? 'Unknown'}`);
      lines.push(`- **ID:** ${filter.id}`);
      if (filter.description) {
        lines.push(`- **Description:** ${filter.description}`);
      }
      lines.push('');
    }

    return successResult(lines.join('\n'));
  } catch (err) {
    return errorResult(`Error listing custom filters: ${err instanceof Error ? err.message : String(err)}`);
  }
}
