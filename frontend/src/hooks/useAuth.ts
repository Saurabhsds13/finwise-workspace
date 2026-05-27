import { useAuthStore } from '../store/authStore';
import { authService, LoginRequest, RegisterRequest } from '../services/authService';

export function useAuth() {
  const { user, isAuthenticated, isLoading, setUser, setLoading, logout } = useAuthStore();

  const login = async (data: LoginRequest) => {
    setLoading(true);
    try {
      const response = await authService.login(data);
      localStorage.setItem('accessToken', response.data.token);
      setUser(response.data.user);
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterRequest) => {
    setLoading(true);
    try {
      const response = await authService.register(data);
      localStorage.setItem('accessToken', response.data.token);
      setUser(response.data.user);
    } finally {
      setLoading(false);
    }
  };

  return { user, isAuthenticated, isLoading, login, register, logout };
}
