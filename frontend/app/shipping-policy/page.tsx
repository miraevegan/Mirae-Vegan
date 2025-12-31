import NavbarDefault from "@/components/layout/NavbarDefault";

export default function ShippingPolicyPage() {
  return (
    <>
      <NavbarDefault />
      <section className="max-w-5xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-light tracking-tight mb-4">
            Shipping Policy
          </h1>
          <p className="text-sm text-text-muted max-w-2xl">
            At Mirae Vegan, we strive to deliver your orders safely, transparently,
            and within a reasonable timeframe.
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Timeline */}
          <div className="p-6 border border-border rounded-xl bg-surface">
            <h2 className="text-lg font-medium mb-2">Shipping Timeline</h2>
            <p className="text-sm leading-relaxed text-text-muted">
              Orders are typically processed within <strong>2–3 business days</strong>.
              Once dispatched, delivery usually takes{" "}
              <strong>10–15 business days</strong>, depending on your location and
              courier availability.
            </p>
          </div>

          {/* Charges */}
          <div className="p-6 border border-border rounded-xl bg-surface">
            <h2 className="text-lg font-medium mb-2">Shipping Charges</h2>
            <p className="text-sm leading-relaxed text-text-muted">
              Shipping charges, if applicable, are clearly displayed at checkout
              before payment is completed. Any promotional free-shipping offers
              will also be reflected there.
            </p>
          </div>

          {/* Tracking */}
          <div className="p-6 border border-border rounded-xl bg-surface">
            <h2 className="text-lg font-medium mb-2">Order Tracking</h2>
            <p className="text-sm leading-relaxed text-text-muted">
              Once your order is shipped, tracking details will be shared via
              email or SMS so you can monitor your shipment in real time.
            </p>
          </div>

          {/* Delays */}
          <div className="p-6 border border-border rounded-xl bg-surface">
            <h2 className="text-lg font-medium mb-2">Delivery Delays</h2>
            <p className="text-sm leading-relaxed text-text-muted">
              While we aim for timely delivery, delays may occur due to factors
              beyond our control such as weather conditions, logistical issues,
              public holidays, or regional restrictions.
            </p>
          </div>
        </div>

        {/* Footer note */}
        <p className="mt-12 text-xs text-text-muted max-w-2xl">
          For any shipping-related queries, please reach out to our support team.
          We’re always happy to help.
        </p>
      </section>
    </>
  );
}
