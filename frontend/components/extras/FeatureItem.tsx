"use client";

import { LucideIcon } from "lucide-react";

type Props = {
  icon: LucideIcon;
  title: string;
  subtitle: string;
};

export default function FeatureItem({ icon: Icon, title, subtitle }: Props) {
  return (
    <div className="flex flex-col items-center px-6 text-center">
      {/* Icon */}
      <div className="flex items-center justify-center mb-4 border rounded-full w-14 h-14 border-brand-primary">
        <Icon className="w-6 h-6 text-brand-primary" />
      </div>

      {/* Title */}
      <h4 className="text-sm font-semibold tracking-widest uppercase text-text-primary">
        {title}
      </h4>

      {/* Subtitle */}
      <p className="mt-2 text-sm leading-relaxed text-text-secondary">
        {subtitle}
      </p>
    </div>
  );
}
