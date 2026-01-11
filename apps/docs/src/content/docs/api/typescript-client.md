---
title: TypeScript Client
description: Using the @datto-rmm/api TypeScript client
---

The `@datto-rmm/api` package provides a fully typed TypeScript client for the Datto RMM API.

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

The Datto RMM API is hosted on multiple regional platforms. Choose the platform that matches your account:

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

The token manager:
- Caches tokens in memory
- Proactively refreshes tokens 5 minutes before expiry
- Deduplicates concurrent refresh requests

### Custom Token Provider

For more control over token management (e.g., using a token store):

```typescript
const client = createDattoClient({
  platform: Platform.MERLOT,
  auth: {
    getToken: async () => {
      return myTokenStore.getToken();
    },
    onAuthError: (error) => {
      console.error('Auth failed:', error);
    },
  },
});
```

## API Examples

### Get Account Devices

```typescript
const { data, error } = await client.GET('/v2/account/devices');

if (data) {
  for (const device of data.devices ?? []) {
    console.log(device.hostname, device.intIpAddress);
  }
}
```

### Get Device Details

```typescript
const { data: device } = await client.GET('/v2/device/{deviceUid}', {
  params: { path: { deviceUid: 'device-123' } },
});

console.log(device?.hostname, device?.lastSeen);
```

### Get Device Alerts

```typescript
const { data } = await client.GET('/v2/device/{deviceUid}/alerts/open', {
  params: { path: { deviceUid: 'device-123' } },
});

for (const alert of data?.alerts ?? []) {
  console.log(alert.alertType, alert.message);
}
```

### Resolve an Alert

```typescript
const { data, error } = await client.POST('/v2/alert/{alertUid}/resolve', {
  params: { path: { alertUid: 'alert-456' } },
});
```

### Schedule a Quick Job

```typescript
const { data } = await client.PUT('/v2/device/{deviceUid}/quickjob', {
  params: { path: { deviceUid: 'device-123' } },
  body: {
    jobName: 'My Quick Job',
    componentUid: 'component-789',
    variables: {},
  },
});

console.log('Job UID:', data?.job?.uid);
```

### Get Sites

```typescript
const { data } = await client.GET('/v2/account/sites');

for (const site of data?.sites ?? []) {
  console.log(site.name, site.numberOfDevices);
}
```

## Middleware

Add custom middleware for logging, error handling, or other cross-cutting concerns:

```typescript
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

## Using Types

All API types are exported for use in your application:

```typescript
import type { components, paths } from '@datto-rmm/api/types';

// Use schema types
type Device = components['schemas']['Device'];
type Alert = components['schemas']['Alert'];
type Site = components['schemas']['Site'];

// Function with typed parameters
function processDevice(device: Device) {
  console.log(device.hostname);
}

// Use path response types
type DevicesResponse = paths['/v2/account/devices']['get']['responses']['200']['content']['application/json'];
```

## Error Handling

The client returns errors in the `error` field:

```typescript
const { data, error, response } = await client.GET('/v2/account/devices');

if (error) {
  // error contains the parsed error response
  console.error('Error:', error);

  // response contains the raw Response object
  console.error('Status:', response?.status);
}
```

## Regenerating Types

If the Datto RMM API is updated:

```bash
# Sync the latest OpenAPI spec
pnpm sync:openapi

# Regenerate clients
pnpm generate:api

# Rebuild
pnpm build
```
