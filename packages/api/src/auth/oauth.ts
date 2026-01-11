import type { AuthConfig } from './middleware.js';

/**
 * OAuth 2.0 client credentials for Datto RMM API.
 */
export interface OAuthCredentials {
  /** API Key (client ID) */
  apiKey: string;
  /** API Secret (client secret) */
  apiSecret: string;
}

/**
 * OAuth token response from the Datto RMM API.
 */
export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

/**
 * Manages OAuth 2.0 tokens for the Datto RMM API.
 *
 * Features:
 * - Automatic token caching
 * - Proactive token refresh (5 minutes before expiry)
 * - Request deduplication for concurrent refresh attempts
 *
 * @example
 * ```ts
 * const tokenManager = new OAuthTokenManager(
 *   { apiKey: 'xxx', apiSecret: 'yyy' },
 *   'https://merlot-api.centrastage.net/api/public/oauth/token'
 * );
 *
 * const token = await tokenManager.getToken();
 * ```
 */
export class OAuthTokenManager {
  private token: string | null = null;
  private expiresAt = 0;
  private refreshPromise: Promise<string> | null = null;

  constructor(
    private readonly credentials: OAuthCredentials,
    private readonly tokenEndpoint: string,
  ) {}

  /**
   * Get a valid access token.
   *
   * Returns a cached token if still valid, otherwise refreshes.
   * Concurrent calls during refresh will share the same promise.
   */
  async getToken(): Promise<string> {
    // Return cached token if still valid (with 5 minute buffer)
    const bufferMs = 5 * 60 * 1000;
    if (this.token && Date.now() < this.expiresAt - bufferMs) {
      return this.token;
    }

    // Deduplicate concurrent refresh requests
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.refreshToken();
    try {
      return await this.refreshPromise;
    } finally {
      this.refreshPromise = null;
    }
  }

  /**
   * Force a token refresh.
   */
  async refreshToken(): Promise<string> {
    const credentials = btoa(
      `${this.credentials.apiKey}:${this.credentials.apiSecret}`,
    );

    const response = await fetch(this.tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${credentials}`,
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `OAuth token request failed: ${response.status} - ${errorText}`,
      );
    }

    const data = (await response.json()) as TokenResponse;
    this.token = data.access_token;
    this.expiresAt = Date.now() + data.expires_in * 1000;

    return this.token;
  }

  /**
   * Clear the cached token.
   */
  clearToken(): void {
    this.token = null;
    this.expiresAt = 0;
  }

  /**
   * Convert to an AuthConfig for use with createAuthMiddleware.
   */
  toAuthConfig(): AuthConfig {
    return {
      getToken: () => this.getToken(),
    };
  }
}
