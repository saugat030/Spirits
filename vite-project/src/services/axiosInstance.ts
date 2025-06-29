import axios from "axios";

if (!import.meta.env.VITE_API_BASE_URL) {
  throw new Error("Missing VITE_API_BASE_URL environment variable");
}

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;
