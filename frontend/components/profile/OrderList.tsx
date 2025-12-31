"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";
import Image from "next/image";
import type { Order, OrderItem, OrderStatus } from "@/types/order";

/* ---------- Constants ---------- */

const statusColorMap: Record<OrderStatus, string> = {
  pending: "border-yellow-400 text-yellow-600 bg-yellow-50",
  confirmed: "border-blue-400 text-blue-600 bg-blue-50",
  processing: "border-indigo-400 text-indigo-600 bg-indigo-50",
  shipped: "border-purple-400 text-purple-600 bg-purple-50",
  out_for_delivery: "border-orange-400 text-orange-600 bg-orange-50",
  delivered: "border-green-500 text-green-700 bg-green-50",
  cancelled: "border-red-400 text-red-600 bg-red-50",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    axios
      .get<{ success: boolean; orders: Order[] }>("/orders/my")
      .then(res => setOrders(res.data.orders))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="max-w-4xl px-6 py-12 mx-auto">
        <p className="text-sm text-muted">Loading orders…</p>
      </section>
    );
  }

  return (
    <section className="max-w-4xl px-6 py-12 mx-auto">
      <h1 className="mb-10 text-2xl font-semibold">My Orders</h1>

      <div className="space-y-6">
        {orders.map(order => {
          const open = openId === order._id;

          return (
            <motion.div
              key={order._id}
              layout
              className="shadow-md border border-brand-secondary rounded-2xl bg-surface hover:bg-background transition"
            >
              {/* HEADER ROW */}
              <button
                onClick={() => setOpenId(open ? null : order._id)}
                className="grid w-full gap-4 p-5 text-left transition hover:bg-muted/40 sm:grid-cols-4"
              >
                <Info label="Order" value={`#${order._id.slice(-6)}`} />
                <Info
                  label="Date"
                  value={new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                />
                <Info
                  label="Total"
                  value={`₹${order.totalPrice.toLocaleString()}`}
                />
                <Status status={order.orderStatus} />
              </button>

              {/* EXPANDABLE CONTENT */}
              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="px-5 pb-5 space-y-6"
                  >
                    {order.orderStatus !== "cancelled" && (
                      <OrderTimeline status={order.orderStatus} />
                    )}

                    <div className="space-y-4">
                      {order.orderItems.map(item => (
                        <OrderItemRow
                          key={`${item.product}-${item.variant?.id ?? "default"}`}
                          item={item}
                        />
                      ))}
                    </div>

                    {/* ACTIONS */}
                    <div className="flex flex-wrap gap-3 pt-4 border-t">
                      {/* Reorder: redirect (variant-safe) */}
                      <button
                        onClick={() =>
                          router.push(`/products/${order.orderItems[0].product}`)
                        }
                        className="px-5 py-2 text-xs tracking-widest uppercase border rounded-lg hover:bg-black hover:text-white transition"
                      >
                        Reorder
                      </button>

                      <button
                        onClick={() => router.push(`/orders/${order._id}`)}
                        className="px-5 py-2 text-xs tracking-widest uppercase border rounded-lg hover:bg-black hover:text-white transition"
                      >
                        View Order
                      </button>

                      <a
                        href={`${process.env.NEXT_PUBLIC_API_URL}/invoice/${order._id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2 text-xs tracking-widest uppercase border rounded-lg hover:bg-black hover:text-white transition"
                      >
                        Invoice
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

/* ---------- Components ---------- */

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] tracking-widest uppercase text-muted">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}

function Status({ status }: { status: OrderStatus }) {
  return (
    <div className="flex items-center sm:justify-end">
      <span
        className={`px-3 py-1 text-[10px] tracking-widest uppercase border rounded-full ${statusColorMap[status]}`}
      >
        {status.replace(/_/g, " ")}
      </span>
    </div>
  );
}

function OrderItemRow({ item }: { item: OrderItem }) {
  // Extract product name
  const productName =
    typeof item.product === "string"
      ? item.name || "Unknown Product"
      : item.product?.name || "Unknown Product";

  // Variant label is a string from backend now
  const variantLabel = item.variant?.label ?? "";

  const price = typeof item.variant?.price === "number" ? item.variant.price : 
                typeof item.price === "number" ? item.price : 0;
  const quantity = typeof item.quantity === "number" ? item.quantity : 0;
  const total = price * quantity;

  return (
    <div className="flex items-center gap-4">
      <Image
        src={item.image || "/placeholder.png"}
        alt={variantLabel || productName}
        width={56}
        height={72}
        className="object-cover rounded-md"
      />

      <div className="flex-1">
        <p className="text-sm font-medium">{productName}</p>

        {variantLabel && (
          <p className="text-xs text-muted">{variantLabel}</p>
        )}

        <p className="text-xs text-muted">
          Qty {quantity}
        </p>
      </div>

      <p className="text-sm font-medium">
        ₹{total.toLocaleString()}
      </p>
    </div>
  );
}

function OrderTimeline({ status }: { status: OrderStatus }) {
  const steps: OrderStatus[] = [
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "out_for_delivery",
    "delivered",
  ];

  const currentIndex = Math.max(0, steps.indexOf(status));

  return (
    <div className="flex items-center gap-3 pt-2">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full ${i <= currentIndex ? "bg-black" : "bg-border"
              }`}
          />
          {i < steps.length - 1 && (
            <span className="w-8 h-px bg-border" />
          )}
        </div>
      ))}
    </div>
  );
}
