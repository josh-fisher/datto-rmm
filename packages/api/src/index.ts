// Client
export {
  createDattoClient,
  type DattoClient,
  type DattoClientOptions,
} from './client.js';

// Platforms
export {
  Platform,
  PLATFORM_URLS,
  getPlatformUrl,
  getTokenEndpoint,
} from './platforms.js';

// Auth
export {
  createAuthMiddleware,
  OAuthTokenManager,
  type AuthConfig,
  type OAuthCredentials,
  type TokenResponse,
} from './auth/index.js';

// Generated types - re-export all
export type * from './generated/types.js';
