"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import {
  Heart,
  User,
  ShoppingBag,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

import CartDrawer from "@/components/cart/CartDrawer";
import WishlistDrawer from "../wishlist/WishlistDrawer";
import { useWishlist } from "@/context/WishlistContext";

export default function NavbarDefault() {
  const { user, loading, logout } = useAuth();
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlist.length;

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
            <Link className="hover:opacity-60" href="/shop">Shop</Link>
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
            className="absolute text-brand-primary text-3xl font-medium tracking-tight -translate-x-1/2 left-1/2 font-brand"
          >
            Miraé
          </Link>

          {/* RIGHT ICONS */}
          <div className="relative flex items-center gap-6">
            {/* WISHLIST */}
            <button
              onClick={() => {
                if (!user) {
                  router.push("/login");
                  return;
                }
                setWishlistOpen(true); // <-- open wishlist drawer
              }}
              className="relative"
              aria-label="Open wishlist"
            >
              <Heart className="w-5 h-5 stroke-[1.75px] hover:cursor-pointer hover:opacity-60" />

              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 min-w-4.5 h-4.5 px-1 text-[10px] flex items-center justify-center bg-black text-white rounded-full">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* CART */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative"
              aria-label="Open cart"
            >
              <ShoppingBag className="w-4.5 h-4.5 hover:opacity-60 hover:cursor-pointer" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 min-w-4.5 h-4.5 px-1 text-[10px] flex items-center justify-center bg-black text-white rounded-full">
                  {totalItems}
                </span>
              )}
            </button>

            {/* PROFILE */}
            <button onClick={() => setOpen(v => !v)} className="hidden lg:block">
              <User className="w-4.5 h-4.5 hover:opacity-60 hover:cursor-pointer" />
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

                    <Link href="/login" onClick={() => setOpen(false)} className="block px-4 py-2 text-sm text-center border hover:border-border text-background bg-brand-primary hover:bg-brand-primary/80 hover:text-background">
                      Login
                    </Link>
                    <Link href="/register" onClick={() => setOpen(false)} className="block mt-2 px-4 py-2 text-sm text-center border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-background">
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
        <div
          className={`
              fixed inset-0 z-50 bg-background text-brand-primary
              transition-all duration-300 ease-in-out
              ${mobileMenu
              ? "translate-x-0 opacity-100 pointer-events-auto"
              : "-translate-x-full opacity-0 pointer-events-none"}
            `}
          >
          <div className="flex items-center justify-between p-6 border-b border-border">
            <span className="text-2xl font-brand">Miraé</span>
            <button onClick={() => setMobileMenu(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col items-center gap-8 mt-20 text-sm tracking-widest uppercase">
            <Link href="#just-landed" onClick={() => setMobileMenu(false)}>Just Landed</Link>
            <Link href="/shop" onClick={() => setMobileMenu(false)}>Shop</Link>
            <Link href="/about-us" onClick={() => setMobileMenu(false)}>About Us</Link>
            <div className="mt-16 flex flex-col text-xl items-center gap-6">
              {user ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenu(false)}
                    className="flex items-center gap-3"
                  >
                    <User className="w-5 h-5" />
                    Profile
                  </Link>

                  <Link
                    href="/profile"
                    onClick={() => setMobileMenu(false)}
                    className="flex items-center gap-3"
                  >
                    Orders
                  </Link>

                  <button
                    onClick={() => {
                      logout();
                      setMobileMenu(false);
                      router.push("/login");
                    }}
                    className="flex items-center gap-3 text-red-500"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileMenu(false)}>
                    Login
                  </Link>
                  <Link href="/register" onClick={() => setMobileMenu(false)}>
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* CART DRAWER */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />

      <WishlistDrawer isOpen={wishlistOpen} onClose={() => setWishlistOpen(false)} /> {/* <-- Render WishlistDrawer */}
    </>
  );
}
