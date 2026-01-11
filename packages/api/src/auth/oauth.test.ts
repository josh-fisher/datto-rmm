import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { OAuthTokenManager } from './oauth.js';

describe('OAuthTokenManager', () => {
  const mockCredentials = {
    apiKey: 'test-api-key',
    apiSecret: 'test-api-secret',
  };
  const mockTokenEndpoint = 'https://test-api.example.com/oauth/token';

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('should create a token manager with credentials', () => {
    const manager = new OAuthTokenManager(mockCredentials, mockTokenEndpoint);
    expect(manager).toBeDefined();
  });

  it('should fetch a new token when getToken is called', async () => {
    const mockResponse = {
      access_token: 'test-access-token',
      token_type: 'Bearer',
      expires_in: 3600,
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const manager = new OAuthTokenManager(mockCredentials, mockTokenEndpoint);
    const token = await manager.getToken();

    expect(token).toBe('test-access-token');
    expect(fetch).toHaveBeenCalledWith(mockTokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: expect.stringMatching(/^Basic /),
      },
      body: 'grant_type=client_credentials',
    });
  });

  it('should return cached token if not expired', async () => {
    const mockResponse = {
      access_token: 'test-access-token',
      token_type: 'Bearer',
      expires_in: 3600, // 1 hour
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const manager = new OAuthTokenManager(mockCredentials, mockTokenEndpoint);

    // First call - should fetch
    const token1 = await manager.getToken();
    expect(token1).toBe('test-access-token');
    expect(fetch).toHaveBeenCalledTimes(1);

    // Second call - should use cache
    const token2 = await manager.getToken();
    expect(token2).toBe('test-access-token');
    expect(fetch).toHaveBeenCalledTimes(1); // Still 1
  });

  it('should refresh token when close to expiry', async () => {
    const mockResponse1 = {
      access_token: 'token-1',
      token_type: 'Bearer',
      expires_in: 360, // 6 minutes
    };

    const mockResponse2 = {
      access_token: 'token-2',
      token_type: 'Bearer',
      expires_in: 3600,
    };

    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse1),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse2),
      });

    const manager = new OAuthTokenManager(mockCredentials, mockTokenEndpoint);

    // First call
    const token1 = await manager.getToken();
    expect(token1).toBe('token-1');

    // Advance time past the 5 minute buffer (token has 6 min, buffer is 5 min)
    vi.advanceTimersByTime(2 * 60 * 1000); // 2 minutes

    // Should refresh because we're within 5 min of expiry
    const token2 = await manager.getToken();
    expect(token2).toBe('token-2');
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('should throw on authentication failure', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      text: () => Promise.resolve('Invalid credentials'),
    });

    const manager = new OAuthTokenManager(mockCredentials, mockTokenEndpoint);

    await expect(manager.getToken()).rejects.toThrow('OAuth token request failed: 401');
  });

  it('should deduplicate concurrent refresh requests', async () => {
    const mockResponse = {
      access_token: 'test-token',
      token_type: 'Bearer',
      expires_in: 3600,
    };

    let resolvePromise: () => void;
    const fetchPromise = new Promise<void>((resolve) => {
      resolvePromise = resolve;
    });

    global.fetch = vi.fn().mockImplementation(async () => {
      await fetchPromise;
      return {
        ok: true,
        json: () => Promise.resolve(mockResponse),
      };
    });

    const manager = new OAuthTokenManager(mockCredentials, mockTokenEndpoint);

    // Start multiple concurrent requests
    const promise1 = manager.getToken();
    const promise2 = manager.getToken();
    const promise3 = manager.getToken();

    // Resolve the fetch
    resolvePromise!();

    const [token1, token2, token3] = await Promise.all([promise1, promise2, promise3]);

    expect(token1).toBe('test-token');
    expect(token2).toBe('test-token');
    expect(token3).toBe('test-token');
    expect(fetch).toHaveBeenCalledTimes(1); // Only one fetch call
  });

  it('should clear token when clearToken is called', async () => {
    const mockResponse = {
      access_token: 'test-token',
      token_type: 'Bearer',
      expires_in: 3600,
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const manager = new OAuthTokenManager(mockCredentials, mockTokenEndpoint);

    await manager.getToken();
    expect(fetch).toHaveBeenCalledTimes(1);

    manager.clearToken();

    await manager.getToken();
    expect(fetch).toHaveBeenCalledTimes(2); // Should fetch again
  });

  it('should return a valid AuthConfig from toAuthConfig', async () => {
    const mockResponse = {
      access_token: 'test-token',
      token_type: 'Bearer',
      expires_in: 3600,
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const manager = new OAuthTokenManager(mockCredentials, mockTokenEndpoint);
    const authConfig = manager.toAuthConfig();

    expect(authConfig).toHaveProperty('getToken');
    expect(typeof authConfig.getToken).toBe('function');

    const token = await authConfig.getToken();
    expect(token).toBe('test-token');
  });
});
