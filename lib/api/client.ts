import { tokenStorage } from './token-storage';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public errors?: string[]
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

function resolveUrl(endpoint: string): string {
  if (/^https?:\/\//i.test(endpoint)) {
    return endpoint;
  }

  return `${BASE_URL}${endpoint}`;
}

async function getAuthHeader(): Promise<HeadersInit> {
  const token = await tokenStorage.get();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = await getAuthHeader();
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...headers,
  };

  // Internal helper to actually perform the fetch
  const doFetch = async (): Promise<Response> =>
    fetch(resolveUrl(endpoint), {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

  let response = await doFetch();

  // If unauthorized, attempt token refresh and retry once
  if (response.status === 401) {
    // Avoid trying to refresh while calling auth endpoints
    if (!/\/api\/auth\/(login|register|refresh)/.test(endpoint)) {
      try {
        await refreshAuth();
        // rebuild headers with new token
        const newHeaders = await getAuthHeader();
        const retryDefaultHeaders: HeadersInit = {
          'Content-Type': 'application/json',
          ...newHeaders,
        };

        response = await fetch(resolveUrl(endpoint), {
          ...options,
          headers: {
            ...retryDefaultHeaders,
            ...options.headers,
          },
        });
      } catch (err) {
        // Clearing tokens handled by refreshAuth on failure
        let message = 'Unauthorized';
        if (err instanceof ApiError) message = err.message;
        throw new ApiError(message, 401);
      }
    }
  }

  if (!response.ok) {
    let errorData: { message?: string; errors?: string[] } = {};
    try {
      errorData = await response.json();
    } catch {
      // Response might be empty
    }
    throw new ApiError(
      errorData.message || `HTTP ${response.status}`,
      response.status,
      undefined,
      errorData.errors
    );
  }

  const data = await response.json();
  return data.data ?? data;
}

// Coordinate token refresh to avoid parallel refresh calls
let refreshPromise: Promise<void> | null = null;

async function refreshAuth(): Promise<void> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const refreshToken = await tokenStorage.getRefresh?.();
    if (!refreshToken) {
      await tokenStorage.clearTokens?.();
      throw new ApiError('No refresh token available', 401);
    }

    const res = await fetch(resolveUrl('/api/auth/refresh'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      await tokenStorage.clearTokens?.();
      let errMsg = `Refresh failed (${res.status})`;
      try {
        const body = await res.json();
        errMsg = body?.message || errMsg;
      } catch {}
      throw new ApiError(errMsg, res.status);
    }

    const json = await res.json();
    // Expecting { accessToken, refreshToken } or data wrapper
    const accessToken = json.data?.accessToken ?? json.accessToken ?? json.data?.token ?? null;
    const refresh = json.data?.refreshToken ?? json.refreshToken ?? null;

    if (!accessToken) {
      await tokenStorage.clearTokens?.();
      throw new ApiError('Refresh response missing access token', 500);
    }

    await tokenStorage.setTokens?.(accessToken, refresh ?? undefined);
  })().finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
}

function buildQueryString(params?: Record<string, unknown>): string {
  if (!params) return '';
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });
  const query = searchParams.toString();
  return query ? `?${query}` : '';
}

export const apiClient = {
  get: <T>(endpoint: string, options?: { searchParams?: Record<string, unknown> }) => {
    const queryString = buildQueryString(options?.searchParams);
    return apiRequest<T>(`${endpoint}${queryString}`);
  },
  post: <T>(endpoint: string, body: unknown) =>
    apiRequest<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(endpoint: string, body?: unknown) =>
    apiRequest<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),
  delete: <T>(endpoint: string) => apiRequest<T>(endpoint, { method: 'DELETE' }),
};
