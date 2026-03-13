import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_HOSTED_API_URL,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {

    const publicRoutes = [
      "/reviews/feedback",
      "/products",
      "/reviews",
    ];

    const isPublic = publicRoutes.some((route) =>
      config.url?.startsWith(route)
    );

    if (!isPublic) {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  }

  return config;
});

export default api;