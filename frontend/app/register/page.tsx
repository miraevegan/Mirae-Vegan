"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import NavbarDefault from "@/components/layout/NavbarDefault";
import { authService } from "@/services/auth.service";
import type { AxiosError } from "axios";

export default function RegisterPage() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await authService.register({
                name,
                email,
                password,
            });

            // ✅ Redirect to OTP verification
            router.push(`/verify-email?email=${encodeURIComponent(email)}`);
        } catch (err: unknown) {
            if (err instanceof Error) {
                const axiosError = err as AxiosError<{ message?: string }>;
                setError(
                    axiosError.response?.data?.message || "Registration failed"
                );
            } else {
                setError("Registration failed");
            }
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
                        Create account
                    </h1>
                    <p className="mb-8 text-sm text-text-secondary">
                        Join Miraé and start shopping
                    </p>

                    {error && (
                        <p className="mb-4 text-sm text-red-600">{error}</p>
                    )}

                    <form onSubmit={submit} className="space-y-5">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Full Name"
                            className="w-full px-4 py-3 text-sm border outline-none border-border focus:ring-1 focus:ring-brand-primary"
                            required
                        />

                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            className="w-full px-4 py-3 text-sm border outline-none border-border focus:ring-1 focus:ring-brand-primary"
                            required
                        />

                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="w-full px-4 py-3 text-sm border outline-none border-border focus:ring-1 focus:ring-brand-primary"
                            required
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 text-sm tracking-widest text-white transition bg-brand-primary hover:opacity-90 disabled:opacity-50"
                        >
                            {loading ? "CREATING ACCOUNT..." : "REGISTER"}
                        </button>

                        <Link
                            href="/login"
                            className="block text-sm text-center text-text-secondary hover:underline"
                        >
                            Already have an account?{" "}
                            <span className="font-semibold text-brand-primary">Login</span>
                        </Link>
                    </form>
                </div>
            </div>
        </>
    );
}
