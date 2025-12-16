"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { authService } from "@/services/auth.service";

export default function VerifyEmailClient() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const router = useRouter();
  const [otp, setOtp] = useState("");

  if (!email) {
    return <div className="py-20 text-center">Invalid verification link</div>;
  }

  const submit = async () => {
    await authService.verifyEmail({ email, otp });
    router.push("/login");
  };

  return (
    <div className="max-w-md py-20 mx-auto space-y-4">
      <h1 className="text-xl font-semibold">Verify Email</h1>

      <input
        className="w-full border px-3 py-2"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />

      <button
        onClick={submit}
        className="w-full bg-brand-primary text-white py-2"
      >
        Verify
      </button>
    </div>
  );
}
