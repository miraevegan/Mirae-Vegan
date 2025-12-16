import { Suspense } from "react";
import VerifyEmailClient from "./VerifyEmailClient";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center">Loading...</div>}>
      <VerifyEmailClient />
    </Suspense>
  );
}
