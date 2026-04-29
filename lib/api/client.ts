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

  const response = await fetch(resolveUrl(endpoint), {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

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
