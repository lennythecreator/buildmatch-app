import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';
import type { User, UserRoleType } from '@/lib/api/types';

const TOKEN_KEY = 'auth_token';

const secureStorage = {
  getItem: async (name: string) => {
    const value = await SecureStore.getItemAsync(name);
    return value ?? null;
  },
  setItem: async (name: string, value: string) => {
    await SecureStore.setItemAsync(name, value);
  },
  removeItem: async (name: string) => {
    await SecureStore.deleteItemAsync(name);
  },
};

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasError: boolean;
  error: string | null;

  setUser: (user: User) => void;
  setToken: (token: string) => Promise<void>;
  login: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  setLoading: (isLoading: boolean) => void;
  setError: (hasError: boolean, message?: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      hasError: false,
      error: null,

      setUser: (user: User) => set({ user, hasError: false, error: null }),

      setToken: async (token: string) => {
        await SecureStore.setItemAsync(TOKEN_KEY, token);
        set({ token, isAuthenticated: true });
      },

      login: async (user: User, token: string) => {
        await SecureStore.setItemAsync(TOKEN_KEY, token);
        set({ user, token, isAuthenticated: true, hasError: false, error: null });
      },

      logout: async () => {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          hasError: false,
          error: null,
        });
      },

      setLoading: (isLoading: boolean) => set({ isLoading }),

      setError: (hasError: boolean, message?: string) =>
        set({ hasError, error: message || null }),

      clearAuth: () => set({
        user: null,
        token: null,
        isAuthenticated: false,
        hasError: false,
        error: null,
      }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => secureStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export async function getStoredToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function clearStoredToken(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export function getUserRole(): UserRoleType | null {
  const state = useAuthStore.getState();
  return state.user?.role || null;
}

export function isInvestor(): boolean {
  return useAuthStore.getState().user?.role === 'INVESTOR';
}

export function isContractor(): boolean {
  return useAuthStore.getState().user?.role === 'CONTRACTOR';
}

export function isAdmin(): boolean {
  return useAuthStore.getState().user?.role === 'ADMIN';
}
