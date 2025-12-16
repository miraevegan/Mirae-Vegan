"use client";

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
        <nav className="p-4 border md:w-1/4 bg-surface">
          {([
            ["profile", "Profile Info"],
            ["password", "Change Password"],
            ["addresses", "Addresses"],
            ["orders", "Orders"],
          ] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`w-full px-4 py-2 mb-2 text-left ${
                activeTab === key
                  ? "bg-brand-primary text-white"
                  : "hover:bg-muted"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <section className="p-6 border md:flex-1 bg-background">
          {activeTab === "profile" && <ProfileInfo user={user} />}
          {activeTab === "password" && <ChangePassword />}
          {activeTab === "addresses" && <AddressList />}
          {activeTab === "orders" && <OrderList />}
        </section>
      </div>
    </div>
  );
}
