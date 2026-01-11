import { describe, it, expect, vi } from 'vitest';
import { createAuthMiddleware } from './middleware.js';

describe('createAuthMiddleware', () => {
  it('should add Authorization header to requests', async () => {
    const mockGetToken = vi.fn().mockResolvedValue('test-token');
    const middleware = createAuthMiddleware({ getToken: mockGetToken });

    const request = new Request('https://api.example.com/test');

    const result = await middleware.onRequest!({
      request,
      schemaPath: '/test',
      params: {},
      options: {},
    });

    expect(result.headers.get('Authorization')).toBe('Bearer test-token');
    expect(mockGetToken).toHaveBeenCalledTimes(1);
  });

  it('should call onAuthError when response is 401', async () => {
    const mockOnAuthError = vi.fn();
    const middleware = createAuthMiddleware({
      getToken: async () => 'test-token',
      onAuthError: mockOnAuthError,
    });

    const response = new Response('Unauthorized', { status: 401 });

    await middleware.onResponse!({
      request: new Request('https://api.example.com/test'),
      response,
      options: {},
    });

    expect(mockOnAuthError).toHaveBeenCalledWith(expect.any(Error));
    expect(mockOnAuthError).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Authentication failed - token may be expired',
      })
    );
  });

  it('should not call onAuthError for non-401 responses', async () => {
    const mockOnAuthError = vi.fn();
    const middleware = createAuthMiddleware({
      getToken: async () => 'test-token',
      onAuthError: mockOnAuthError,
    });

    const response = new Response('OK', { status: 200 });

    await middleware.onResponse!({
      request: new Request('https://api.example.com/test'),
      response,
      options: {},
    });

    expect(mockOnAuthError).not.toHaveBeenCalled();
  });

  it('should work without onAuthError callback', async () => {
    const middleware = createAuthMiddleware({
      getToken: async () => 'test-token',
    });

    const response = new Response('Unauthorized', { status: 401 });

    // Should not throw
    await expect(
      middleware.onResponse!({
        request: new Request('https://api.example.com/test'),
        response,
        options: {},
      })
    ).resolves.toBeDefined();
  });
});
