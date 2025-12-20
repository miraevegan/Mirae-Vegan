"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import {
  Search,
  Heart,
  User,
  ShoppingBag,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

import CartDrawer from "@/components/cart/CartDrawer";

export default function NavbarDefault() {
  const { user, loading, logout } = useAuth();
  const { cart } = useCart();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  /* Close profile dropdown */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b bg-background border-border">
        <div className="relative flex items-center justify-between px-6 py-5 mx-auto max-w-11/12 text-text-primary">

          {/* LEFT LINKS – Desktop Only */}
          <div className="hidden lg:flex items-center gap-6 text-xs tracking-widest uppercase">
            <Link className="hover:opacity-60" href="#just-landed">Just Landed</Link>
            <Link className="hover:opacity-60" href="/products">Shop</Link>
            <Link className="hover:opacity-60" href="/about-us">About Us</Link>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            className="lg:hidden"
            onClick={() => setMobileMenu(true)}
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* BRAND – unchanged */}
          <Link
            href="/"
            className="absolute text-3xl font-medium tracking-tight -translate-x-1/2 left-1/2 font-brand"
          >
            Miraé
          </Link>

          {/* RIGHT ICONS */}
          <div className="relative flex items-center gap-6">

            {/* <Search className="w-4.5 h-4.5 cursor-pointer hover:opacity-60" /> */}
            <Heart className="w-4.5 h-4.5 cursor-pointer hover:opacity-60" />

            {/* CART */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative"
              aria-label="Open cart"
            >
              <ShoppingBag className="w-4.5 h-4.5 hover:opacity-60" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 min-w-4.5 h-4.5 px-1 text-[10px] flex items-center justify-center bg-black text-white rounded-full">
                  {totalItems}
                </span>
              )}
            </button>

            {/* PROFILE */}
            <button onClick={() => setOpen(v => !v)}>
              <User className="w-4.5 h-4.5 hover:opacity-60" />
            </button>

            {/* PROFILE DROPDOWN */}
            {!loading && open && (
              <div
                ref={dropdownRef}
                className="absolute right-0 w-56 p-3 border shadow-2xl top-12 border-border bg-background"
              >
                {!user ? (
                  <>
                    <p className="mb-4 text-[10px] tracking-widest uppercase text-text-secondary">
                      Guest User
                    </p>

                    <Link
                      href="/login"
                      onClick={() => setOpen(false)}
                      className="block w-full px-4 py-2 mb-2 text-xs tracking-widest text-center transition border border-black hover:bg-black hover:text-white"
                    >
                      Login
                    </Link>

                    <Link
                      href="/register"
                      onClick={() => setOpen(false)}
                      className="block w-full px-4 py-2 text-xs tracking-widest text-center transition border border-border hover:bg-surface"
                    >
                      Register
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/profile" className="block px-4 py-2 text-sm hover:bg-surface">
                      Profile
                    </Link>
                    <Link href="/orders" className="block px-4 py-2 text-sm hover:bg-surface">
                      Orders
                    </Link>
                    <div className="h-px my-2 bg-border" />
                    <button
                      onClick={() => {
                        logout();
                        setOpen(false);
                        router.push("/login");
                      }}
                      className="flex items-center w-full gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-500/10"
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

        {/* MOBILE NAV MENU */}
        {mobileMenu && (
          <div className="fixed inset-0 z-50 bg-background text-text-primary">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <span className="text-2xl font-brand">Miraé</span>
              <button onClick={() => setMobileMenu(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col items-center gap-8 mt-20 text-sm tracking-widest uppercase">
              <Link href="#just-landed" onClick={() => setMobileMenu(false)}>Just Landed</Link>
              <Link href="/products" onClick={() => setMobileMenu(false)}>Shop</Link>
              <Link href="/about-us" onClick={() => setMobileMenu(false)}>About Us</Link>
            </div>
          </div>
        )}
      </nav>

      {/* CART DRAWER */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </>
  );
}
