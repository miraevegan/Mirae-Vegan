"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { authService } from "@/services/auth.service";

export default function VerifyEmailPage() {
  const email = useSearchParams().get("email")!;
  const router = useRouter();
  const [otp, setOtp] = useState("");

  const submit = async () => {
    await authService.verifyEmail({ email, otp });
    router.push("/login");
  };

  return (
    <div className="max-w-md py-20 mx-auto space-y-4">
      <h1>Verify Email</h1>
      <input placeholder="Enter OTP" onChange={(e) => setOtp(e.target.value)} />
      <button onClick={submit}>Verify</button>
    </div>
  );
}
