"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Lottie from "lottie-react";
import successAnimation from "@/public/animation/Success.json";
import NavbarDefault from "@/components/layout/NavbarDefault";

export default function CheckoutSuccess() {
  const params = useSearchParams();
  const router = useRouter();
  const orderId = params.get("orderId");

  return (
    <>
    <NavbarDefault />
        <div className="flex items-center justify-center text-center px-6 pt-14 pb-40">
      <div className="max-w-md">
        {/* 🎉 LOTTIE */}
        <div className="w-96 mx-auto mb-6">
          <Lottie
            animationData={successAnimation}
            loop={true}
            autoplay
          />
        </div>

        <h1 className="text-4xl font-light mb-4">
          Payment Successful 🎉
        </h1>

        <p className="mb-6 text-sm opacity-70">
          Your order has been placed successfully.
        </p>

        <p className="mb-8 text-xs opacity-50">
          Order ID: {orderId}
        </p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => router.push("/")}
            className="border px-20 py-3 bg-brand-primary text-background"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
