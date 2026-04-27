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
  (error) => {
    // check if the error status is 401 backend handles the refresh so only simple redirect needed here. 
    if (error.response && error.response.status === 401) {
      const logout = useAuthStore.getState().logout;
      logout();
      // use window.location as react router navigation is not directly available outside components
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default API;
