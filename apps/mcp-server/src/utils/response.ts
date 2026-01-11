import { formatError } from './formatting.js';

/**
 * Result of a tool execution.
 */
export interface ToolResult {
  content: Array<{ type: 'text'; text: string }>;
  isError?: boolean;
}

/**
 * Create an error result.
 */
export function errorResult(message: string): ToolResult {
  return {
    content: [{ type: 'text', text: message }],
    isError: true,
  };
}

/**
 * Create a success result.
 */
export function successResult(text: string): ToolResult {
  return {
    content: [{ type: 'text', text }],
  };
}

/**
 * Handle API response with proper typing.
 *
 * Note: The Datto RMM OpenAPI spec doesn't define 200 responses properly,
 * so we use type assertion to extract data. In practice, the API does return
 * data on successful responses.
 */
export function handleResponse<T>(response: { data?: unknown; error?: unknown; response: Response }): T {
  // Check for HTTP errors
  if (!response.response.ok) {
    const status = response.response.status;
    const errorInfo = response.error ? formatError(response.error) : `HTTP ${status}`;
    throw new Error(errorInfo);
  }

  // Check for explicit error object
  if (response.error) {
    throw new Error(formatError(response.error));
  }

  // Cast data to expected type
  // The OpenAPI spec is missing 200 responses, but the API returns data
  const data = response.data as T | undefined;
  if (data === undefined || data === null) {
    throw new Error('No data returned from API');
  }

  return data;
}

/**
 * Handle API response for operations that don't return data.
 */
export function handleVoidResponse(response: { error?: unknown; response: Response }): void {
  if (!response.response.ok) {
    const status = response.response.status;
    const errorInfo = response.error ? formatError(response.error) : `HTTP ${status}`;
    throw new Error(errorInfo);
  }

  if (response.error) {
    throw new Error(formatError(response.error));
  }
}
