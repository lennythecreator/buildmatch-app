import type {
    GoogleOAuthInput,
    LoginInput,
    RegisterInput,
    UpdateProfileInput,
} from '@/lib/api/services';
import { authService, userService } from '@/lib/api/services';
import type { User } from '@/lib/api/types';
import { clearAllQueries } from '@/lib/query-client';
import { useAuthStore } from '@/store/auth';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';

export const AUTH_QUERY_KEY = ['auth', 'me'] as const;
export const USER_QUERY_KEY = ['user', 'me'] as const;

export function useCurrentUser() {
  const setUser = useAuthStore((state) => state.setUser);

  return useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: async () => {
      const user = await authService.getMe();
      setUser(user);
      return user;
    },
    enabled: useAuthStore((state) => state.isAuthenticated),
    retry: false,
  });
}

export function useLogin() {
  const { login } = useAuthStore();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (input: LoginInput) => authService.login(input),
    onSuccess: async (data) => {
      await login(data.user, data.token);
      queryClient.setQueryData(AUTH_QUERY_KEY, data.user);
      router.replace('/(tabs)/dashboard');
    },
  });
}

export function useRegister() {
  const { login } = useAuthStore();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (input: RegisterInput) => authService.register(input),
    onSuccess: async (data) => {
      await login(data.user, data.token);
      queryClient.setQueryData(AUTH_QUERY_KEY, data.user);
      router.replace('/(tabs)/dashboard');
    },
  });
}

export function useGoogleOAuth() {
  const { login } = useAuthStore();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (input: GoogleOAuthInput) => authService.googleOAuth(input),
    onSuccess: async (data) => {
      await login(data.user, data.token);
      queryClient.setQueryData(AUTH_QUERY_KEY, data.user);
      router.replace('/(tabs)/dashboard');
    },
  });
}

export function useLogout() {
  const { logout } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: () => Promise.resolve(logout()),
    onSuccess: () => {
      clearAllQueries();
      router.replace('/(auth)/login');
    },
  });
}

export function useUpdateProfile() {
  const { setUser } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateProfileInput) => userService.updateProfile(input),
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      queryClient.setQueryData(AUTH_QUERY_KEY, updatedUser);
    },
  });
}

export function useUpdateAvatar() {
  const { setUser } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (avatarUrl: string) => userService.updateAvatar(avatarUrl),
    onSuccess: (_, avatarUrl) => {
      const currentUser = queryClient.getQueryData<User>(AUTH_QUERY_KEY);
      if (currentUser) {
        const updatedUser = { ...currentUser, avatarUrl };
        setUser(updatedUser);
        queryClient.setQueryData(AUTH_QUERY_KEY, updatedUser);
      }
    },
  });
}

export function useDeleteAvatar() {
  const { setUser } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => userService.deleteAvatar(),
    onSuccess: () => {
      const currentUser = queryClient.getQueryData<User>(AUTH_QUERY_KEY);
      if (currentUser) {
        const updatedUser = { ...currentUser, avatarUrl: undefined };
        setUser(updatedUser);
        queryClient.setQueryData(AUTH_QUERY_KEY, updatedUser);
      }
    },
  });
}

export function useNotificationPreferences() {
  return useQuery({
    queryKey: ['user', 'notification-preferences'],
    queryFn: () => userService.getNotificationPreferences(),
  });
}

export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (prefs: Parameters<typeof userService.updateNotificationPreferences>[0]) =>
      userService.updateNotificationPreferences(prefs),
    onSuccess: (data) => {
      queryClient.setQueryData(['user', 'notification-preferences'], data);
    },
  });
}
