"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { authService } from "@/services/auth.service";
import type { User } from "@/types/user";
import { useToast } from "@/context/ToastContext";
import axios from "axios";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  // -------------------------
  // FETCH PROFILE
  // -------------------------
  const fetchProfile = useCallback(async () => {
    try {
      const res = await authService.getProfile();
      setUser(res.user);
    } catch {
      localStorage.removeItem("token");
      setUser(null);
      showToast("Session expired. Please login again.", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // -------------------------
  // INIT AUTH
  // -------------------------
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [fetchProfile]);

  // -------------------------
  // LOGIN
  // -------------------------
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      await authService.login({ email, password });
      await fetchProfile();
      showToast("Logged in successfully 🎉", "success");
    } catch (err: unknown) {
      let message = "Login failed";

      if (axios.isAxiosError(err)) {
        message = err.response?.data?.message ?? message;
      }

      showToast(message, "error");
      setLoading(false);
      throw err;
    }
  };

  // -------------------------
  // LOGOUT
  // -------------------------
  const logout = () => {
    authService.logout();
    setUser(null);
    showToast("Logged out successfully", "info");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        refreshProfile: fetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
};
