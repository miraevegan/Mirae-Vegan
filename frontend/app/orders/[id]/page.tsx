"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import axios from "@/lib/axios";
import { loadRazorpay } from "@/lib/razorpay";
import { Order, OrderItem, OrderStatus } from "@/types/order";
import { RazorpayOptions, RazorpaySuccessResponse } from "@/types/razorpay";
import NavbarDefault from "@/components/layout/NavbarDefault";

/* ---------------- status colors ---------------- */
const statusStyles: Record<OrderStatus, string> = {
  pending: "text-yellow-600 bg-yellow-50 border-yellow-400",
  confirmed: "text-blue-600 bg-blue-50 border-blue-400",
  processing: "text-indigo-600 bg-indigo-50 border-indigo-400",
  shipped: "text-purple-600 bg-purple-50 border-purple-400",
  out_for_delivery: "text-orange-600 bg-orange-50 border-orange-400",
  delivered: "text-green-700 bg-green-50 border-green-500",
  cancelled: "text-red-600 bg-red-50 border-red-400",
};

export default function OrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ---------------- fetch order ---------------- */
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`/orders/${id}`);
        setOrder(res.data.order);
      } catch {
        setError("Unable to load order");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOrder();
  }, [id]);

  /* ---------------- retry payment ---------------- */
  const retryPayment = async () => {
    if (!order) return;

    try {
      setPaying(true);

      const paymentRes = await axios.post("/payments/razorpay/create", {
        orderId: order._id,
      });

      const paymentData = paymentRes.data;
      await loadRazorpay();

      const options: RazorpayOptions = {
        key: paymentData.key,
        amount: paymentData.amount,
        currency: "INR",
        name: "Miraé",
        description: "Complete your payment",
        order_id: paymentData.razorpayOrderId,
        handler: async (response: RazorpaySuccessResponse) => {
          await axios.post("/payments/razorpay/verify", {
            ...response,
            orderId: order._id,
          });
          router.refresh();
        },
        theme: { color: "#2E2A24" },
      };

      new window.Razorpay(options).open();
    } catch {
      alert("Payment retry failed");
    } finally {
      setPaying(false);
    }
  };

  /* ---------------- states ---------------- */
  if (loading) return <p className="p-10">Loading order...</p>;
  if (error || !order) return <p className="p-10">{error}</p>;

  const canRetryPayment =
    order.paymentMethod === "RAZORPAY" &&
    order.paymentStatus !== "paid";

  return (
    <>
      <NavbarDefault />
      <section className="max-w-6xl mx-auto px-6 py-14 space-y-4">
        {/* ---------- Header ---------- */}
        <div className="flex flex-wrap justify-between gap-4 items-start">
          <div>
            <h1 className="text-2xl font-light">
              Order #{order._id.slice(-6)}
            </h1>
            <p className="text-xs text-black/50">
              Placed on {new Date(order.createdAt).toLocaleString()}
            </p>
            <p className="text-xs text-black/50">
              Order ID: {order._id}
            </p>
          </div>

          <span
            className={`px-4 py-1 text-xs uppercase tracking-widest border rounded-full ${statusStyles[order.orderStatus]}`}
          >
            {order.orderStatus.replace(/_/g, " ")}
          </span>
        </div>

        {/* ---------- Shipping Info ---------- */}
        <div className="border rounded-xl p-6 space-y-2">
          <h2 className="text-xs uppercase tracking-widest text-black/50">
            Shipping Address
          </h2>

          <p className="text-sm font-medium">
            {order.shippingAddress.fullName}
          </p>
          <p className="text-sm">
            {order.shippingAddress.address}
          </p>
          <p className="text-sm">
            {order.shippingAddress.city}, {order.shippingAddress.state} –{" "}
            {order.shippingAddress.pincode}
          </p>
          <p className="text-sm">
            📞 {order.shippingAddress.phone}
          </p>
        </div>

        {/* ---------- Payment Info ---------- */}
        <div className="border rounded-xl p-6 space-y-3">
          <h2 className="text-xs uppercase tracking-widest text-black/50">
            Payment Details
          </h2>

          <div className="flex justify-between text-sm">
            <span>Method</span>
            <span className="font-medium">{order.paymentMethod}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Status</span>
            <span className="font-medium uppercase">
              {order.paymentStatus}
            </span>
          </div>

          {order.paymentResult?.razorpayPaymentId && (
            <div className="text-xs text-black/60 break-all">
              Razorpay Payment ID:{" "}
              {order.paymentResult.razorpayPaymentId}
            </div>
          )}

          {canRetryPayment && (
            <button
              onClick={retryPayment}
              disabled={paying}
              className="mt-4 px-6 py-3 bg-black text-white text-xs tracking-widest uppercase rounded-lg"
            >
              {paying ? "Opening Payment…" : "Retry Payment"}
            </button>
          )}
        </div>

        {/* ---------- Items ---------- */}
        <div className="border rounded-xl p-6 space-y-4">
          <h2 className="text-sm uppercase tracking-widest text-muted">
            Order Items
          </h2>

          {order.orderItems.map((item: OrderItem) => {
            const productName =
              typeof item.product === "string"
                ? "Product Name Unavailable"
                : item.product?.name ?? "Product Name Unavailable";

            return (
              <div key={typeof item.product === "string" ? item.product : item.product._id} className="flex gap-4 items-center border-b pb-4 last:border-b-0">
                <Image
                  src={item.image}
                  alt={productName}
                  width={70}
                  height={90}
                  className="object-cover rounded-md shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{productName}</p>
                  {item.variant?.label && (
                    <p className="text-xs text-muted opacity-60 truncate">{item.variant.label}</p>
                  )}
                  <p className="text-xs opacity-60">Qty {item.quantity}</p>
                </div>

                <p className="text-sm font-medium whitespace-nowrap">
                  ₹{(item.price ?? item.variant?.price ?? 0) * (item.quantity ?? 0)}
                </p>
              </div>
            );
          })}
        </div>

        {/* ---------- Price Summary ---------- */}
        <div className="border rounded-xl p-6 space-y-2 text-sm">
          <h2 className="text-sm uppercase tracking-widest text-muted mb-3">
            Price Summary
          </h2>

          <Row label="Items" value={`₹${order.itemsPrice}`} />
          <Row label="Tax" value={`₹${order.taxPrice}`} />
          <Row label="Shipping" value={`₹${order.shippingPrice}`} />

          <hr className="my-3" />

          <Row
            label="Total"
            value={`₹${order.totalPrice}`}
            bold
          />
        </div>
      </section>
    </>
  );
}

/* ---------- helpers ---------- */
function Row({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div className={`flex justify-between ${bold ? "font-medium" : ""}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
