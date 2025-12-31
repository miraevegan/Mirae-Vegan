import { Suspense } from "react";
import CheckoutSuccessClient from "./CheckoutSuccessClient";

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <CheckoutSuccessClient />
    </Suspense>
  );
}
