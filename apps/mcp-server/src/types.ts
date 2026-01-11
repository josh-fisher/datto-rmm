/**
 * Type definitions for Datto RMM API responses.
 *
 * Note: The Datto OpenAPI spec doesn't define 200 responses properly,
 * so we define the expected response types here based on the schemas.
 */

// Re-export component schemas from the generated types
import type { components } from 'datto-rmm-api';

// Schema types - using exact names from the OpenAPI spec
export type Account = components['schemas']['Account'];
export type Site = components['schemas']['Site'];
export type Device = components['schemas']['Device'];
export type Alert = components['schemas']['Alert'];
export type Job = components['schemas']['Job'];
export type Variable = components['schemas']['Variable'];
export type Component = components['schemas']['Component'];
export type AuthUser = components['schemas']['AuthUser'];
export type Software = components['schemas']['Software'];
export type DeviceAudit = components['schemas']['DeviceAudit'];
export type ESXiHostAudit = components['schemas']['ESXiHostAudit'];
export type PrinterAudit = components['schemas']['PrinterAudit'];
export type Filter = components['schemas']['Filter'];
export type PaginationData = components['schemas']['PaginationData'];
export type ActivityLog = components['schemas']['ActivityLog'];
export type SiteSettings = components['schemas']['SiteSettings'];
export type StatusResponse = components['schemas']['StatusResponse'];
export type JobComponent = components['schemas']['JobComponent'];
export type JobResults = components['schemas']['JobResults'];
export type JobStdData = components['schemas']['JobStdData'];
export type JobComponentResult = components['schemas']['JobComponentResult'];
export type DnetSiteMappingsDto = components['schemas']['DnetSiteMappingsDto'];
export type RateStatusResponse = components['schemas']['RateStatusResponse'];
export type PaginationConfiguration = components['schemas']['PaginationConfiguration'];
export type ProxySettings = components['schemas']['ProxySettings'];
export type SystemInfo = components['schemas']['SystemInfo'];
export type LogicalDisk = components['schemas']['LogicalDisk'];
export type Processor = components['schemas']['Processor'];
export type PhysicalMemory = components['schemas']['PhysicalMemory'];

// Page response types - using exact names from the OpenAPI spec
export type SitesPage = components['schemas']['SitesPage'];
export type DevicesPage = components['schemas']['DevicesPage'];
export type AlertsPage = components['schemas']['AlertsPage'];
export type UsersPage = components['schemas']['UsersPage'];
export type VariablesPage = components['schemas']['VariablesPage'];
export type ComponentsPage = components['schemas']['ComponentsPage'];
export type SoftwarePage = components['schemas']['SoftwarePage'];
export type FiltersPage = components['schemas']['FiltersPage'];
export type JobComponentsPage = components['schemas']['JobComponentsPage'];
export type ActivityLogsPage = components['schemas']['ActivityLogsPage'];
export type DnetSiteMappingsPage = components['schemas']['DnetSiteMappingsPage'];

// Response types not in the schema (we define them ourselves)
export interface CreateQuickJobResponse {
  job?: Job;
  jobComponents?: JobComponent[];
}
