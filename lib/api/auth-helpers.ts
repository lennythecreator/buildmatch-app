import { tokenStorage } from './token-storage';

const TOKEN_KEY = 'auth_token';

export const auth = {
  getToken: () => tokenStorage.get(),
  setToken: (token: string) => tokenStorage.set(token),
  removeToken: () => tokenStorage.remove(),
};
