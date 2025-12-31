"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import ProfileInfo from "./ProfileInfo";
import ChangePassword from "./ChangePassword";
import AddressList from "./AddressList";
import OrderList from "./OrderList";

type Tab = "profile" | "password" | "addresses" | "orders";

export default function ProfileLayout() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  if (!user) return null;

  return (
    <div className="max-w-6xl px-4 py-20 mx-auto">
      <h1 className="mb-8 text-3xl font-semibold font-brand">My Profile</h1>

      <div className="flex flex-col gap-8 md:flex-row">
        {/* Sidebar */}
        <nav className="md:w-1/4">
          <div className="sticky p-2 top-28 rounded-2xl bg-muted/40">
            {([
              ["profile", "Profile Info"],
              ["password", "Change Password"],
              ["addresses", "Addresses"],
              ["orders", "Orders"],
            ] as const).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`w-full px-4 py-3 mb-1 rounded-xl text-left text-sm font-medium transition
                    ${activeTab === key
                    ? "bg-brand-primary text-white shadow-sm"
                    : "text-muted hover:bg-background hover:text-foreground"
                  }`}
              >
                {label}
              </button>
            ))}
          </div>
        </nav>

        {/* Content */}
        <section className="md:flex-1">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >          {activeTab === "profile" && <ProfileInfo user={user} />}
            {activeTab === "password" && <ChangePassword />}
            {activeTab === "addresses" && <AddressList />}
            {activeTab === "orders" && <OrderList />}
          </motion.div>
        </section>
      </div>
    </div>
  );
}
