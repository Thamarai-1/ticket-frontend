/**
 * axiosInstance.js
 * Centralized, pre-configured Axios client instance.
 * Handles baseURL resolution, default headers, request/response interceptors,
 * and unified error extraction.
 */
import axios from 'axios';

// Resolve base URL from Vite environment variables (falls back to '' for Vite dev proxy / Nginx)
const rawBaseUrl = import.meta.env.VITE_API_URL || '';
const baseURL = rawBaseUrl.endsWith('/') ? rawBaseUrl.slice(0, -1) : rawBaseUrl;

export const axiosInstance = axios.create({
  baseURL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request Interceptor: attach authorization and client metadata
axiosInstance.interceptors.request.use(
  (config) => {
    // Attach JWT token if present in localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: telemetry and logging in development
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      if (import.meta.env.DEV) {
        console.warn(`[Axios API Error ${status}]:`, error.config?.url, data);
      }
    } else if (error.request) {
      console.error('[Axios Network Error]: No response received from server', error.request);
    } else {
      console.error('[Axios Configuration Error]:', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
