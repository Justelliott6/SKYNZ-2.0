import { create } from 'zustand';

const useAuthStore = create((set) => ({
  token: localStorage.getItem('skynz_token'),
  user: null,
  isLoading: false,
  error: null,

  setToken: (token) => {
    if (token) {
      localStorage.setItem('skynz_token', token);
    } else {
      localStorage.removeItem('skynz_token');
    }
    set({ token });
  },

  setUser: (user) => set({ user }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  logout: () => {
    localStorage.removeItem('skynz_token');
    set({ token: null, user: null });
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) throw new Error('Login failed');

      const data = await response.json();
      set({ token: data.token, user: data.creator, isLoading: false });
      localStorage.setItem('skynz_token', data.token);
      return data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  register: async (email, password, name, handle) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, handle })
      });

      if (!response.ok) throw new Error('Registration failed');

      const data = await response.json();
      set({ token: data.token, user: data.creator, isLoading: false });
      localStorage.setItem('skynz_token', data.token);
      return data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  }
}));

export default useAuthStore;
