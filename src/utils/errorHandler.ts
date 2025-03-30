import { toast } from 'sonner';
import axios from 'axios';

// Define a type for Axios error shape
interface AxiosErrorResponse {
  response?: {
    status?: number;
    data?: {
      message?: string;
      error?: string;
    };
  };
  request?: any;
  message?: string;
}

// Helper function to check if an error is an Axios error
function isAxiosError(error: any): error is AxiosErrorResponse {
  return error && 
         (error.isAxiosError === true || 
         error.response !== undefined || 
         error.request !== undefined);
}

export const handleApiError = (error: any, onAuthError?: () => void) => {
  if (isAxiosError(error)) {
    // Handle Axios errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const status = error.response.status;
      const errorMessage = error.response.data?.message || 
                          error.response.data?.error || 
                          'An error occurred with the server response';
      
      // Handle specific status codes
      if (status === 401) {
        toast.error('Authentication error: Please log in again');
        // Call the auth error callback if provided
        if (onAuthError) {
          onAuthError();
        }
      } else if (status === 403) {
        toast.error('You do not have permission to perform this action');
      } else if (status === 404) {
        toast.error('Resource not found');
      } else if (status === 429) {
        toast.error('Too many requests. Please try again later');
      } else if ((status ?? 0) >= 500) {
        toast.error('Server error. Please try again later');
      } else {
        toast.error(errorMessage);
      }
    } else if (error.request) {
      // The request was made but no response was received
      toast.error('No response received from server. Please check your connection');
    } else {
      // Something happened in setting up the request
      toast.error(`Error: ${error.message}`);
    }
  } else {
    // Handle non-Axios errors
    const errorMessage = error?.message || 'An unknown error occurred';
    toast.error(errorMessage);
  }
  
  // Log the error for debugging
  console.error('API Error:', error);
};

/**
 * Sets up global axios interceptors for request and response
 * @param {Function} onAuthError - Optional callback function to be called on authentication errors
 * @param {import('axios').AxiosInstance} axiosInstance - The axios instance to set up interceptors for
 * @returns {void}
 */
export const setupInterceptors = (onAuthError?: () => void, axiosInstance = axios) => {
  // Request interceptor
  axiosInstance.interceptors.request.use(
    (config) => {
      // You can modify the request config here
      // For example, add authentication token
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      // Handle request errors
      return Promise.reject(error);
    }
  );

  // Response interceptor
  axiosInstance.interceptors.response.use(
    (response) => {
      // Any status code within the range of 2xx causes this function to trigger
      return response;
    },
    (error) => {
      // Any status codes outside the range of 2xx cause this function to trigger
      handleApiError(error, onAuthError);
      return Promise.reject(error);
    }
  );
};