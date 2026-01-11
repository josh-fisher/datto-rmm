/**
 * Standard pagination parameters used across Datto RMM API.
 */
export interface PaginationParams {
  page?: number;
  max?: number;
}

/**
 * Default page size for list operations.
 */
export const DEFAULT_PAGE_SIZE = 50;

/**
 * Maximum page size allowed by the API.
 */
export const MAX_PAGE_SIZE = 250;

/**
 * Normalize pagination parameters with defaults.
 */
export function normalizePagination(params?: PaginationParams): Required<PaginationParams> {
  return {
    page: params?.page ?? 1,
    max: Math.min(params?.max ?? DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE),
  };
}

/**
 * Extract pagination info from a paginated response.
 */
export interface PageInfo {
  page: number;
  totalPages: number;
  count: number;
  hasMore: boolean;
}

/**
 * Parse pagination info from API response.
 */
export function parsePageInfo(response: {
  pageDetails?: {
    page?: number;
    totalPages?: number;
    count?: number;
  } | null;
}): PageInfo {
  const details = response.pageDetails;
  const page = details?.page ?? 1;
  const totalPages = details?.totalPages ?? 1;
  const count = details?.count ?? 0;

  return {
    page,
    totalPages,
    count,
    hasMore: page < totalPages,
  };
}
