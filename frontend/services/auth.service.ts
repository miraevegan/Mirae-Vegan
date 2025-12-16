import api from "@/lib/axios";

export const authService = {
  // --------------------
  // LOGIN
  // --------------------
  login: async (data: { email: string; password: string }) => {
    const res = await api.post("/auth/login", data);

    // Store token only after successful login
    if (res.data?.token) {
      localStorage.setItem("token", res.data.token);
    }

    return res.data;
  },

  // --------------------
  // REGISTER (NO AUTO LOGIN)
  // --------------------
  register: async (data: {
    name: string;
    email: string;
    password: string;
  }) => {
    // Register should ONLY create account & send OTP
    const res = await api.post("/auth/register", data);
    return res.data;
  },

  // --------------------
  // VERIFY EMAIL (OTP)
  // --------------------
  verifyEmail: async (data: { email: string; otp: string }) => {
    const res = await api.post("/auth/verify-email", data);
    return res.data;
  },

  // --------------------
  // FORGOT PASSWORD
  // --------------------
  forgotPassword: async (email: string) => {
    const res = await api.post("/auth/forgot-password", { email });
    return res.data;
  },

  // --------------------
  // RESET PASSWORD
  // --------------------
  resetPassword: async (data: {
    email: string;
    otp: string;
    newPassword: string;
  }) => {
    const res = await api.post("/auth/reset-password", data);
    return res.data;
  },

  // --------------------
  // CHANGE PASSWORD
  // --------------------
  changePassword: async (data: { currentPassword: string; newPassword: string }) => {
    const res = await api.post("/auth/change-password", data);
    return res.data;
  },

  // --------------------
  // GET PROFILE
  // --------------------
  getProfile: async () => {
    const res = await api.get("/auth/profile");
    return res.data;
  },

  // --------------------
  // LOGOUT (frontend only)
  // --------------------
  logout: () => {
    localStorage.removeItem("token");
  },
};
