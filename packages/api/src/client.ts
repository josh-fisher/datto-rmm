import createClient, { type Client, type Middleware } from 'openapi-fetch';
import type { paths } from './generated/types.js';
import { type Platform, getPlatformUrl, getTokenEndpoint } from './platforms.js';
import { createAuthMiddleware, type AuthConfig } from './auth/middleware.js';
import { OAuthTokenManager, type OAuthCredentials } from './auth/oauth.js';

/**
 * Options for creating a Datto RMM API client.
 */
export interface DattoClientOptions {
  /**
   * The Datto RMM platform to connect to.
   */
  platform: Platform;

  /**
   * Authentication configuration.
   *
   * Can be either:
   * - `OAuthCredentials`: API key/secret for automatic token management
   * - `AuthConfig`: Custom token provider function
   */
  auth: OAuthCredentials | AuthConfig;

  /**
   * Additional middleware to apply to requests.
   */
  middleware?: Middleware[];

  /**
   * Custom base URL override.
   * If provided, takes precedence over the platform URL.
   */
  baseUrl?: string;
}

/**
 * Type alias for the Datto RMM API client.
 */
export type DattoClient = Client<paths>;

/**
 * Creates a typed Datto RMM API client.
 *
 * @example
 * ```ts
 * // With OAuth credentials (automatic token management)
 * const client = createDattoClient({
 *   platform: Platform.MERLOT,
 *   auth: {
 *     apiKey: process.env.DATTO_API_KEY!,
 *     apiSecret: process.env.DATTO_API_SECRET!,
 *   },
 * });
 *
 * // Fully typed API calls
 * const { data, error } = await client.GET('/v2/account/devices');
 * ```
 *
 * @example
 * ```ts
 * // With custom token provider
 * const client = createDattoClient({
 *   platform: Platform.MERLOT,
 *   auth: {
 *     getToken: async () => myTokenStore.getToken(),
 *   },
 * });
 * ```
 */
export function createDattoClient(options: DattoClientOptions): DattoClient {
  const baseUrl = options.baseUrl ?? getPlatformUrl(options.platform);

  // Resolve auth config
  let authConfig: AuthConfig;
  if ('getToken' in options.auth) {
    // Custom auth provider
    authConfig = options.auth;
  } else {
    // OAuth credentials - create token manager
    const tokenEndpoint = getTokenEndpoint(options.platform);
    const tokenManager = new OAuthTokenManager(options.auth, tokenEndpoint);
    authConfig = tokenManager.toAuthConfig();
  }

  // Create the client
  const client = createClient<paths>({ baseUrl });

  // Add auth middleware
  client.use(createAuthMiddleware(authConfig));

  // Add custom middleware
  if (options.middleware) {
    for (const mw of options.middleware) {
      client.use(mw);
    }
  }

  return client;
}
