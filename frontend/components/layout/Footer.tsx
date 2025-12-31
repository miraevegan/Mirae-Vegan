"use client";

import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { Linkedin, Facebook, Instagram } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import api from "@/lib/axios";
import axios from "axios";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();

    if (!email.trim()) {
      setMessage({ type: "error", text: "Please enter a valid email." });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      // API call to subscribe user
      const res = await api.post("/newsletter/subscribe", { email });

      setMessage({ type: "success", text: res.data.message || "Subscribed successfully!" });
      setEmail(""); // clear input
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        // Now error is typed as AxiosError
        setMessage({
          type: "error",
          text: error.response?.data?.message || "Subscription failed. Try again.",
        });
      } else {
        setMessage({ type: "error", text: "Subscription failed. Try again." });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <footer className="relative px-6 sm:px-10 pt-16 pb-8 bg-brand-primary">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">

        {/* Main Menu */}
        <div className="text-center md:text-left">
          <h4 className="mb-4 text-sm font-semibold tracking-widest uppercase text-background">
            Main Menu
          </h4>
          <ul className="space-y-2 text-sm text-background">
            <li><Link href="#just-landed">Just Landed</Link></li>
            <li><Link href="/shop">Shop</Link></li>
            <li><Link href="/about">About Us</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div className="text-center md:text-left">
          <h4 className="mb-4 text-sm font-semibold tracking-widest uppercase text-background">
            Legal
          </h4>
          <ul className="space-y-2 text-sm text-background">
            <li><Link href="/privacy-policy">Privacy Policy</Link></li>
            <li><Link href="/shipping-policy">Shipping Policy</Link></li>
            <li><Link href="/cancellation-refund">Refund Policy</Link></li>
            <li><Link href="/terms-and-conditions">Terms & Conditions</Link></li>

          </ul>
        </div>

        {/* Reach Us */}
        <div className="text-center md:text-left">
          <h4 className="mb-4 text-sm font-semibold tracking-widest uppercase text-background">
            Reach Us
          </h4>
          <ul className="space-y-2 text-sm text-background">
            <li><Link href="/contact-us">Contact Us</Link></li>
            <li><Link href="https://wa.me/919360696158">WhatsApp</Link></li>
            {/* <li><Link href="#">Facebook</Link></li> */}
            <li><Link href="https://www.instagram.com/mirae.lifestyle" target="_blank">Instagram</Link></li>
            {/* <li><Link href="#">Telegram</Link></li> */}
          </ul>
        </div>

        {/* Newsletter */}
        <div className="text-background text-center md:text-left">
          <h3 className="text-xl font-semibold tracking-wider font-highlight">
            Join Our Newsletter
          </h3>
          <p className="mt-1 text-sm">
            Updates, exclusive offers & early access.
          </p>

          <form onSubmit={handleSubscribe} className="flex flex-col gap-3 mt-5">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-5 py-3 text-sm bg-transparent border outline-none border-background focus:bg-background/80 focus:text-brand-primary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />

            <button
              type="submit"
              className="w-full px-6 py-3 text-sm tracking-widest transition cursor-pointer text-brand-primary bg-background hover:opacity-90 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Subscribing..." : "Subscribe"}
            </button>

            {message && (
              <p
                className={`mt-2 text-sm ${message.type === "success" ? "text-green-600" : "text-red-600"
                  }`}
              >
                {message.text}
              </p>
            )}
          </form>

          {/* Social Buttons */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            {/* <SocialButton icon={Linkedin} label="LinkedIn" href={""} /> */}
            {/* <SocialButton icon={Facebook} label="Facebook" href={""} /> */}
            <SocialButton icon={Instagram} label="Instagram" href={"https://www.instagram.com/mirae.lifestyle"} />
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-16 text-center">
        <p className="text-sm text-background">
          © {new Date().getFullYear()} Miraé. All rights reserved.
        </p>
      </div>

      {/* Floating Logo (Desktop only) */}
      <Image
        src="/logo/Miraé.svg"
        alt="Mirae"
        width={500}
        height={100}
        className="absolute bottom-0 left-0 hidden pointer-events-none select-none lg:block"
      />
    </footer>
  );
}

/* -------------------------
   Social Button Component
-------------------------- */
function SocialButton({
  icon: Icon,
  label,
  href,
}: {
  icon: LucideIcon;
  label: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex items-center justify-center gap-1 px-3 py-3 text-xs transition border border-background text-background hover:bg-background hover:text-brand-primary"
    >
      <Icon className="w-4 h-4" />
      {label}
    </Link>
  );
}