"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import NavbarDefault from "@/components/layout/NavbarDefault";
import { useAuth } from "@/context/AuthContext";
import type { AxiosError } from "axios";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      router.push("/");
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(
        axiosError.response?.data?.message ||
          "Unable to login. Please try again."
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
            Welcome back
          </h1>

          <p className="mb-8 text-sm text-text-secondary">
            Sign in to your Miraé account
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

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full px-4 py-3 text-sm border outline-none border-border focus:ring-1 focus:ring-brand-primary"
            />

            <Link
              href="/forgot-password"
              className="block text-sm text-right text-text-secondary hover:underline"
            >
              Forgot Password?
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-sm tracking-widest text-white transition bg-brand-primary hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "LOGGING IN..." : "LOGIN"}
            </button>

            <Link
              href="/register"
              className="block text-sm text-center text-text-secondary hover:underline"
            >
              Don&apos;t have an account?{" "}
              <span className="font-semibold text-brand-primary">
                Register
              </span>
            </Link>
          </form>
        </div>
      </div>
    </>
  );
}
