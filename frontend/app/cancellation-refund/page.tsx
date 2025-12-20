export default function CancellationRefundPage() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-semibold mb-6">Cancellation & Refund Policy</h1>

      <h2 className="text-xl font-medium mt-6 mb-2">Order Cancellation</h2>
      <p>
        Orders can be cancelled within <strong>24 hours</strong> of placing the order.
        Once the order is shipped, it cannot be cancelled.
      </p>

      <h2 className="text-xl font-medium mt-6 mb-2">Returns</h2>
      <p>
        Products can be returned within <strong>7 days</strong> of delivery if they are
        damaged, defective, or incorrect.
      </p>

      <h2 className="text-xl font-medium mt-6 mb-2">Refunds</h2>
      <p>
        Approved refunds will be processed within <strong>7–10 business days</strong>
        to the original payment method.
      </p>

      <h2 className="text-xl font-medium mt-6 mb-2">Non-Refundable Items</h2>
      <p>
        Certain items may not be eligible for return due to hygiene or safety reasons.
      </p>
    </section>
  );
}
