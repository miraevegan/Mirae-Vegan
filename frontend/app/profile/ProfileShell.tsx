"use client";

import { useEffect, useState } from "react";
import ProfileNav from "./ProfileNav";
import AccountSection from "./sections/AccountSection";
import SecuritySection from "./sections/SecuritySection";
import OrdersSection from "./sections/OrdersSection";
import AddressSection from "./sections/AddressSection";
import { motion } from "framer-motion";
import axios from "@/lib/axios";
import type { Order } from "@/types/order";

type Tab = "account" | "security" | "orders" | "addresses";

export default function ProfileShell() {
  const [tab, setTab] = useState<Tab>("account");
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    axios
      .get<{ orders: Order[] }>("/orders/my")
      .then((res) => setOrders(res.data.orders ?? []))
      .finally(() => setOrdersLoading(false));
  }, []);

  const activeOrdersCount = orders.filter(
    (o) => o.orderStatus !== "delivered" && o.orderStatus !== "cancelled"
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 sm:pt-18 sm:pb-24">
      <div className="grid gap-10 md:grid-cols-[260px_1fr]">
        <ProfileNav
          active={tab}
          onChange={setTab}
          activeOrdersCount={activeOrdersCount}
        />

        <motion.div
          key={tab}
          layout
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {tab === "account" && <AccountSection />}
          {tab === "security" && <SecuritySection />}
          {tab === "orders" && (
            <OrdersSection orders={orders} loading={ordersLoading} />
          )}
          {tab === "addresses" && <AddressSection />}
        </motion.div>
      </div>
    </div>
  );
}
