import { create } from 'zustand';
import axiosClient from '../api/axiosClient';

export const useAuthStore = create((set) => ({
  user: null,
  loading: true,

  initAuth: async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await axiosClient.get('/api/user/profile');
        set({ user: { username: response.data.replace('Merhaba, ', '') }, loading: false });
      } catch (error) {
        console.error("Token invalid or expired", error);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        set({ user: null, loading: false });
      }
    } else {
      set({ loading: false });
    }
  },

  login: async (username, password) => {
    const response = await axiosClient.post('/api/auth/login', { username, password });
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
      if (response.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.refreshToken);
      }
      set({ user: { username } });
      return true;
    }
    return false;
  },

  register: async (username, password, email) => {
    const response = await axiosClient.post('/api/auth/register', { username, password, email });
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('username');
    set({ user: null });
  }
}));
