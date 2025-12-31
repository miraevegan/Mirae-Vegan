"use client";

import { useState } from "react";
import { useToast } from "@/context/ToastContext";
import api from "@/lib/axios";
import { AxiosError } from "axios";

export default function ChangePassword() {
  const { showToast } = useToast();

  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const [touched, setTouched] = useState({
    current: false,
    next: false,
    confirm: false,
  });

  const isValid =
    current.length > 0 &&
    next.length >= 6 &&
    next === confirm;

  const errors = {
    current: touched.current && current.length === 0 ? "Current password is required" : "",
    next:
      touched.next && next.length < 6
        ? "Password must be at least 6 characters"
        : "",
    confirm:
      touched.confirm && confirm !== next
        ? "Passwords do not match"
        : "",
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid || loading) return;

    setLoading(true);

    try {
      await api.post("/auth/change-password", {
        currentPassword: current,
        newPassword: next,
      });

      showToast("Password updated successfully 🎉", "success");

      setCurrent("");
      setNext("");
      setConfirm("");
      setTouched({ current: false, next: false, confirm: false });
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      showToast(
        err.response?.data?.message ?? "Failed to update password",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg bg-background font-body">
      <h2 className="text-2xl font-semibold text-text-primary">
        Security
      </h2>
      <p className="mb-8 text-sm text-text-secondary">
        Change your account password
      </p>

      <form onSubmit={submit} className="space-y-6" noValidate>
        {/* Current Password */}
        <InputWithError
          id="current-password"
          label="Current password"
          type="password"
          value={current}
          onChange={e => setCurrent(e.target.value)}
          onBlur={() => setTouched(t => ({ ...t, current: true }))}
          placeholder="Current password"
          error={errors.current}
          disabled={loading}
          autoComplete="current-password"
          required
        />

        {/* New Password */}
        <InputWithError
          id="new-password"
          label="New password (min 6 chars)"
          type="password"
          value={next}
          onChange={e => setNext(e.target.value)}
          onBlur={() => setTouched(t => ({ ...t, next: true }))}
          placeholder="New password"
          error={errors.next}
          disabled={loading}
          autoComplete="new-password"
          minLength={6}
          required
        />

        {/* Confirm Password */}
        <InputWithError
          id="confirm-password"
          label="Confirm new password"
          type="password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          onBlur={() => setTouched(t => ({ ...t, confirm: true }))}
          placeholder="Confirm new password"
          error={errors.confirm}
          disabled={loading}
          autoComplete="new-password"
          minLength={6}
          required
        />

        <button
          type="submit"
          disabled={!isValid || loading}
          className={`
            w-full py-3 text-white text-sm font-semibold transition
            ${loading
              ? "bg-brand-primary/70 cursor-wait"
              : isValid
                ? "bg-brand-primary hover:opacity-90"
                : "bg-disabled cursor-not-allowed text-text-disabled"
            }
          `}
          aria-busy={loading}
        >
          {loading ? "Updating password…" : "Update password"}
        </button>
      </form>
    </div>
  );
}

type InputWithErrorProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

function InputWithError({
  id,
  label,
  error,
  ...props
}: InputWithErrorProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block mb-1 text-sm font-medium text-text-secondary"
      >
        {label}
      </label>
      <input
        id={id}
        {...props}
        className={`
          w-full px-4 py-3 text-sm border border-border outline-none
          focus:ring-1 focus:ring-brand-primary
          disabled:cursor-not-allowed disabled:bg-surface disabled:text-text-disabled
          transition
          ${error ? "border-error" : ""}
        `}
      />
      {error && <p className="mt-1 text-xs text-error">{error}</p>}
    </div>
  );
}
