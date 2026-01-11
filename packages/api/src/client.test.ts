import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createDattoClient } from './client.js';
import { Platform } from './platforms.js';

describe('createDattoClient', () => {
  beforeEach(() => {
    // Mock fetch for token requests
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          access_token: 'test-token',
          token_type: 'Bearer',
          expires_in: 3600,
        }),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create a client with OAuth credentials', () => {
    const client = createDattoClient({
      platform: Platform.MERLOT,
      auth: {
        apiKey: 'test-key',
        apiSecret: 'test-secret',
      },
    });

    expect(client).toBeDefined();
    expect(client.GET).toBeDefined();
    expect(client.POST).toBeDefined();
    expect(client.PUT).toBeDefined();
    expect(client.DELETE).toBeDefined();
  });

  it('should create a client with custom auth config', () => {
    const client = createDattoClient({
      platform: Platform.MERLOT,
      auth: {
        getToken: async () => 'custom-token',
      },
    });

    expect(client).toBeDefined();
  });

  it('should accept custom base URL', () => {
    const client = createDattoClient({
      platform: Platform.MERLOT,
      baseUrl: 'https://custom-api.example.com',
      auth: {
        getToken: async () => 'token',
      },
    });

    expect(client).toBeDefined();
  });

  it('should accept custom middleware', () => {
    const customMiddleware = {
      onRequest: vi.fn(({ request }) => request),
    };

    const client = createDattoClient({
      platform: Platform.MERLOT,
      auth: {
        getToken: async () => 'token',
      },
      middleware: [customMiddleware],
    });

    expect(client).toBeDefined();
  });

  it('should work with all platforms', () => {
    const platforms = [
      Platform.PINOTAGE,
      Platform.MERLOT,
      Platform.CONCORD,
      Platform.VIDAL,
      Platform.ZINFANDEL,
      Platform.SYRAH,
    ];

    for (const platform of platforms) {
      const client = createDattoClient({
        platform,
        auth: {
          getToken: async () => 'token',
        },
      });

      expect(client).toBeDefined();
    }
  });
});
