import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { loginUser } from "../services/auth";
import { logout as logoutService } from "../services/auth";
import { LoginResponse } from "../types/index";
import { setupInterceptors } from "../utils/errorHandler";
import { User } from "../types/index";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (credentials: { username: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: 'ADMIN' | 'USER' | 'MANAGER') => boolean;
}

const LOCAL_STORAGE_KEY = 'auth_user';
const TOKEN_KEY = 'user_token';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const savedUser = localStorage.getItem(LOCAL_STORAGE_KEY);
    const token = localStorage.getItem(TOKEN_KEY);
    return {
      user: savedUser ? JSON.parse(savedUser) : null,
      isAuthenticated: !!(savedUser && token),
      isLoading: false
    };
  });

  useEffect(() => {
    if (authState.user) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(authState.user));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      localStorage.removeItem(TOKEN_KEY);
    }
  }, [authState.user]);

  const login = async (credentials: { username: string; password: string }) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const response: LoginResponse = await loginUser(credentials);
      
      // Save token
      if (response.token) {
        localStorage.setItem(TOKEN_KEY, response.token);
      }

      const userWithDefaults: User = {
        ...response.user,
        role: response.user.role || 'USER',
        permissions: response.user.permissions || [],
        isActive: true,
        lastLogin: new Date()
      };
      
      setAuthState({
        user: userWithDefaults,
        isAuthenticated: true,
        isLoading: false
      });
      
      // Update to pass logout as a callback function
      setupInterceptors(logout);
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      // Call the logout service
      await logoutService();
      
      // Clear auth state
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false
      });
  
      // Force navigation to home page
      window.location.href = '/'; // This will force a full page reload
    } catch (error) {
      console.error('Logout failed:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!authState.user) return false;
    return authState.user.permissions.includes(permission) || 
           authState.user.role === 'ADMIN';
  };

  const hasRole = (role: 'ADMIN' | 'USER' | 'MANAGER'): boolean => {
    return authState.user?.role === role;
  };

  const contextValue: AuthContextType = {
    ...authState,
    login,
    logout,
    hasPermission,
    hasRole
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};