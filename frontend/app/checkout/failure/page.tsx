import { Suspense } from "react";
import CheckoutFailureClient from "./CheckoutFailureClient";

export default function CheckoutFailurePage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <CheckoutFailureClient />
    </Suspense>
  );
}
