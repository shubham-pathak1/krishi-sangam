import axios, { type AxiosInstance, AxiosError, type InternalAxiosRequestConfig } from 'axios';

// Base API URL
// Base API URL
const BASE_URL = '/api/v1';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Important: Send cookies with requests
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // Set timeout to 15s to prevent infinite loading
});

// Request Interceptor - Add access token to headers
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Access token is sent via cookies, but we can also add it to headers if needed
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor - Handle token refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If 401 error and not already retried, try to refresh token
    // IMPORTANT: Do not try to refresh if the failed request was already for refresh-token
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/refresh-token')) {
      originalRequest._retry = true;

      try {
        // Call refresh token endpoint
        await api.post('/users/refresh-token');

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        // Attempt to hit logout to clear cookies (using bare axios to avoid interceptor loop)
        try {
          await axios.post(`${BASE_URL}/users/logout`);
        } catch (e) {
          // ignore
        }
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Error Handler Helper
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message || error.message;
    return message;
  }
  return 'An unexpected error occurred';
};

export default api;