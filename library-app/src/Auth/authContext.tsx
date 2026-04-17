import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../services/authService';

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  userRole: string | null;
  hasRole: (role: string) => boolean;
  login: (token: string, refreshToken: string) => void;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Helper function to decode JWT and extract role
const decodeToken = (token: string): { role?: string } | null => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch (error) {
    // console.error('Failed to decode token:', error);
    return null;
  }
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Initialize token synchronously from localStorage to avoid race conditions
  const [token, setToken] = useState<string | null>(() => {
    const storedToken = localStorage.getItem('jwt_token');
    return storedToken;
  });

  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      // Prioritize role from backend response (localStorage) over JWT decoding
      const backendRole = localStorage.getItem('user_role');
      if (backendRole) {
        setUserRole(backendRole);
      } else {
        const decoded = decodeToken(token);
        // Default to USER if no role is present (for backward compatibility)
        const role = decoded?.role || 'USER';
        setUserRole(role);
      }
    } else {
      setUserRole(null);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('jwt_token', token);
    } else {
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('refresh_token');
    }
  }, [token]);

  const login = (newToken: string, refreshToken?: string, role?: string) => {
    setToken(newToken);
    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken);
    }
    // Store role separately to avoid JWT decoding issues
    if (role) {
      localStorage.setItem('user_role', role);
    }
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      try {
        await authService.logout(refreshToken);
      } catch (error) {
        // console.error('Logout error:', error);
      }
    }
    setToken(null);
    localStorage.removeItem('user_role');
  };

  const refreshTokenFunc = async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    try {
      const response = await authService.refreshToken(refreshToken);
      login(response.accessToken, response.refreshToken);
    } catch (error) {
      logout();
      throw error;
    }
  };

  const hasRole = (role: string): boolean => {
    return userRole === role;
  };

  const value: AuthContextType = {
    token,
    isAuthenticated: !!token,
    userRole,
    hasRole,
    login,
    logout,
    refreshToken: refreshTokenFunc,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
