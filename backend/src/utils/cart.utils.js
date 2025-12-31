export const calculateCartTotals = (cartItems) => {
  let subtotal = 0;
  let discountTotal = 0;

  cartItems.forEach((item) => {
    const price = item.price || 0;
    const qty = item.quantity || 0;
    const discountPercent = item.discount?.percentage || 0;

    const itemTotal = price * qty;
    const itemDiscount = (itemTotal * discountPercent) / 100;

    subtotal += itemTotal;
    discountTotal += itemDiscount;
  });

  return {
    subtotal,
    discount: discountTotal,
    total: subtotal - discountTotal,
  };
};
