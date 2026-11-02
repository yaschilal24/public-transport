import { create } from 'zustand';
import { api } from '../services/api';
import { authStorage } from '../storage/authStorage'; // NEW IMPORT

interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  loadMe: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (u: AuthUser | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  setUser: (user) => set({ user }),
  loadMe: async () => {
    set({ loading: true });
    try {
      const res = await api.get('/auth/me');
      set({ user: res.data.data });
    } catch {
      set({ user: null });
    } finally {
      set({ loading: false });
    }
  },
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { user, accessToken, refreshToken } = res.data.data;
    
    // Use authStorage instead of SecureStore
    await authStorage.setItemAsync('accessToken', accessToken);
    await authStorage.setItemAsync('refreshToken', refreshToken);
    
    set({ user });
  },
  logout: async () => {
    await authStorage.deleteItemAsync('accessToken').catch(() => {});
    await authStorage.deleteItemAsync('refreshToken').catch(() => {});
    set({ user: null });
  },
}));