"use client";

import { useState } from "react";
import api from "@/lib/axios";
import { useToast } from "@/context/ToastContext";
import { AxiosError } from "axios";

interface Props {
  productId: string;
  onSuccess: () => void;
}

export default function ReviewForm({ productId, onSuccess }: Props) {
  const { showToast } = useToast();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!comment.trim()) {
      showToast("Please write a comment", "error");
      return;
    }

    try {
      setLoading(true);

      await api.post(`/reviews/${productId}`, {
        rating,
        comment,
      });

      showToast("Review submitted ⭐", "success");
      setComment("");
      setRating(5);
      onSuccess();
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;

      showToast(
        error.response?.data?.message || "Failed to submit review",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-border bg-surface shadow-md p-8 space-y-6"
    >
      <div className="space-y-1">
        <h3 className="text-sm uppercase tracking-widest">
          Write a review
        </h3>
        <p className="text-xs opacity-60">
          Share your honest experience with this product
        </p>
      </div>

      {/* ⭐ Rating */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Your rating</p>

        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRating(r)}
              className={`text-2xl transition ${
                r <= rating ? "opacity-100" : "opacity-30"
              }`}
              aria-label={`Rate ${r} stars`}
            >
              ⭐
            </button>
          ))}
        </div>
      </div>

      {/* ✍️ Comment */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Your review
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="w-full border border-black/20 px-4 py-3 text-sm focus:outline-none focus:border-black resize-none"
          placeholder="What did you like or dislike?"
        />
      </div>

      {/* 🚀 Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 hover:bg-hover text-sm uppercase tracking-widest bg-brand-primary text-background transition disabled:opacity-40"
      >
        {loading ? "Submitting..." : "Submit review"}
      </button>
    </form>
  );
}
