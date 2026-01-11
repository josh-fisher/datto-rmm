/**
 * Format a value for display in MCP responses.
 * Handles undefined, null, and complex objects.
 */
export function formatValue(value: unknown): string {
  if (value === null || value === undefined) {
    return 'N/A';
  }
  if (typeof value === 'object') {
    return JSON.stringify(value, null, 2);
  }
  return String(value);
}

/**
 * Format a date string or timestamp for display.
 */
export function formatDate(value: string | number | null | undefined): string {
  if (!value) return 'N/A';
  try {
    const date = new Date(value);
    return date.toISOString();
  } catch {
    return String(value);
  }
}

/**
 * Format bytes to human-readable size.
 */
export function formatBytes(bytes: number | null | undefined): string {
  if (bytes === null || bytes === undefined) return 'N/A';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let value = bytes;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex++;
  }
  return `${value.toFixed(2)} ${units[unitIndex]}`;
}

/**
 * Create a text content block for MCP responses.
 */
export function textContent(text: string): { type: 'text'; text: string } {
  return { type: 'text', text };
}

/**
 * Format an error for MCP response.
 */
export function formatError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'object' && error !== null) {
    return JSON.stringify(error, null, 2);
  }
  return String(error);
}

/**
 * Format a paginated response with summary.
 */
export function formatPaginatedResponse<T>(
  items: T[],
  pageInfo: { page?: number; totalPages?: number; count?: number },
  formatItem: (item: T, index: number) => string
): string {
  const lines: string[] = [];

  // Header with count
  const count = pageInfo.count ?? items.length;
  lines.push(`Found ${count} item(s)`);

  if (pageInfo.totalPages && pageInfo.totalPages > 1) {
    lines.push(`Page ${pageInfo.page ?? 1} of ${pageInfo.totalPages}`);
  }

  lines.push('');

  // Items
  items.forEach((item, index) => {
    lines.push(formatItem(item, index));
  });

  return lines.join('\n');
}
