import NavbarDefault from "@/components/layout/NavbarDefault";

export default function CancellationRefundPage() {
  return (
    <>
    <NavbarDefault />
    <section className="max-w-5xl mx-auto px-6 py-20">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-light tracking-tight mb-4">
          Cancellation & Refund Policy
        </h1>
        <p className="text-sm text-text-muted max-w-2xl">
          We want you to feel confident shopping with Mirae Vegan. Please review
          our cancellation and refund guidelines below.
        </p>
      </div>

      {/* Content */}
      <div className="space-y-8">
        {/* Cancellation */}
        <div className="p-6 border border-border rounded-xl bg-surface">
          <h2 className="text-lg font-medium mb-2">Order Cancellation</h2>
          <p className="text-sm leading-relaxed text-text-muted">
            Orders may be cancelled within <strong>24 hours</strong> of being
            placed. Once an order has been shipped or dispatched, it can no
            longer be cancelled.
          </p>
        </div>

        {/* Returns */}
        <div className="p-6 border border-border rounded-xl bg-surface">
          <h2 className="text-lg font-medium mb-2">Returns</h2>
          <p className="text-sm leading-relaxed text-text-muted">
            Returns are accepted within <strong>7 days</strong> of delivery only
            if the product received is damaged, defective, or incorrect.
            Products must be unused and in their original packaging.
          </p>
        </div>

        {/* Refunds */}
        <div className="p-6 border border-border rounded-xl bg-surface">
          <h2 className="text-lg font-medium mb-2">Refunds</h2>
          <p className="text-sm leading-relaxed text-text-muted">
            Once your return is approved, refunds will be processed within{" "}
            <strong>7–10 business days</strong> to the original payment method.
            The time taken for the amount to reflect may vary depending on your
            bank or payment provider.
          </p>
        </div>

        {/* Non-refundable */}
        <div className="p-6 border border-border rounded-xl bg-surface">
          <h2 className="text-lg font-medium mb-2">Non-Refundable Items</h2>
          <p className="text-sm leading-relaxed text-text-muted">
            Certain items may not be eligible for return or refund due to hygiene,
            safety, or regulatory reasons. These exclusions will be clearly
            mentioned on the product page where applicable.
          </p>
        </div>
      </div>

      {/* Footer note */}
      <p className="mt-12 text-xs text-text-muted max-w-2xl">
        For any questions regarding cancellations, returns, or refunds, please
        contact our support team before initiating a request.
      </p>
    </section>
    </>
  );
}
