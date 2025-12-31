"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import Image from "next/image";

type CartDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const router = useRouter();
  const {
    cart,
    loading,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const total = cart.reduce(
    (acc, item) => acc + (item.price ?? 0) * item.quantity,
    0
  );

  /* ---------- ESC key + scroll lock ---------- */
  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  /* ---------- checkout ---------- */
  const goToCheckout = () => {
    onClose();
    router.push("/checkout");
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`
          fixed inset-0 z-40 bg-black/40 backdrop-blur-sm
          transition-opacity duration-300
          ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
      />

      {/* Drawer */}
      <aside
        className={`
          fixed top-0 right-0 z-50 h-full
          w-full sm:w-105
          bg-background
          transform transition-transform duration-300 ease-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
          flex flex-col
        `}
      >
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-5 border-b border-black/10">
          <h2 className="text-lg font-semibold tracking-wide text-brand-primary">
            Shopping Bag ({cart.length})
          </h2>
          <button
            onClick={onClose}
            aria-label="Close cart"
            className="text-2xl leading-none transition text-black/70 hover:text-black"
          >
            ×
          </button>
        </header>

        {/* Items */}
        <div className="flex-1 px-6 py-4 space-y-5 overflow-y-auto">
          {/* Loading */}
          {loading && (
            <div className="space-y-4 animate-pulse">
              {[1, 2].map((i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-20 h-24 bg-black/10" />
                  <div className="flex-1 space-y-3">
                    <div className="w-3/4 h-3 bg-black/10" />
                    <div className="w-1/2 h-3 bg-black/10" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty */}
          {!loading && cart.length === 0 && (
            <div className="flex flex-col items-center justify-center mt-24 text-center">
              <p className="text-sm text-black/50">
                Your bag is empty
              </p>
              <button
                onClick={onClose}
                className="mt-4 text-sm underline text-brand-primary"
              >
                Continue shopping
              </button>
            </div>
          )}

          {/* Items */}
          {!loading &&
            cart.map((item) => (
              <div
                key={`${item.productId}-${item.variantId}`}
                className="flex gap-4 py-4 border-b border-black/5"
              >
                {/* Image */}
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={80}
                    height={100}
                    className="object-cover rounded-sm"
                  />
                ) : (
                  <div className="flex items-center justify-center w-20 h-25 bg-black/5 text-xs text-black/40">
                    No image
                  </div>
                )}

                {/* Info */}
                <div className="flex flex-col flex-1">
                  <span className="text-sm font-medium text-brand-primary">
                    {item.name}
                  </span>

                  <span className="text-xs line-through text-black/40">
                    ₹{item.originalPrice}
                  </span>

                  <span className="text-sm font-medium text-brand-primary">
                    ₹{item.price}
                  </span>


                  {/* Quantity */}
                  <div className="flex items-center gap-3 mt-4">
                    <button
                      disabled={item.quantity === 1}
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          item.quantity - 1,
                          item.variantId
                        )
                      }
                      className="w-8 h-8 border border-black/20 disabled:opacity-30 hover:bg-brand-primary hover:text-background transition"
                    >
                      −
                    </button>

                    <span className="text-sm font-medium">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          item.quantity + 1,
                          item.variantId
                        )
                      }
                      className="w-8 h-8 border border-black/20 hover:bg-brand-primary hover:text-background transition"
                    >
                      +
                    </button>
                  </div>

                  <span className="mt-2 text-xs text-black/60">
                    Total: ₹
                    {(
                      (item.price ?? 0) * item.quantity
                    ).toFixed(2)}
                  </span>
                </div>

                {/* Remove */}
                <button
                  onClick={() =>
                    removeFromCart(item.productId, item.variantId)
                  }
                  className="self-start text-xs text-error hover:text-black transition"
                >
                  Remove
                </button>
              </div>
            ))}
        </div>

        {/* Footer (Sticky) */}
        <footer className="px-6 py-6 border-t border-black/10 space-y-4">
          <div className="flex justify-between text-sm font-medium text-brand-primary">
            <span>Subtotal</span>
            <span>₹{total.toFixed(2)}</span>
          </div>

          {/* Coupon placeholder (future-ready) */}
          <div className="text-xs text-black/40">
            Coupons available at checkout
          </div>

          <button
            onClick={goToCheckout}
            disabled={cart.length === 0}
            className={`
              w-full py-3 text-sm font-semibold tracking-wide
              ${cart.length === 0
                ? "bg-disabled cursor-not-allowed"
                : "bg-brand-primary text-background hover:bg-brand-primary/90 transition"
              }
            `}
          >
            CHECKOUT
          </button>

          <button
            onClick={clearCart}
            disabled={cart.length === 0}
            className="w-full text-xs text-black/60 hover:text-black transition"
          >
            Clear cart
          </button>
        </footer>
      </aside>
    </>
  );
}
