import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export const tokenStorage = {
  // Access token
  get: () => SecureStore.getItemAsync(ACCESS_TOKEN_KEY),
  set: (token: string) => SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token),
  remove: () => SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),

  // Refresh token
  getRefresh: () => SecureStore.getItemAsync(REFRESH_TOKEN_KEY),
  setRefresh: (token: string) => SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token),
  removeRefresh: () => SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),

  // Convenience: replace both tokens together
  setTokens: async (accessToken: string, refreshToken?: string) => {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
    if (refreshToken) {
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
    }
  },

  clearTokens: async () => {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  },
};
