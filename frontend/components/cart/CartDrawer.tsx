"use client";

import { useCart } from "@/context/CartContext";
import Image from "next/image";

type CartDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, loading, updateQuantity, removeFromCart, clearCart } = useCart();

  const total = cart.reduce(
    (acc, item) => acc + (item.price ?? 0) * item.quantity,
    0
  );

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
        />
      )}

      {/* Drawer */}
      <aside
        className={`
          fixed top-0 right-0 h-full w-105 bg-background z-50
          transform transition-transform duration-300 ease-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
          flex flex-col
        `}
      >
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-5 border-b border-black/10">
          <h2 className="text-xl font-semibold tracking-wide font-highlight text-brand-primary">
            Shopping Bag ({cart.length})
          </h2>
          <button
            onClick={onClose}
            className="text-2xl leading-none transition text-black/70 hover:text-black"
          >
            ×
          </button>
        </header>

        {/* Items */}
        <div className="flex-1 px-6 py-4 space-y-5 overflow-y-auto">
          {loading && (
            <p className="text-sm text-center text-black/50">
              Loading cart…
            </p>
          )}

          {!loading && cart.length === 0 && (
            <p className="mt-24 text-sm text-center text-black/50">
              Your bag is empty
            </p>
          )}

          {!loading &&
            cart.map((item) => (
              <div
                key={item.productId}
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
                  <div className="flex items-center justify-center w-20 text-xs h-25 bg-black/5 text-black/40">
                    No image
                  </div>
                )}

                {/* Info */}
                <div className="flex flex-col flex-1">
                  <span className="text-sm font-semibold leading-snug text-brand-primary">
                    {item.name}
                  </span>

                  <span className="mt-1 text-sm text-black/70">
                    ₹{(item.price ?? 0).toFixed(2)}
                  </span>

                  {/* Quantity */}
                  <div className="flex items-center gap-4 mt-4">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          Math.max(1, item.quantity - 1)
                        )
                      }
                      className="text-sm transition border w-7 h-7 border-black/20 hover:bg-brand-primary hover:text-background"
                    >
                      −
                    </button>

                    <span className="text-sm font-medium">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity + 1)
                      }
                      className="text-sm transition border w-7 h-7 border-black/20 hover:bg-brand-primary hover:text-background"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="self-start text-xs font-medium transition text-error hover:text-black"
                >
                  Remove
                </button>
              </div>
            ))}
        </div>

        {/* Footer */}
        <footer className="px-6 py-6 border-t border-black/10">
          <div className="flex justify-between mb-5 text-sm font-medium text-brand-primary">
            <span>Subtotal</span>
            <span>₹{total.toFixed(2)}</span>
          </div>

          <button
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
            className="w-full mt-3 text-sm transition text-black/70 hover:text-black"
          >
            Clear cart
          </button>
        </footer>
      </aside>
    </>
  );
}
