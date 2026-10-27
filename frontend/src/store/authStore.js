import { create } from 'zustand';

// Default to the local SKYNZ backend when no frontend .env exists.
// The frontend may run on port 3001 while the API runs on port 3000.
const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:3000').replace(/\/$/, '');

async function readAuthResponse(response, fallback) {
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body.error || fallback);
  }
  return body;
}

function friendlyNetworkError(error) {
  return error instanceof TypeError && /fetch|network/i.test(error.message)
    ? new Error('Cannot connect to the SKYNZ backend at ' + API_URL)
    : error;
}

const useAuthStore = create((set) => ({
  token: null,
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
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await readAuthResponse(response, 'Login failed');
      set({ token: data.token, user: data.creator, isLoading: false });
      localStorage.setItem('skynz_token', data.token);
      return data;
    } catch (error) {
      const readableError = friendlyNetworkError(error);
      set({ error: readableError.message, isLoading: false });
      throw readableError;
    }
  },

  register: async (email, password, name, handle) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, handle })
      });

      const data = await readAuthResponse(response, 'Registration failed');
      set({ token: data.token, user: data.creator, isLoading: false });
      localStorage.setItem('skynz_token', data.token);
      return data;
    } catch (error) {
      const readableError = friendlyNetworkError(error);
      set({ error: readableError.message, isLoading: false });
      throw readableError;
    }
  }
}));

export default useAuthStore;
