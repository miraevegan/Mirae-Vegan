"use client";

import NavbarDefault from "@/components/layout/NavbarDefault";

export default function PrivacyPolicyPage() {
  return (
    <>
      <NavbarDefault />

      {/* HERO */}
      <section className="bg-surface-canvas px-6 pt-28 pb-20">
        <div className="max-w-6xl mx-auto">

          <p className="text-xs tracking-[0.3em] uppercase text-text-secondary mb-4">
            Legal
          </p>

          <h1 className="text-5xl md:text-6xl font-highlight uppercase text-brand-primary leading-tight max-w-3xl">
            Your Privacy Matters.
          </h1>

          <p className="mt-6 text-lg text-text-secondary max-w-2xl">
            Miraé Vegan is committed to protecting your personal data and
            maintaining transparency in how your information is used.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="bg-surface-canvas px-6 pb-32">
        <div className="max-w-4xl mx-auto space-y-24">

          {/* BLOCK */}
          <div>
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              Information We Collect
            </h2>
            <p className="text-text-secondary leading-relaxed">
              When you interact with Miraé Vegan, we may collect personal
              information such as your name, email address, contact details,
              shipping information, and order history. This data helps us
              provide a seamless and personalized shopping experience.
            </p>
          </div>

          <div className="h-px bg-border" />

          {/* BLOCK */}
          <div>
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              How Your Information Is Used
            </h2>
            <p className="text-text-secondary leading-relaxed">
              Your information is used strictly to process orders, manage your
              account, provide customer support, improve our services, and
              communicate essential updates. We never sell or trade your data.
            </p>
          </div>

          <div className="h-px bg-border" />

          {/* BLOCK */}
          <div>
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              Payments & Security
            </h2>
            <p className="text-text-secondary leading-relaxed">
              All payments are handled by secure third-party payment gateways.
              Miraé Vegan does not store card or UPI details. Industry-standard
              security measures are used to safeguard all data.
            </p>
          </div>

          <div className="h-px bg-border" />

          {/* BLOCK */}
          <div>
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              Cookies & Tracking
            </h2>
            <p className="text-text-secondary leading-relaxed">
              We use cookies to maintain sessions, enhance functionality, and
              understand user interactions. You can control cookie preferences
              through your browser settings.
            </p>
          </div>

          <div className="h-px bg-border" />

          {/* BLOCK */}
          <div>
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              Your Rights
            </h2>
            <p className="text-text-secondary leading-relaxed">
              You have the right to access, update, or request deletion of your
              personal information at any time. For any privacy-related
              concerns, please contact us.
            </p>

            <p className="mt-4 text-text-primary font-medium">
              support@miraevegan.com
            </p>
          </div>

        </div>
      </section>
    </>
  );
}
