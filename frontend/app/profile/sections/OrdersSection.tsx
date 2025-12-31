"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";
import Image from "next/image";
// import { useCart } from "@/context/CartContext";
import type { Order, OrderItem, OrderStatus } from "@/types/order";
import api from "@/lib/axios";

const statusColorMap: Record<OrderStatus, string> = {
  pending: "border-yellow-400 text-yellow-600 bg-yellow-50",
  confirmed: "border-[var(--color-brand-primary)] text-[var(--color-brand-primary)] bg-[var(--surface-accent)]",
  processing: "border-indigo-400 text-indigo-600 bg-indigo-50",
  shipped: "border-purple-400 text-purple-600 bg-purple-50",
  out_for_delivery: "border-orange-400 text-orange-600 bg-orange-50",
  delivered: "border-green-500 text-green-700 bg-green-50",
  cancelled: "border-[var(--status-error)] text-[var(--status-error)] bg-[var(--status-error)]/10",
};

type OrdersSectionProps = {
  orders: Order[];
  loading: boolean;
};

export default function OrdersSection({ orders, loading }: OrdersSectionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  const router = useRouter();
  const { showToast } = useToast();
  // const { addToCart } = useCart();

  if (loading) {
    return (
      <p className="text-sm text-text-secondary select-none">
        Loading orders…
      </p>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="mb-4 text-sm text-text-secondary select-none">
          You haven’t placed any orders yet
        </p>
        <button
          onClick={() => router.push("/")}
          className="px-6 py-2 text-sm font-semibold text-white rounded-xl bg-brand-primary hover:opacity-90 transition"
          aria-label="Start shopping"
        >
          Start shopping
        </button>
      </div>
    );
  }

  const handleInvoice = async (orderId: string) => {
    try {
      const res = await api.get(`/invoice/${orderId}`, {
        responseType: "blob", // 🔥 important
      });

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      window.open(url); // open PDF in new tab
    } catch (err) {
      console.error(err);
      showToast("Failed to generate invoice. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto font-body">
      <h2 className="mb-6 text-2xl font-semibold text-text-primary">
        Orders
      </h2>

      <div className="space-y-5">
        {orders.map((order) => {
          const open = openId === order._id;

          return (
            <motion.div
              key={order._id}
              layout
              className="overflow-hidden border bg-surface hover:bg-background transition"
            >
              {/* Header */}
              <button
                onClick={() => setOpenId(open ? null : order._id)}
                className="w-full p-5 rounded-lg transition-colors"
                aria-expanded={open}
                aria-controls={`order-details-${order._id}`}
              >
                {/* Desktop view (sm and up) */}
                <div className="hidden sm:grid sm:grid-cols-4 sm:gap-4 text-left">
                  <Info label="Order" value={`#${order._id.slice(-6)}`} />
                  <Info
                    label="Date"
                    value={new Date(order.createdAt).toLocaleDateString(
                      "en-IN",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  />
                  <Info
                    label="Total"
                    value={`₹${order.totalPrice.toLocaleString()}`}
                  />
                  <Status status={order.orderStatus} />
                </div>

                {/* Mobile view (below sm) */}
                <div className="flex flex-col space-y-3 sm:hidden">
                  <Status status={order.orderStatus} />
                  <div className="flex justify-between">
                    <Info label="Order" value={`#${order._id.slice(-6)}`} />
                    <Info
                      label="Date"
                      value={new Date(order.createdAt).toLocaleDateString(
                        "en-IN",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    />
                  </div>
                  <div className="flex justify-start">
                    <Info label="Total" value={`₹${order.totalPrice.toLocaleString()}`} />
                  </div>
                </div>
              </button>

              {/* Expand */}
              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    id={`order-details-${order._id}`}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="px-5 pb-5 space-y-6"
                  >
                    <OrderTimeline status={order.orderStatus} />

                    <div className="space-y-4">
                      {order.orderItems.map((item) => (
                        <OrderItemRow
                          key={`${item.product}-${item.variant?.id ?? "default"}`}
                          item={item}
                        />
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3 pt-4 border-t border-border">

                      {/* <button
                        onClick={() =>
                          order.orderItems.forEach((i) =>
                            addToCart(
                              typeof i.product === "string"
                                ? i.product
                                : i.product._id,
                              i.quantity,
                              i.variant?.id
                            )
                          )
                        }
                        className="text-sm font-medium text-brand-primary hover:text-background border border-brand-primary hover:bg-brand-primary px-6 py-2 transition"
                      >
                        Reorder
                      </button> */}

                      <button
                        onClick={() => router.push(`/orders/${order._id}`)}
                        className="text-sm font-medium text-brand-primary hover:text-background border border-brand-primary hover:bg-brand-primary px-6 py-2 transition"
                      >
                        View order
                      </button>
                      <button
                        onClick={() => handleInvoice(order._id)}
                        className="text-sm font-medium text-background bg-brand-primary px-6 py-2 hover:bg-hover transition"
                      >
                        Invoice
                      </button>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Sub Components ---------- */

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] tracking-widest uppercase text-text-secondary select-none">
        {label}
      </p>
      <p className="text-sm font-medium text-text-primary">{value}</p>
    </div>
  );
}

function Status({ status }: { status: OrderStatus }) {
  return (
    <div className="flex items-center sm:justify-end">
      <span
        className={`px-3 py-1 text-[10px] tracking-widest uppercase border select-none ${statusColorMap[status]
          }`}
        style={{
          borderColor:
            status === "cancelled"
              ? "var(--status-error)"
              : status === "confirmed"
                ? "var(--color-brand-primary)"
                : undefined,
          color:
            status === "cancelled"
              ? "var(--status-error)"
              : status === "confirmed"
                ? "var(--color-brand-primary)"
                : undefined,
          backgroundColor:
            status === "cancelled"
              ? "rgba(211, 47, 47, 0.1)"
              : status === "confirmed"
                ? "var(--surface-accent)"
                : undefined,
        }}
      >
        {status.replace(/_/g, " ")}
      </span>
    </div>
  );
}

function OrderItemRow({ item }: { item: OrderItem }) {
  const productName =
    typeof item.product === "string"
      ? "Product"
      : item.product?.name ?? "Product";

  const label = typeof item.variant?.label === "string" ? item.variant.label : "";

  const price = item.variant?.price ?? item.price ?? 0;
  const qty = item.quantity ?? 0;

  return (
    <div className="flex items-center gap-4">
      <Image
        src={item.image || "/placeholder.png"}
        alt={productName}
        width={56}
        height={72}
        className="object-cover rounded-lg"
      />

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-primary truncate">
          {productName}
        </p>
        {label && (
          <p className="text-xs text-text-secondary truncate">{label}</p>
        )}
        <p className="text-xs text-text-secondary">Qty {qty}</p>
      </div>

      <p className="text-sm font-medium text-text-primary">
        ₹{(price * qty).toLocaleString()}
      </p>
    </div>
  );
}

import { Check } from "lucide-react";

function OrderTimeline({ status }: { status: OrderStatus }) {
  const steps: OrderStatus[] = [
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "out_for_delivery",
    "delivered",
    "cancelled",
  ];

  const current = steps.indexOf(status);

  const labelMap: Record<OrderStatus, string> = {
    pending: "Pending",
    confirmed: "Confirmed",
    processing: "Processing",
    shipped: "Shipped",
    out_for_delivery: "Out for delivery",
    delivered: "Delivered",
    cancelled: "Cancelled"
  };

  return (
    <div className="w-full px-2 border-dashed border p-4 border-border">
      <div className="flex items-center justify-between">
        {steps.map((step, i) => {
          const isCompleted = i < current;
          const isActive = i === current;

          return (
            <div key={step} className="flex-1 flex flex-col items-center">
              {/* Line */}
              {i !== 0 && (
                <div
                  className={`absolute top-3 left-0 right-0 h-0.5 -z-10
                    ${isCompleted ? "bg-text-primary" : "bg-border"}`}
                />
              )}

              {/* Dot */}
              <div
                className={`relative flex items-center justify-center rounded-full
                  transition-all duration-300
                  ${
                    isCompleted
                      ? "bg-brand-primary text-background w-6 h-6"
                      : isActive
                      ? "bg-success w-7 h-7 animate-pulse"
                      : "bg-border w-4 h-4"
                  }`}
              >
                {isCompleted && <Check size={14} />}
              </div>

              {/* Label */}
              <span
                className={`mt-2 text-[11px] text-center whitespace-nowrap
                  ${
                    isActive
                      ? "text-text-primary font-medium"
                      : "text-muted"
                  }`}
              >
                {labelMap[step]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
