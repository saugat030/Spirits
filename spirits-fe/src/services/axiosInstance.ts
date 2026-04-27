import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

if (!import.meta.env.VITE_API_BASE_URL) {
  throw new Error("Missing VITE_API_BASE_URL environment variable");
}

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    // Check if the error status is 401 Unauthorized
    // and that we haven't already tried to retry this request (prevent infinite loops)
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      // Don't intercept auth-related routes like login or isAuth or refresh
      if (
        originalRequest.url.includes('/auth/login') || 
        originalRequest.url.includes('/auth/isAuth') ||
        originalRequest.url.includes('/auth/refresh')
      ) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        // Try to hit the refresh endpoint
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        if (data.success) {
          // If refresh successful, replay the original failed request
          return API(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, then we truly log the user out
        const logout = useAuthStore.getState().logout;
        logout();
        
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default API;
