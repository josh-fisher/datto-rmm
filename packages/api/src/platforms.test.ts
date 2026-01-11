import { describe, it, expect } from 'vitest';
import { Platform, PLATFORM_URLS, getPlatformUrl, getTokenEndpoint } from './platforms.js';

describe('Platform', () => {
  it('should have all expected platforms', () => {
    expect(Platform.PINOTAGE).toBe('pinotage');
    expect(Platform.MERLOT).toBe('merlot');
    expect(Platform.CONCORD).toBe('concord');
    expect(Platform.VIDAL).toBe('vidal');
    expect(Platform.ZINFANDEL).toBe('zinfandel');
    expect(Platform.SYRAH).toBe('syrah');
  });
});

describe('PLATFORM_URLS', () => {
  it('should have URLs for all platforms', () => {
    expect(PLATFORM_URLS[Platform.PINOTAGE]).toBe('https://pinotage-api.centrastage.net/api');
    expect(PLATFORM_URLS[Platform.MERLOT]).toBe('https://merlot-api.centrastage.net/api');
    expect(PLATFORM_URLS[Platform.CONCORD]).toBe('https://concord-api.centrastage.net/api');
    expect(PLATFORM_URLS[Platform.VIDAL]).toBe('https://vidal-api.centrastage.net/api');
    expect(PLATFORM_URLS[Platform.ZINFANDEL]).toBe('https://zinfandel-api.centrastage.net/api');
    expect(PLATFORM_URLS[Platform.SYRAH]).toBe('https://syrah-api.centrastage.net/api');
  });
});

describe('getPlatformUrl', () => {
  it('should return the correct URL for each platform', () => {
    expect(getPlatformUrl(Platform.MERLOT)).toBe('https://merlot-api.centrastage.net/api');
    expect(getPlatformUrl(Platform.PINOTAGE)).toBe('https://pinotage-api.centrastage.net/api');
  });
});

describe('getTokenEndpoint', () => {
  it('should return the OAuth token endpoint for a platform', () => {
    expect(getTokenEndpoint(Platform.MERLOT)).toBe(
      'https://merlot-api.centrastage.net/api/public/oauth/token'
    );
    expect(getTokenEndpoint(Platform.PINOTAGE)).toBe(
      'https://pinotage-api.centrastage.net/api/public/oauth/token'
    );
  });
});
