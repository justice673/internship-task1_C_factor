// src/services/auth.ts
import axios from 'axios';
import { LoginResponse } from "../types/index";

// Define custom interfaces for Axios types since they're not being imported correctly
interface CustomAxiosError {
  response?: {
    status: number;
    data: any;
    headers: Record<string, string>;
  };
  request?: any;
  message: string;
  config?: any;
  isAxiosError?: boolean;
}

// Define the DummyJSON API response structure
interface DummyJSONLoginResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  token: string;
}

// Use DummyJSON API for authentication
const API_URL = 'https://dummyjson.com';

// Use the same token key as in AuthContext
const TOKEN_KEY = 'user_token';

// Export the loginUser function as expected by AuthContext.tsx
export const loginUser = async (credentials: { username: string; password: string }): Promise<LoginResponse> => {
  try {
    // DummyJSON expects username and password
    const response = await axios.post<DummyJSONLoginResponse>(
      `${API_URL}/auth/login`, 
      credentials
    );
    
    // Transform the DummyJSON response to match our expected LoginResponse format
    const loginResponse: LoginResponse = {
      user: {
        id: response.data.id,
        username: response.data.username,
        email: response.data.email,
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        // Add default values for fields not provided by DummyJSON
        role: 'USER', // Default role
        permissions: ['view_content'], // Default permissions
        isActive: true,
        lastLogin: new Date()
      },
      token: response.data.token
    };
    
    // Store token in localStorage (though this is redundant as AuthContext will do it too)
    localStorage.setItem(TOKEN_KEY, response.data.token);
    
    return loginResponse;
  } catch (error) {
    const err = error as CustomAxiosError;
    if (err.response && err.response.status === 401) {
      throw new Error('Invalid credentials. Please check your username and password.');
    }
    throw new Error(err.message || 'An error occurred during login');
  }
};

// Export the logout function as expected by AuthContext.tsx
export const logout = async (): Promise<void> => {
  // Remove token from localStorage using the same key as AuthContext
  localStorage.removeItem(TOKEN_KEY);
  
  // DummyJSON doesn't have a logout endpoint, so we just handle it client-side
  console.log('User logged out');
};

export const register = async (userData: any): Promise<any> => {
  try {
    const response = await axios.post(`${API_URL}/users/add`, userData);
    return {
      user: {
        ...(response.data as Record<string, any>),
        role: 'USER',
        permissions: ['view_content'],
        isActive: true,
        lastLogin: new Date()
      }
    };
  } catch (error) {
    const err = error as CustomAxiosError;
    throw new Error(err.message || 'Registration failed');
  }
};

export const forgotPassword = async (): Promise<any> => {
  // DummyJSON doesn't have a forgot password endpoint
  // This is a mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ message: 'If an account with that email exists, we have sent password reset instructions.' });
    }, 1000);
  });
  
};

export const resetPassword = async (token: string, newPassword: string): Promise<any> => {
  // DummyJSON doesn't have a reset password endpoint
  // This is a mock implementation
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (token && newPassword) {
        resolve({ message: 'Password has been reset successfully.' });
      } else {
        reject(new Error('Invalid token or password'));
      }
    }, 1000);
  });
};

export const isAuthenticated = (): boolean => {
  // Use the same token key as in AuthContext
  return !!localStorage.getItem(TOKEN_KEY);
};

export const getToken = (): string | null => {
  // Use the same token key as in AuthContext
  return localStorage.getItem(TOKEN_KEY);
};

// You can also still export the entire service as an object if needed elsewhere
export const authService = {
  login: loginUser,
  logout,
  register,
  forgotPassword,
  resetPassword,
  isAuthenticated,
  getToken
};