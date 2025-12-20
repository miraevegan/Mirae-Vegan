"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "@/lib/axios";
import Image from "next/image";
import type { Order, OrderStatus } from "@/types/order";

export default function OrderViewPage() {
  const params = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!params?.id) return;

    axios
      .get<{ success: boolean; order: Order }>(`/orders/${params.id}`)
      .then(res => setOrder(res.data.order));
  }, [params?.id]);

  if (!order) return null;

  return (
    <section className="max-w-3xl px-6 py-12 mx-auto">
      <h1 className="mb-2 text-2xl font-semibold">
        Order #{order._id.slice(-6)}
      </h1>

      <p className="mb-10 text-sm text-muted">
        {new Date(order.createdAt).toDateString()}
      </p>

      <OrderTimeline status={order.orderStatus} />

      <div className="mt-10 space-y-6">
        {order.orderItems.map(item => (
          <div key={item.product} className="flex gap-4">
            <Image
              src={item.image || "/images/hero_image.jpg"}
              alt={item.name}
              width={80}
              height={100}
              className="object-cover"
            />

            <div className="flex-1">
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-muted">
                Qty {item.quantity}
              </p>
            </div>

            <p className="text-sm">
              ₹{item.price * item.quantity}
            </p>
          </div>
        ))}
      </div>

      <div className="pt-8 mt-10 border-t">
        <p className="text-lg font-medium">
          Total: ₹{order.totalPrice}
        </p>
      </div>
    </section>
  );
}

/* ---------- Timeline ---------- */

function OrderTimeline({ status }: { status: OrderStatus }) {
  const steps: OrderStatus[] = [
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "out_for_delivery",
    "delivered",
  ];

  const currentIndex = steps.indexOf(status);

  return (
    <div className="flex items-center gap-3">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              i <= currentIndex ? "bg-black" : "bg-border"
            }`}
          />
          {i < steps.length - 1 && (
            <span className="w-10 h-px bg-border" />
          )}
        </div>
      ))}
    </div>
  );
}
