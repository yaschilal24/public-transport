import axios from 'axios';
import Constants from 'expo-constants';
import { authStorage } from '../storage/authStorage'; // NEW IMPORT

const baseURL =
  process.env.EXPO_PUBLIC_API_URL ??
  (Constants.expoConfig?.extra?.apiBaseUrl as string) ??
  'http://localhost:4000/api/v1';

export const api = axios.create({ baseURL, timeout: 15_000 });

api.interceptors.request.use(async (config) => {
  // Use authStorage instead of SecureStore
  const token = await authStorage.getItemAsync('accessToken').catch(() => null);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    if (error.response?.status === 401) {
      await authStorage.deleteItemAsync('accessToken').catch(() => {});
      await authStorage.deleteItemAsync('refreshToken').catch(() => {});
    }
    return Promise.reject(error);
  }
);