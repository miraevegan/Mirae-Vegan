import NavbarDefault from "@/components/layout/NavbarDefault";

export default function TermsAndConditionsPage() {
  return (
    <>
      <NavbarDefault />
      <section className="max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-3xl font-semibold mb-3">Terms & Conditions</h1>
          <p className="text-sm opacity-70 leading-relaxed">
            These Terms & Conditions govern your use of the Mirae Vegan website and
            services. By accessing or placing an order, you agree to the terms
            outlined below.
          </p>
        </header>

        {/* Content */}
        <div className="space-y-8 text-sm leading-relaxed">
          {/* Products & Pricing */}
          <section>
            <h2 className="text-lg font-medium mb-2">Products & Pricing</h2>
            <p>
              All products listed on the Mirae Vegan website are subject to
              availability. Prices are displayed in INR and may change without
              prior notice due to promotions, updates, or market conditions.
            </p>
          </section>

          {/* Order Acceptance */}
          <section>
            <h2 className="text-lg font-medium mb-2">Order Acceptance</h2>
            <p>
              Placing an order does not guarantee acceptance. We reserve the right
              to cancel or limit orders due to stock unavailability, pricing
              errors, or suspected fraudulent activity.
            </p>
          </section>

          {/* Payments */}
          <section>
            <h2 className="text-lg font-medium mb-2">Payments</h2>
            <p>
              All payments must be completed through our approved payment
              gateways. Mirae Vegan does not store your card or payment details.
              Transactions are processed securely by third-party providers.
            </p>
          </section>

          {/* User Responsibilities */}
          <section>
            <h2 className="text-lg font-medium mb-2">User Responsibilities</h2>
            <p>
              You agree to provide accurate information during checkout and
              account creation. Any misuse of the website, including fraudulent
              transactions or harmful activity, may result in account suspension
              or legal action.
            </p>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-lg font-medium mb-2">Intellectual Property</h2>
            <p>
              All website content including logos, images, product designs, text,
              and branding are the intellectual property of Mirae Vegan. Unauthorized
              use, reproduction, or distribution is strictly prohibited.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-lg font-medium mb-2">Limitation of Liability</h2>
            <p>
              Mirae Vegan shall not be held liable for indirect, incidental, or
              consequential damages arising from the use of our products or
              website, except as required by applicable law.
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-lg font-medium mb-2">Governing Law</h2>
            <p>
              These Terms & Conditions are governed and interpreted in accordance
              with the laws of India. Any disputes shall be subject to the
              jurisdiction of courts in India.
            </p>
          </section>

          {/* Contact */}
          <section className="pt-6 border-t border-border">
            <p className="text-xs opacity-70">
              For any questions regarding these Terms & Conditions, please contact
              us at{" "}
              <span className="font-medium">support@miraevegan.com</span>.
            </p>
          </section>
        </div>
      </section>
    </>
  );
}
