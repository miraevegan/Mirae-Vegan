// types/global.d.ts

import { RazorpayOptions } from "./razorpay";

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
    };
  }
}

export {};
