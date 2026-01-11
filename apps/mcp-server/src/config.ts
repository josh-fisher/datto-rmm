import { Platform } from '@datto-rmm/api';

/**
 * Configuration for the Datto RMM MCP server.
 */
export interface ServerConfig {
  /** Datto RMM API key */
  apiKey: string;
  /** Datto RMM API secret */
  apiSecret: string;
  /** Datto RMM platform */
  platform: Platform;
}

/**
 * Parse platform string to Platform enum value.
 */
function parsePlatform(value: string | undefined): Platform {
  if (!value) {
    return Platform.MERLOT; // Default
  }

  const normalized = value.toLowerCase();
  const platforms: Record<string, Platform> = {
    pinotage: Platform.PINOTAGE,
    merlot: Platform.MERLOT,
    concord: Platform.CONCORD,
    vidal: Platform.VIDAL,
    zinfandel: Platform.ZINFANDEL,
    syrah: Platform.SYRAH,
  };

  const platform = platforms[normalized];
  if (!platform) {
    const valid = Object.keys(platforms).join(', ');
    throw new Error(`Invalid platform "${value}". Valid platforms: ${valid}`);
  }

  return platform;
}

/**
 * Load configuration from environment variables.
 *
 * Required environment variables:
 * - DATTO_API_KEY: Datto RMM API key
 * - DATTO_API_SECRET: Datto RMM API secret
 *
 * Optional environment variables:
 * - DATTO_PLATFORM: Platform name (default: merlot)
 */
export function loadConfig(): ServerConfig {
  const apiKey = process.env['DATTO_API_KEY'];
  const apiSecret = process.env['DATTO_API_SECRET'];
  const platformStr = process.env['DATTO_PLATFORM'];

  if (!apiKey) {
    throw new Error('DATTO_API_KEY environment variable is required');
  }

  if (!apiSecret) {
    throw new Error('DATTO_API_SECRET environment variable is required');
  }

  return {
    apiKey,
    apiSecret,
    platform: parsePlatform(platformStr),
  };
}
