import type { DattoClient } from 'datto-rmm-api';
import { handleVoidResponse, errorResult, successResult, type ToolResult } from '../utils/response.js';

/**
 * Create an account variable.
 */
export async function createAccountVariable(
  client: DattoClient,
  args: { name: string; value: string; masked?: boolean }
): Promise<ToolResult> {
  try {
    const response = await client.PUT('/v2/account/variable', {
      body: {
        name: args.name,
        value: args.value,
        masked: args.masked,
      },
    });
    handleVoidResponse(response);

    return successResult(`Account variable "${args.name}" created successfully`);
  } catch (err) {
    return errorResult(`Error creating account variable: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/**
 * Update an account variable.
 */
export async function updateAccountVariable(
  client: DattoClient,
  args: { variableId: number; name?: string; value?: string; masked?: boolean }
): Promise<ToolResult> {
  try {
    const response = await client.POST('/v2/account/variable/{variableId}', {
      params: {
        path: { variableId: args.variableId },
      },
      body: {
        name: args.name,
        value: args.value,
        masked: args.masked,
      },
    });
    handleVoidResponse(response);

    return successResult(`Account variable ${args.variableId} updated successfully`);
  } catch (err) {
    return errorResult(`Error updating account variable: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/**
 * Delete an account variable.
 */
export async function deleteAccountVariable(
  client: DattoClient,
  args: { variableId: number }
): Promise<ToolResult> {
  try {
    const response = await client.DELETE('/v2/account/variable/{variableId}', {
      params: {
        path: { variableId: args.variableId },
      },
    });
    handleVoidResponse(response);

    return successResult(`Account variable ${args.variableId} deleted successfully`);
  } catch (err) {
    return errorResult(`Error deleting account variable: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/**
 * Create a site variable.
 */
export async function createSiteVariable(
  client: DattoClient,
  args: { siteUid: string; name: string; value: string; masked?: boolean }
): Promise<ToolResult> {
  try {
    const response = await client.PUT('/v2/site/{siteUid}/variable', {
      params: {
        path: { siteUid: args.siteUid },
      },
      body: {
        name: args.name,
        value: args.value,
        masked: args.masked,
      },
    });
    handleVoidResponse(response);

    return successResult(`Site variable "${args.name}" created successfully`);
  } catch (err) {
    return errorResult(`Error creating site variable: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/**
 * Update a site variable.
 */
export async function updateSiteVariable(
  client: DattoClient,
  args: { siteUid: string; variableId: number; name?: string; value?: string; masked?: boolean }
): Promise<ToolResult> {
  try {
    const response = await client.POST('/v2/site/{siteUid}/variable/{variableId}', {
      params: {
        path: {
          siteUid: args.siteUid,
          variableId: args.variableId,
        },
      },
      body: {
        name: args.name,
        value: args.value,
        masked: args.masked,
      },
    });
    handleVoidResponse(response);

    return successResult(`Site variable ${args.variableId} updated successfully`);
  } catch (err) {
    return errorResult(`Error updating site variable: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/**
 * Delete a site variable.
 */
export async function deleteSiteVariable(
  client: DattoClient,
  args: { siteUid: string; variableId: number }
): Promise<ToolResult> {
  try {
    const response = await client.DELETE('/v2/site/{siteUid}/variable/{variableId}', {
      params: {
        path: {
          siteUid: args.siteUid,
          variableId: args.variableId,
        },
      },
    });
    handleVoidResponse(response);

    return successResult(`Site variable ${args.variableId} deleted successfully`);
  } catch (err) {
    return errorResult(`Error deleting site variable: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/**
 * Update site proxy settings.
 */
export async function updateSiteProxy(
  client: DattoClient,
  args: {
    siteUid: string;
    type: 'http' | 'socks4' | 'socks5';
    host: string;
    port: number;
    username?: string;
    password?: string;
  }
): Promise<ToolResult> {
  try {
    const response = await client.POST('/v2/site/{siteUid}/settings/proxy', {
      params: {
        path: { siteUid: args.siteUid },
      },
      body: {
        type: args.type,
        host: args.host,
        port: args.port,
        username: args.username,
        password: args.password,
      },
    });
    handleVoidResponse(response);

    return successResult(`Site ${args.siteUid} proxy settings updated successfully`);
  } catch (err) {
    return errorResult(`Error updating site proxy: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/**
 * Delete site proxy settings.
 */
export async function deleteSiteProxy(
  client: DattoClient,
  args: { siteUid: string }
): Promise<ToolResult> {
  try {
    const response = await client.DELETE('/v2/site/{siteUid}/settings/proxy', {
      params: {
        path: { siteUid: args.siteUid },
      },
    });
    handleVoidResponse(response);

    return successResult(`Site ${args.siteUid} proxy settings deleted successfully`);
  } catch (err) {
    return errorResult(`Error deleting site proxy: ${err instanceof Error ? err.message : String(err)}`);
  }
}
