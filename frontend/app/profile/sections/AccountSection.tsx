"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axios";

export default function AccountSection() {
  const { user, refreshProfile } = useAuth();

  const [name, setName] = useState(user?.name ?? "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user?.name]);

  const isDirty = name.trim() !== user?.name;

  async function save() {
    if (!isDirty || saving) return;

    try {
      setSaving(true);
      setMessage(null);
      setError(null);

      await api.put("/auth/profile", { name: name.trim() });
      await refreshProfile();

      setMessage("Profile updated successfully");
    } catch (err) {
      console.error(err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-lg bg-background font-body">
      <h2 className="text-2xl font-semibold text-text-primary">Account</h2>
      <p className="mb-8 text-sm text-text-secondary">
        Update your personal information
      </p>

      <form
        onSubmit={e => {
          e.preventDefault();
          save();
        }}
        className="space-y-4"
        noValidate
      >
        <Input
          id="full-name"
          label="Full name"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Your full name"
          disabled={saving}
          required
        />

        <Input
          id="email"
          label="Email"
          value={user?.email ?? ""}
          disabled
          placeholder="Your email address"
        />

        {/* Feedback Messages */}
        <div className="min-h-6">
          {message && (
            <p className="flex items-center gap-2 text-sm font-medium text-success">
              <CheckIcon /> {message}
            </p>
          )}
          {error && (
            <p className="flex items-center gap-2 text-sm font-medium text-error">
              <ErrorIcon /> {error}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={!isDirty || saving}
          className={`
            w-full py-3 text-background text-sm font-medium transition uppercase
            ${saving
              ? "bg-brand-primary/70 cursor-wait"
              : isDirty
                ? "bg-brand-primary hover:opacity-90"
                : "bg-disabled cursor-not-allowed text-text-disabled"
            }
          `}
          aria-busy={saving}
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </form>
    </div>
  );
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

function Input({ label, id, ...props }: InputProps) {
  return (
    <div>
      <label htmlFor={id} className="block mb-1 text-sm font-medium text-text-secondary">
        {label}
      </label>
      <input
        id={id}
        {...props}
        className="w-full px-4 py-3 text-sm border border-border outline-none focus:ring-1 focus:ring-brand-primary disabled:cursor-not-allowed disabled:bg-surface disabled:text-text-disabled transition"
      />
    </div>
  );
}

// Icons for feedback
function CheckIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
