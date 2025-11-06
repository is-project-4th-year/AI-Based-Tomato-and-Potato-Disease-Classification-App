import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authService, handleApiError } from '../services/api';
import type { User, AuthContextType, RegisterFormData } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      const storedToken = localStorage.getItem('auth_token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
      setIsLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await authService.login({ email, password });

      const { user: userData, token: authToken } = response.data;

      // Store in localStorage
      localStorage.setItem('auth_token', authToken);
      localStorage.setItem('user', JSON.stringify(userData));

      // Update state
      setToken(authToken);
      setUser(userData);
    } catch (error) {
      throw new Error(handleApiError(error));
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterFormData): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await authService.register(data);

      const { user: userData, token: authToken } = response.data;

      // Store in localStorage
      localStorage.setItem('auth_token', authToken);
      localStorage.setItem('user', JSON.stringify(userData));

      // Update state
      setToken(authToken);
      setUser(userData);
    } catch (error) {
      throw new Error(handleApiError(error));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    // Call logout endpoint (don't wait for response)
    authService.logout().catch(() => {
      // Ignore errors, we're logging out anyway
    });

    // Clear localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');

    // Clear state
    setToken(null);
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated: !!token && !!user,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
