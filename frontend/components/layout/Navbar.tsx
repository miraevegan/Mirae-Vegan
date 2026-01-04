"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Heart,
  User,
  ShoppingBag,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import CartDrawer from "../cart/CartDrawer";
import WishlistDrawer from "../wishlist/WishlistDrawer";  // <-- Import WishlistDrawer
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false); // <-- Add wishlist open state

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlist.length;

  /* Scroll detection */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Close profile dropdown on outside click */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const textColor = scrolled ? "text-brand-primary" : "text-background";

  return (
    <>
      <nav
        className={`
          fixed top-0 left-0 z-50 w-full transition-all duration-300
          ${scrolled
            ? "bg-linear-to-b from-background/60 to-background/20 backdrop-blur-xl shadow-sm"
            : "bg-transparent"}
        `}
      >
        <div
          className={`
            flex items-center justify-between
            px-6 py-4 mx-auto max-w-11/12
            ${textColor}
          `}
        >
          {/* LEFT – Desktop Links */}
          <div className="hidden lg:flex items-center gap-6 text-sm uppercase">
            <Link href="#just-landed">Just Landed</Link>
            <Link href="/shop">Shop</Link>
            <Link href="/about-us">About Us</Link>
          </div>

          {/* MOBILE – Menu Button */}
          <button
            className="lg:hidden"
            onClick={() => setMobileMenu(true)}
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6 stroke-[1.75px]" />
          </button>

          {/* BRAND */}
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 text-3xl font-brand tracking-wide"
          >
            Miraé
          </Link>

          {/* RIGHT ICONS */}
          <div className="flex items-center gap-5">
            {/* <Search className="w-5 h-5 cursor-pointer stroke-[1.75px]" /> */}
            {/* WISHLIST */}
            <button
              onClick={() => {
                if (!user) {
                  router.push("/login");
                  return;
                }
                setWishlistOpen(true); // <-- open wishlist drawer
              }}
              className="relative hover:cursor-pointer"
              aria-label="Open wishlist"
            >
              <Heart className="w-5 h-5 stroke-[1.75px]" />

              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 min-w-4.5 h-4.5 px-1 text-[10px] flex items-center justify-center bg-black text-white rounded-full">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* CART */}
            <button onClick={() => setCartOpen(true)} className="relative hover:cursor-pointer" aria-label="Open cart">
              <ShoppingBag className="w-5 h-5 stroke-[1.75px]" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 min-w-4.5 h-4.5 px-1 text-[10px] flex items-center justify-center bg-black text-white rounded-full">
                  {totalItems}
                </span>
              )}
            </button>

            {/* PROFILE */}
            <button onClick={() => setOpen(v => !v)} aria-label="Toggle profile menu" className="hidden lg:block">
              <User className="w-5 h-5 stroke-[1.75px]" />
            </button>

            {/* PROFILE DROPDOWN */}
            {!loading && open && (
              <div
                ref={dropdownRef}
                className="absolute right-6 top-14 w-56 p-3 border shadow-2xl border-border bg-linear-to-b from-background/95 to-background/80 backdrop-blur-xl"
              >
                {!user ? (
                  <>
                    <Link href="/login" onClick={() => setOpen(false)} className="block px-4 py-2 text-sm text-center border hover:border-border text-background bg-brand-primary hover:bg-brand-primary/80 hover:text-background">
                      Login
                    </Link>
                    <Link href="/register" onClick={() => setOpen(false)} className="block mt-2 px-4 py-2 text-sm text-center border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-background">
                      Register
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/profile" className="block px-4 py-2 text-sm text-brand-primary hover:bg-surface">Profile</Link>
                    <Link href="/orders" className="block px-4 py-2 text-sm text-brand-primary hover:bg-surface">Orders</Link>
                    <div className="h-px my-2 bg-border" />
                    <button
                      onClick={() => {
                        logout();
                        setOpen(false);
                        router.push("/login");
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 w-full"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* MOBILE MENU */}
        <div
          className={`
              fixed inset-0 z-50 bg-background text-brand-primary
              transition-all duration-300 ease-in-out
              ${mobileMenu
              ? "translate-x-0 opacity-100 pointer-events-auto"
              : "-translate-x-full opacity-0 pointer-events-none"}
            `}
          >
          <div className="flex justify-between p-6">
            <span className="text-2xl font-brand">Miraé</span>
            <button onClick={() => setMobileMenu(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex flex-col items-center gap-8 mt-20 text-xl uppercase">
            <Link href="#just-landed" onClick={() => setMobileMenu(false)}>Just Landed</Link>
            <Link href="/shop" onClick={() => setMobileMenu(false)}>Shop</Link>
            <Link href="/about-us" onClick={() => setMobileMenu(false)}>About Us</Link>
            <div className="mt-16 flex flex-col items-center gap-6 text-xl">
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

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <WishlistDrawer isOpen={wishlistOpen} onClose={() => setWishlistOpen(false)} /> {/* <-- Render WishlistDrawer */}
    </>
  );
}
