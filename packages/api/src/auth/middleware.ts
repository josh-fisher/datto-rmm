import type { Middleware } from 'openapi-fetch';

/**
 * Configuration for authentication middleware.
 */
export interface AuthConfig {
  /** Function to retrieve the current access token */
  getToken: () => Promise<string>;
  /** Optional callback when token refresh occurs */
  onTokenRefresh?: (newToken: string) => void;
  /** Optional callback on authentication failure */
  onAuthError?: (error: Error) => void;
}

/**
 * Creates an authentication middleware for openapi-fetch.
 *
 * This middleware:
 * - Injects the Bearer token into each request
 * - Handles 401 responses (token expired)
 *
 * @example
 * ```ts
 * const authMiddleware = createAuthMiddleware({
 *   getToken: () => tokenManager.getToken(),
 * });
 * client.use(authMiddleware);
 * ```
 */
export function createAuthMiddleware(config: AuthConfig): Middleware {
  return {
    async onRequest({ request }) {
      const token = await config.getToken();
      request.headers.set('Authorization', `Bearer ${token}`);
      return request;
    },
    async onResponse({ response }) {
      if (response.status === 401) {
        const error = new Error('Authentication failed - token may be expired');
        config.onAuthError?.(error);
      }
      return response;
    },
  };
}
