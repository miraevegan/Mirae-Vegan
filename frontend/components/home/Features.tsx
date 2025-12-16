"use client";

import FeatureItem from "../extras/FeatureItem";
import {
  Truck,
  ShieldCheck,
  Package,
  RefreshCcw,
} from "lucide-react";

const FEATURES = [
  {
    icon: Truck,
    title: "Fast Delivery",
    subtitle: "Get Your Order Within 10-15 Days",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payments",
    subtitle: "100% Secure Payment Gateways",
  },
  {
    icon: Package,
    title: "Premium Quality",
    subtitle: "Crafted With High Quality Materials",
  },
  {
    icon: RefreshCcw,
    title: "Easy Returns",
    subtitle: "Hassle-free Returns Within 7 Days",
  },
];

export default function FeaturesSection() {
  return (
    <section className="px-10 py-20 mx-auto">
      <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((feature) => (
          <FeatureItem
            key={feature.title}
            icon={feature.icon}
            title={feature.title}
            subtitle={feature.subtitle}
          />
        ))}
      </div>
    </section>
  );
}
