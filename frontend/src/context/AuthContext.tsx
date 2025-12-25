import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from 'react';
import api, { handleApiError } from '../services/api';
import type {
  User,
  AuthContextType,
  LoginRequest,
  RegisterRequest,
  ApiResponse,
  AuthResponse
} from '../types/auth.types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuthRan = useRef(false);

  // Check if user is authenticated on mount
  useEffect(() => {
    if (!checkAuthRan.current) {
      checkAuthRan.current = true;
      checkAuth();
    }
  }, []);

  const checkAuth = async () => {
    try {
      // Try to refresh token to check if user is authenticated
      const response = await api.post<ApiResponse<AuthResponse>>('/users/refresh-token');
      if (response.data.success) {
        setUser(response.data.data.user);
        localStorage.setItem('accessToken', response.data.data.accessToken);
      }
    } catch (error) {
      // If refresh fails, user is not authenticated
      setUser(null);
      localStorage.removeItem('accessToken');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      const response = await api.post<ApiResponse<User>>('/users/register', data);

      if (response.data.success) {
        // After registration, user needs to login
        // Or you can auto-login here by calling login
        return;
      }
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  };

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>('/users/login', credentials);

      if (response.data.success) {
        setUser(response.data.data.user);
        localStorage.setItem('accessToken', response.data.data.accessToken);
      }
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  };

  const logout = async () => {
    try {
      await api.post('/users/logout');
      setUser(null);
      localStorage.removeItem('accessToken');
    } catch (error) {
      // Even if logout fails, clear local state
      setUser(null);
      localStorage.removeItem('accessToken');
      throw new Error(handleApiError(error));
    }
  };

  const refreshToken = async () => {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>('/users/refresh-token');
      if (response.data.success) {
        setUser(response.data.data.user);
        localStorage.setItem('accessToken', response.data.data.accessToken);
      }
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};