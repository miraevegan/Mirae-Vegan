"use client";

import { useState } from "react";
import { useToast } from "@/context/ToastContext";
import api from "@/lib/axios"; // your axios instance
import { AxiosError } from "axios";

export default function ChangePassword() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    if (next !== confirm) {
      showToast("Passwords do not match", "error");
      return;
    }

    setLoading(true);

    try {
      // Call your backend API for change password
      await api.post("/auth/change-password", {
        currentPassword: current,
        newPassword: next,
      });

      showToast("Password updated successfully 🎉", "success");
      // Clear inputs
      setCurrent("");
      setNext("");
      setConfirm("");
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      showToast(err.response?.data.message || "Failed to update password", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h2 className="mb-6 text-xl font-semibold">Change Password</h2>

      <form onSubmit={submit} className="max-w-md space-y-4">
        <input
          type="password"
          placeholder="Current password"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          className="w-full px-3 py-2 border"
          required
        />
        <input
          type="password"
          placeholder="New password"
          value={next}
          onChange={(e) => setNext(e.target.value)}
          className="w-full px-3 py-2 border"
          required
          minLength={6}
        />
        <input
          type="password"
          placeholder="Confirm password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full px-3 py-2 border"
          required
          minLength={6}
        />

        <button
          type="submit"
          disabled={loading}
          className={`px-6 py-2 text-white bg-brand-primary ${loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </>
  );
}
