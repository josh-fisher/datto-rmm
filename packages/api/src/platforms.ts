/**
 * Datto RMM Platform identifiers.
 *
 * The Datto RMM API is hosted on multiple regional platforms.
 * All platforms share the same API schema.
 */
export const Platform = {
  PINOTAGE: 'pinotage',
  MERLOT: 'merlot',
  CONCORD: 'concord',
  VIDAL: 'vidal',
  ZINFANDEL: 'zinfandel',
  SYRAH: 'syrah',
} as const;

export type Platform = (typeof Platform)[keyof typeof Platform];

/**
 * Base API URLs for each Datto RMM platform.
 */
export const PLATFORM_URLS: Record<Platform, string> = {
  [Platform.PINOTAGE]: 'https://pinotage-api.centrastage.net/api',
  [Platform.MERLOT]: 'https://merlot-api.centrastage.net/api',
  [Platform.CONCORD]: 'https://concord-api.centrastage.net/api',
  [Platform.VIDAL]: 'https://vidal-api.centrastage.net/api',
  [Platform.ZINFANDEL]: 'https://zinfandel-api.centrastage.net/api',
  [Platform.SYRAH]: 'https://syrah-api.centrastage.net/api',
} as const;

/**
 * Get the base API URL for a platform.
 */
export function getPlatformUrl(platform: Platform): string {
  return PLATFORM_URLS[platform];
}

/**
 * Get the OAuth token endpoint for a platform.
 */
export function getTokenEndpoint(platform: Platform): string {
  return `${PLATFORM_URLS[platform]}/public/oauth/token`;
}
