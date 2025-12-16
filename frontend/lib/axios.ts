import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_HOSTED_API_URL || "http://localhost:5555/api",
});

api.interceptors.request.use((config) => {
  // ✅ SSR SAFETY CHECK
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export default api;
