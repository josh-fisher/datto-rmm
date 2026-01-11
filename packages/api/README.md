# @datto-rmm/api

Auto-generated TypeScript client for the Datto RMM API.

## Installation

```bash
pnpm add @datto-rmm/api
```

## Quick Start

```typescript
import { createDattoClient, Platform } from '@datto-rmm/api';

// Create a client with OAuth credentials
const client = createDattoClient({
  platform: Platform.MERLOT,
  auth: {
    apiKey: process.env.DATTO_API_KEY!,
    apiSecret: process.env.DATTO_API_SECRET!,
  },
});

// Make typed API calls
const { data, error } = await client.GET('/v2/account/devices');

if (error) {
  console.error('API error:', error);
} else {
  console.log('Devices:', data);
}
```

## Platforms

The Datto RMM API is hosted on multiple regional platforms. All platforms share the same API schema.

```typescript
import { Platform } from '@datto-rmm/api';

// Available platforms
Platform.PINOTAGE  // https://pinotage-api.centrastage.net/api
Platform.MERLOT    // https://merlot-api.centrastage.net/api
Platform.CONCORD   // https://concord-api.centrastage.net/api
Platform.VIDAL     // https://vidal-api.centrastage.net/api
Platform.ZINFANDEL // https://zinfandel-api.centrastage.net/api
Platform.SYRAH     // https://syrah-api.centrastage.net/api
```

## Authentication

### OAuth Credentials (Recommended)

Provide your API key and secret, and the client will automatically manage token refresh:

```typescript
const client = createDattoClient({
  platform: Platform.MERLOT,
  auth: {
    apiKey: 'your-api-key',
    apiSecret: 'your-api-secret',
  },
});
```

### Custom Token Provider

For more control over token management, provide a custom `getToken` function:

```typescript
const client = createDattoClient({
  platform: Platform.MERLOT,
  auth: {
    getToken: async () => {
      // Return your token from wherever you store it
      return myTokenStore.getToken();
    },
  },
});
```

## API Usage

The client provides fully typed methods for all API endpoints. Use your IDE's autocomplete to explore available paths:

```typescript
// Get account devices
const { data: devices } = await client.GET('/v2/account/devices');

// Get a specific device
const { data: device } = await client.GET('/v2/device/{deviceUid}', {
  params: { path: { deviceUid: 'device-123' } },
});

// Get device alerts
const { data: alerts } = await client.GET('/v2/device/{deviceUid}/alerts/open', {
  params: { path: { deviceUid: 'device-123' } },
});

// Resolve an alert
const { data } = await client.POST('/v2/alert/{alertUid}/resolve', {
  params: { path: { alertUid: 'alert-456' } },
});

// Create a quick job
const { data: job } = await client.PUT('/v2/device/{deviceUid}/quickjob', {
  params: { path: { deviceUid: 'device-123' } },
  body: {
    jobName: 'My Quick Job',
    componentUid: 'component-789',
    variables: {},
  },
});
```

## Middleware

Add custom middleware for logging, error handling, or other cross-cutting concerns:

```typescript
import { createDattoClient, Platform } from '@datto-rmm/api';

const client = createDattoClient({
  platform: Platform.MERLOT,
  auth: { apiKey: '...', apiSecret: '...' },
  middleware: [
    {
      onRequest({ request }) {
        console.log('Request:', request.method, request.url);
        return request;
      },
      onResponse({ response }) {
        console.log('Response:', response.status);
        return response;
      },
    },
  ],
});
```

## Type Exports

All API types are exported for use in your application:

```typescript
import type { components, paths } from '@datto-rmm/api/types';

// Use schema types
type Device = components['schemas']['Device'];
type Alert = components['schemas']['Alert'];
type Site = components['schemas']['Site'];

// Use path types for custom type guards
type DevicesResponse = paths['/v2/account/devices']['get']['responses']['200']['content']['application/json'];
```

## Regenerating Types

If the Datto RMM API is updated, regenerate the types:

```bash
# Sync the latest OpenAPI spec
pnpm sync:openapi

# Regenerate clients
pnpm generate:api
```

## License

MIT
