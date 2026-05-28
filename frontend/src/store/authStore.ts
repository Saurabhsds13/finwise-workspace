import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),

  setLoading: (isLoading) => set({ isLoading }),

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    set({ user: null, isAuthenticated: false, isLoading: false });
  },

  initialize: () => {
    const token = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      try {
        const user = JSON.parse(storedUser);
        set({ user, isAuthenticated: true, isLoading: false });
      } catch {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } else {
      set({ isLoading: false });
    }
  },
}));
