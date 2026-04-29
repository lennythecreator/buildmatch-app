import { apiClient } from '../client';
import type { AuthResponse, NotificationPreferences, User } from '../types';

export interface RegisterInput {
  email: string;
  password: string;
  role: 'INVESTOR' | 'CONTRACTOR';
  firstName: string;
  lastName: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface GoogleOAuthInput {
  idToken: string;
  role?: 'INVESTOR' | 'CONTRACTOR';
  firstName?: string;
  lastName?: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  token: string;
  password: string;
}

export interface UpdateProfileInput {
  firstName?: string;
  lastName?: string;
  phone?: string;
  bio?: string;
  city?: string;
  state?: string;
  company?: string;
  title?: string;
  website?: string;
  displayName?: string;
  pronouns?: string;
  timezone?: string;
  locale?: string;
  dateFormat?: string;
  numberFormat?: string;
  quietHoursStart?: string;
  quietHoursEnd?: string;
  profilePublic?: boolean;
  projectPreference?: string;
  aiPreference?: string;
}

export interface LinkGoogleInput {
  idToken: string;
}

export const authService = {
  register: (input: RegisterInput) => apiClient.post<AuthResponse>('/api/auth/register', input),

  login: (input: LoginInput) => apiClient.post<AuthResponse>('/api/auth/login', input),

  googleOAuth: (input: GoogleOAuthInput) => apiClient.post<AuthResponse>('/api/auth/google', input),

  getMe: () => apiClient.get<User>('/api/auth/me'),

  linkGoogle: (input: LinkGoogleInput) =>
    apiClient.post<{ success: boolean }>('/api/auth/google/link', input),

  unlinkGoogle: () => apiClient.post<{ success: boolean }>('/api/auth/google/unlink', {}),

  forgotPassword: (input: ForgotPasswordInput) =>
    apiClient.post<{ success: boolean }>('/api/auth/forgot-password', input),

  verifyResetToken: (token: string) =>
    apiClient.get<{ valid: boolean }>(
      `/api/auth/reset-password/verify?token=${encodeURIComponent(token)}`
    ),

  resetPassword: (input: ResetPasswordInput) =>
    apiClient.post<{ success: boolean }>('/api/auth/reset-password', input),

  requestEmailVerification: () => apiClient.post<{ success: boolean }>('/api/auth/email/verify/request', {}),

  confirmEmailVerification: (token: string) =>
    apiClient.post<{ success: boolean }>('/api/auth/email/verify/confirm', { token }),

  submitIdDocument: (documentUrl: string) =>
    apiClient.post<{ success: boolean }>('/api/auth/identity/document', { documentUrl }),
};

export const userService = {
  getProfile: () => apiClient.get<User>('/api/users/me'),

  updateProfile: (input: UpdateProfileInput) =>
    apiClient.put<User>('/api/users/me', input),

  updateAvatar: (avatarUrl: string) =>
    apiClient.put<{ avatarUrl: string }>('/api/users/me/avatar', { avatarUrl }),

  deleteAvatar: () => apiClient.delete<void>('/api/users/me/avatar'),

  getNotificationPreferences: () =>
    apiClient.get<NotificationPreferences>('/api/users/me/notification-preferences'),

  updateNotificationPreferences: (prefs: Partial<NotificationPreferences>) =>
    apiClient.put<NotificationPreferences>('/api/users/me/notification-preferences', prefs),
};
