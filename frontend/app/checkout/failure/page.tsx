"use client";

import Lottie from "lottie-react";
import { useRouter, useSearchParams } from "next/navigation";
import failureAnimation from "@/public/animation/Failure.json";

export default function CheckoutFailure() {
  const params = useSearchParams();
  const router = useRouter();
  const orderId = params.get("orderId");

  return (
    <div className="min-h-screen flex items-center justify-center text-center px-6">
      <div>
        <div className="w-96 mx-auto mb-6">
          <Lottie
            animationData={failureAnimation}
            loop={true}
            autoplay
          />
        </div>
        <h1 className="text-4xl font-light mb-4">Payment Failed ❌</h1>
        <p className="mb-6 text-sm opacity-70">
          Something went wrong. Please try again.
        </p>

        <button
          onClick={() => router.push(`/orders/${orderId}`)}
          className="px-10 py-3 bg-brand-primary hover:cursor-pointer text-background"
        >
          Retry Payment
        </button>
      </div>
    </div>
  );
}
