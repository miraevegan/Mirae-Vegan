import PDFDocument from "pdfkit";
import path from "path";

export const generateInvoiceBuffer = async (order) => {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));

    /* ---------- FONTS ---------- */
    const fontPath = path.resolve("src/assets/fonts");

    doc.registerFont("Regular", `${fontPath}/Inter_28pt-Regular.ttf`);
    doc.registerFont("Bold", `${fontPath}/Inter_28pt-Bold.ttf`);

    const money = (n) => `₹${Number(n).toFixed(2)}`;

    /* ---------- HEADER ---------- */
    doc.font("Bold").fontSize(22).text("Miraé Vegan");
    doc.font("Regular").fontSize(10).text("Premium Plant-Based Essentials");

    doc.moveDown();
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();

    /* ---------- META ---------- */
    doc.fontSize(10).font("Regular");
    doc.text(`Invoice #: ${order._id}`);
    doc.text(
      `Order Date: ${new Date(order.createdAt).toLocaleDateString("en-IN")}`
    );
    doc.text(`Payment Status: ${order.paymentStatus.toUpperCase()}`);
    doc.moveDown();

    /* ---------- CUSTOMER ---------- */
    doc.font("Bold").text("Billed To");
    doc.font("Regular").text(order.shippingAddress.fullName);
    doc.text(order.shippingAddress.address);
    doc.moveDown();

    /* ---------- TABLE HEADER ---------- */
    const headerY = doc.y;
    doc.font("Bold");
    doc.text("Item / Variant", 50, headerY);
    doc.text("Qty", 300, headerY);
    doc.text("Price", 360, headerY);
    doc.text("Total", 450, headerY);

    doc.moveDown(0.5);
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.5);

    /* ---------- ITEMS ---------- */
    doc.font("Regular");

    order.orderItems.forEach((item) => {
      const y = doc.y;

      const name = item.product?.name ?? "Product";
      const variantLabel = item.variant?.label ?? "";
      const price = Number(item.variant?.price ?? 0);
      const qty = Number(item.quantity ?? 1);
      const total = price * qty;

      doc.text(`${name}\n${variantLabel}`, 50, y, { width: 230 });
      doc.text(String(qty), 300, y);
      doc.text(money(price), 360, y);
      doc.text(money(total), 450, y);

      doc.moveDown();
    });

    /* ---------- TOTAL ---------- */
    doc.moveDown();
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();

    doc.font("Bold").text(
      `Grand Total: ${money(order.totalPrice)}`,
      { align: "right" }
    );

    /* ---------- FOOTER ---------- */
    doc.moveDown(2);
    doc.fontSize(9).font("Regular").text(
      "This is a system generated invoice. For support contact support@miraevegan.com",
      { align: "center" }
    );

    doc.end();
  });
};
