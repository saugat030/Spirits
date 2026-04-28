// HELLO FELLOW DEVELOPER!! THESE COMMENTS ARE NOT WRITTEN BY AI
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
    // save the blueprint of the original request from the error.config
    const originalRequest = error.config;
    // check if the error status is 401 and not already tried to retry this request (prevent infinite loop)
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      // dont intercept auth related routes like login or isAuth or refresh
      if (
        originalRequest.url.includes('/auth/login') || 
        originalRequest.url.includes('/auth/isAuth') ||
        originalRequest.url.includes('/auth/refresh')
      ) {
        return Promise.reject(error);
      }
      // custom property_retry to mark our request
      originalRequest._retry = true;

      try {
        // fresh axios.post use gareko instead of the existing instance s it doesnot accidently catches its own refresh req.
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        if (data.success) {
          // if refresh successful, replay the original failed request
          return API(originalRequest);
        }
      } catch (refreshError) {
        // if refresh fails use true logout
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
