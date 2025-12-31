"use client";

import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { User, Lock, MapPin, Package } from "lucide-react";

const tabs = [
    { id: "account", label: "Account", icon: User },
    { id: "security", label: "Security", icon: Lock },
    { id: "addresses", label: "Addresses", icon: MapPin },
    { id: "orders", label: "Orders", icon: Package },
] as const;

type TabId = (typeof tabs)[number]["id"];

type ProfileNavProps = {
    active: TabId;
    onChange: (id: TabId) => void;
    activeOrdersCount?: number;
};

export default function ProfileNav({
    active,
    onChange,
    activeOrdersCount = 0,
}: ProfileNavProps) {
    const { user } = useAuth();

    if (!user) return null;

    const initial = user.name?.trim()?.charAt(0)?.toUpperCase() ?? "U";

    return (
        <>
            {/* DESKTOP SIDEBAR */}
            <aside className="hidden md:block md:sticky md:top-28">
                {/* Profile Header */}
                <div className="flex items-center gap-4 mb-8">
                    <div
                        className="flex items-center justify-center w-12 h-12 text-lg font-semibold shrink-0 cursor-default"
                        style={{
                            backgroundColor: "var(--brand-primary)",
                            color: "var(--text-inverse)",
                            userSelect: "none",
                        }}
                    >
                        {initial}
                    </div>

                    <div className="min-w-0">
                        <p
                            className="text-sm font-medium truncate"
                            style={{ color: "var(--text-primary)" }}
                        >
                            {user.name}
                        </p>
                        <p
                            className="text-xs truncate select-none"
                            style={{ color: "var(--text-secondary)" }}
                        >
                            {user.email}
                        </p>
                    </div>
                </div>

                {/* Nav */}
                <nav className="relative flex flex-col gap-1">
                    {tabs.map((tab) => {
                        const isActive = active === tab.id;
                        const Icon = tab.icon;

                        return (
                            <button
                                key={tab.id}
                                onClick={() => onChange(tab.id)}
                                className="relative px-6 py-3 text-sm tracking-widest flex items-center gap-3 transition cursor-pointer"
                                style={{
                                    backgroundColor: isActive ? "var(--brand-primary)" : "var(--background)",
                                    color: isActive ? "var(--text-inverse)" : "var(--brand-primary)",
                                    userSelect: "none",
                                }}
                            >
                                {/* Animated pill */}
                                {isActive && (
                                    <motion.div
                                        layoutId="profileTab"
                                        className="absolute inset-0"
                                        style={{ backgroundColor: "var(--brand-primary)" }}
                                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                    />
                                )}

                                <span className="relative z-10 flex items-center gap-3 text-sm">
                                    <Icon
                                        size={16}
                                        style={{ color: isActive ? "var(--text-inverse)" : "var(--brand-primary)" }}
                                    />
                                    <span>{tab.label}</span>

                                    {/* Orders badge */}
                                    {tab.id === "orders" && activeOrdersCount > 0 && (
                                        <span
                                            className="ml-auto text-xs px-2 py-0.5 font-medium"
                                            style={{
                                                backgroundColor: "var(--text-inverse)",
                                                color: "var(--brand-primary)",
                                            }}
                                        >
                                            {activeOrdersCount}
                                        </span>
                                    )}
                                </span>
                            </button>
                        );
                    })}
                </nav>
            </aside>

            {/* MOBILE BOTTOM TABS */}
            <nav
                className="fixed bottom-0 left-0 right-0 z-50 border-t flex md:hidden"
                style={{
                    backgroundColor: "var(--surface-canvas)",
                    borderColor: "var(--ui-border)",
                }}
            >
                {tabs.map((tab) => {
                    const isActive = active === tab.id;
                    const Icon = tab.icon;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => onChange(tab.id)}
                            className="relative flex-1 flex flex-col items-center justify-center py-3 text-xs tracking-widest cursor-pointer"
                            style={{
                                color: isActive ? "var(--brand-primary)" : "var(--text-secondary)",
                                backgroundColor: isActive ? "var(--brand-primary)10" : "transparent",
                                userSelect: "none",
                            }}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="mobileTab"
                                    className="absolute inset-0"
                                    style={{ backgroundColor: "var(--brand-primary)10" }}
                                />
                            )}

                            <Icon
                                size={20}
                                style={{ color: isActive ? "var(--brand-primary)" : "var(--text-secondary)" }}
                            />

                            <span className={isActive ? "font-medium mt-1" : "mt-1"}>
                                {tab.label}
                            </span>

                            {/* Orders badge */}
                            {tab.id === "orders" && activeOrdersCount > 0 && (
                                <span
                                    className="absolute top-1 right-5 h-5 min-w-5 px-1 flex items-center justify-center text-xs font-medium"
                                    style={{
                                        backgroundColor: "var(--brand-primary)",
                                        color: "var(--text-inverse)",
                                        borderRadius: 9999,
                                    }}
                                >
                                    {activeOrdersCount}
                                </span>
                            )}
                        </button>
                    );
                })}
            </nav>
        </>
    );
}
