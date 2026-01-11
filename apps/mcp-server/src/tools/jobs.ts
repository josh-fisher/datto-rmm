import type { DattoClient } from 'datto-rmm-api';
import { normalizePagination, parsePageInfo } from '../utils/pagination.js';
import { handleResponse, errorResult, successResult, type ToolResult } from '../utils/response.js';
import type * as T from '../types.js';

/**
 * Get job by UID.
 */
export async function getJob(client: DattoClient, args: { jobUid: string }): Promise<ToolResult> {
  try {
    const response = await client.GET('/v2/job/{jobUid}', {
      params: {
        path: { jobUid: args.jobUid },
      },
    });
    const data = handleResponse<T.Job>(response);

    const lines = [
      `# Job: ${data.name ?? 'Unknown'}`,
      '',
      `**UID:** ${data.uid}`,
      `**ID:** ${data.id}`,
      `**Status:** ${data.status ?? 'N/A'}`,
      `**Created:** ${data.dateCreated ?? 'N/A'}`,
    ];

    return successResult(lines.join('\n'));
  } catch (err) {
    return errorResult(`Error fetching job: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/**
 * Get job components.
 */
export async function getJobComponents(
  client: DattoClient,
  args: { jobUid: string; page?: number; max?: number }
): Promise<ToolResult> {
  try {
    const pagination = normalizePagination(args);

    const response = await client.GET('/v2/job/{jobUid}/components', {
      params: {
        path: { jobUid: args.jobUid },
        query: {
          page: pagination.page,
          max: pagination.max,
        },
      },
    });
    const data = handleResponse<T.JobComponentsPage>(response);

    if (!data.jobComponents || data.jobComponents.length === 0) {
      return successResult('No components found for this job');
    }

    const pageInfo = parsePageInfo(data);
    const lines = [
      `# Job Components (${pageInfo.count} total)`,
      '',
    ];

    for (const component of data.jobComponents) {
      lines.push(`## ${component.name ?? 'Unknown'}`);
      lines.push(`- **UID:** ${component.uid}`);
      if (component.variables && component.variables.length > 0) {
        lines.push('- **Variables:**');
        for (const variable of component.variables) {
          lines.push(`  - ${variable.name}: ${variable.value ?? 'N/A'}`);
        }
      }
      lines.push('');
    }

    return successResult(lines.join('\n'));
  } catch (err) {
    return errorResult(`Error fetching job components: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/**
 * Get job results for a device.
 */
export async function getJobResults(
  client: DattoClient,
  args: { jobUid: string; deviceUid: string }
): Promise<ToolResult> {
  try {
    const response = await client.GET('/v2/job/{jobUid}/results/{deviceUid}', {
      params: {
        path: {
          jobUid: args.jobUid,
          deviceUid: args.deviceUid,
        },
      },
    });
    const data = handleResponse<T.JobResults>(response);

    const lines = [
      '# Job Results',
      '',
      `**Job UID:** ${data.jobUid ?? args.jobUid}`,
      `**Device UID:** ${data.deviceUid ?? args.deviceUid}`,
      `**Ran On:** ${data.ranOn ?? 'N/A'}`,
      `**Status:** ${data.jobDeploymentStatus ?? 'N/A'}`,
      '',
    ];

    if (data.componentResults && data.componentResults.length > 0) {
      lines.push('## Component Results');
      lines.push('');
      for (const result of data.componentResults) {
        lines.push(`### ${result.componentName ?? 'Unknown Component'}`);
        lines.push(`- **Status:** ${result.componentStatus ?? 'N/A'}`);
        lines.push(`- **Warnings:** ${result.numberOfWarnings ?? 0}`);
        lines.push(`- **Has StdOut:** ${result.hasStdOut ? 'Yes' : 'No'}`);
        lines.push(`- **Has StdErr:** ${result.hasStdErr ? 'Yes' : 'No'}`);
        lines.push('');
      }
    }

    return successResult(lines.join('\n'));
  } catch (err) {
    return errorResult(`Error fetching job results: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/**
 * Get job stdout for a device.
 */
export async function getJobStdout(
  client: DattoClient,
  args: { jobUid: string; deviceUid: string }
): Promise<ToolResult> {
  try {
    const response = await client.GET('/v2/job/{jobUid}/results/{deviceUid}/stdout', {
      params: {
        path: {
          jobUid: args.jobUid,
          deviceUid: args.deviceUid,
        },
      },
    });
    const data = handleResponse<T.JobStdData[]>(response);

    if (data.length === 0) {
      return successResult('No stdout output for this job/device');
    }

    const lines = [
      '# Job Stdout',
      '',
      `**Job UID:** ${args.jobUid}`,
      `**Device UID:** ${args.deviceUid}`,
      '',
      '```',
    ];

    for (const entry of data) {
      if (entry.stdData) {
        lines.push(entry.stdData);
      }
    }

    lines.push('```');

    return successResult(lines.join('\n'));
  } catch (err) {
    return errorResult(`Error fetching job stdout: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/**
 * Get job stderr for a device.
 */
export async function getJobStderr(
  client: DattoClient,
  args: { jobUid: string; deviceUid: string }
): Promise<ToolResult> {
  try {
    const response = await client.GET('/v2/job/{jobUid}/results/{deviceUid}/stderr', {
      params: {
        path: {
          jobUid: args.jobUid,
          deviceUid: args.deviceUid,
        },
      },
    });
    const data = handleResponse<T.JobStdData[]>(response);

    if (data.length === 0) {
      return successResult('No stderr output for this job/device');
    }

    const lines = [
      '# Job Stderr',
      '',
      `**Job UID:** ${args.jobUid}`,
      `**Device UID:** ${args.deviceUid}`,
      '',
      '```',
    ];

    for (const entry of data) {
      if (entry.stdData) {
        lines.push(entry.stdData);
      }
    }

    lines.push('```');

    return successResult(lines.join('\n'));
  } catch (err) {
    return errorResult(`Error fetching job stderr: ${err instanceof Error ? err.message : String(err)}`);
  }
}
