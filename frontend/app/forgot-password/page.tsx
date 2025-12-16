"use client";

import { useState } from "react";
import Link from "next/link";
import NavbarDefault from "@/components/layout/NavbarDefault";
import api from "@/lib/axios";
import type { AxiosError } from "axios";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await api.post("/auth/forgot-password", { email });
      setSent(true);
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(
        axiosError.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavbarDefault />

      <div className="flex items-center justify-center py-40 bg-surface">
        <div className="w-full max-w-xl p-10 border shadow-xl border-border bg-background">
          <h1 className="mb-2 text-3xl font-medium tracking-wide font-brand">
            Forgot password
          </h1>

          {!sent ? (
            <>
              <p className="mb-8 text-sm text-text-secondary">
                Enter your email and we’ll send you a one-time password (OTP)
                to reset your password.
              </p>

              {error && (
                <p className="p-3 mb-4 text-sm text-red-600 border border-red-200 bg-red-50">
                  {error}
                </p>
              )}

              <form onSubmit={submit} className="space-y-5">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                  className="w-full px-4 py-3 text-sm border outline-none border-border focus:ring-1 focus:ring-brand-primary"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 text-sm tracking-widest text-white transition bg-brand-primary hover:opacity-90 disabled:opacity-60"
                >
                  {loading ? "SENDING..." : "SEND OTP"}
                </button>

                <Link
                  href="/login"
                  className="block text-sm text-center text-text-secondary hover:underline"
                >
                  Back to login
                </Link>
              </form>
            </>
          ) : (
            <>
              <p className="mb-8 text-sm text-text-secondary">
                If an account exists for{" "}
                <strong>{email}</strong>, you’ll receive an OTP shortly.
              </p>

              <Link
                href="/reset-password"
                className="block text-sm text-center text-brand-primary hover:underline"
              >
                Continue to reset password
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
