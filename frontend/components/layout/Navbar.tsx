"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Search,
  Heart,
  User,
  ShoppingBag,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation"; // <-- Import useRouter
import CartDrawer from "../cart/CartDrawer";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const { cart } = useCart();
  const router = useRouter(); // <-- Initialize router

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [cartOpen, setCartOpen] = useState(false);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  /* ----------------------------
     Scroll detection
  ----------------------------- */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ----------------------------
     Close dropdown on outside click
  ----------------------------- */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const textColor = scrolled ? "text-brand-primary" : "text-background";

  return (
    <>
      <nav
        className={`
        fixed top-0 left-0 z-50 w-full
        transition-all duration-300
        ${scrolled
            ? `
              bg-linear-to-b
              from-background/50
              to-background/10
              backdrop-blur-xl
              shadow-sm
            `
            : "bg-transparent"
          }
      `}
      >
        <div
          className={`
          flex items-center justify-between
          px-6 py-4 mx-auto max-w-11/12
          transition-colors duration-300
          ${textColor}
        `}
        >
          {/* LEFT LINKS */}
          <div className="flex items-center gap-6 text-sm font-normal uppercase">
            <Link href="#just-landed">Just Landed</Link>
            <Link href="/products">Shop</Link>
            <Link href="#">About Us</Link>
          </div>

          {/* BRAND */}
          <Link
            href="/"
            className="absolute text-3xl font-medium tracking-wide transition-colors duration-300 -translate-x-1/2 left-1/2 font-brand"
          >
            Miraé
          </Link>

          {/* RIGHT ICONS */}
          <div className="relative flex items-center gap-5">
            <Search className="w-5 h-5 cursor-pointer stroke-[1.75px]" />
            <Heart className="w-5 h-5 cursor-pointer stroke-[1.75px]" />

            {/* CART ICON */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative"
              aria-label="Open cart"
            >
              <ShoppingBag className="w-5 h-5 cursor-pointer stroke-[1.75px]" />

              {totalItems > 0 && (
                <span
                  className="
                  absolute -top-2 -right-2
                  min-w-4.5 h-4.5
                  px-1
                  flex items-center justify-center
                  text-[10px] font-semibold
                  bg-black text-white
                  rounded-full
                ">
                  {totalItems}
                </span>)}
            </button>

            {/* PROFILE ICON */}
            <button onClick={() => setOpen((v) => !v)}>
              <User className="w-5 h-5 cursor-pointer stroke-[1.75px]" />
            </button>

            {/* PROFILE DROPDOWN */}
            {!loading && open && (
              <div
                ref={dropdownRef}
                className="absolute right-0 z-50 w-56 p-3 border shadow-2xl top-12 border-border bg-linear-to-b from-background/95 to-background/80 backdrop-blur-xl text-text-primary"
              >
                {!user ? (
                  <>
                    <p className="mb-4 text-xs uppercase text-text-secondary">
                      User not logged in?
                    </p>

                    <Link
                      href="/login"
                      onClick={() => setOpen(false)}
                      className="block w-full px-4 py-2 mb-2 text-sm tracking-widest text-center transition border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-background"
                    >
                      Login
                    </Link>

                    <Link
                      href="/register"
                      onClick={() => setOpen(false)}
                      className="block w-full px-4 py-2 text-sm tracking-widest text-center transition border text-brand-primary border-border hover:bg-border"
                    >
                      Register
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/profile"
                      onClick={() => setOpen(false)}
                      className="block px-4 py-2 text-sm transition rounded-md hover:bg-surface"
                    >
                      Profile
                    </Link>

                    <Link
                      href="/orders"
                      onClick={() => setOpen(false)}
                      className="block px-4 py-2 text-sm transition rounded-md hover:bg-surface"
                    >
                      Orders
                    </Link>

                    <div className="h-px my-2 bg-border" />

                    <button
                      onClick={() => {
                        logout();
                        setOpen(false);
                        router.push("/login");  // <-- Redirect here after logout
                      }}
                      className="flex items-center w-full gap-2 px-4 py-2 text-sm text-red-500 transition rounded-md hover:bg-red-500/10"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
