"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import NavbarDefault from "@/components/layout/NavbarDefault";
import { authService } from "@/services/auth.service";

export default function ResetPassword() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    otp: "",
    newPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.email || !form.otp || !form.newPassword) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword(form);
      alert("Password updated successfully. Please login.");
      router.push("/login");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      alert(err.response?.data?.message ?? (error instanceof Error ? error.message : "Failed to reset password"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavbarDefault />
      <div className="flex items-center justify-center py-40 bg-surface">
        <div className="w-full max-w-xl p-10 border rounded-md shadow-xl border-border bg-background">
          <h1 className="mb-2 text-3xl font-medium tracking-wide font-brand">
            Reset Password
          </h1>
          <p className="mb-8 text-sm text-text-secondary">
            Enter your email, OTP, and new password to reset your password.
          </p>

          <form onSubmit={submit} className="space-y-5">
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Email"
              className="w-full px-4 py-3 text-sm border rounded outline-none border-border focus:ring-1 focus:ring-brand-primary"
              required
            />
            <input
              type="text"
              value={form.otp}
              onChange={(e) => setForm({ ...form, otp: e.target.value })}
              placeholder="OTP"
              className="w-full px-4 py-3 text-sm border rounded outline-none border-border focus:ring-1 focus:ring-brand-primary"
              required
            />
            <input
              type="password"
              value={form.newPassword}
              onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
              placeholder="New Password"
              className="w-full px-4 py-3 text-sm border rounded outline-none border-border focus:ring-1 focus:ring-brand-primary"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-sm tracking-widest text-white transition rounded bg-brand-primary hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
