/* ---------- Product Variant ---------- */
export interface ProductVariant {
  id: string;
  label?: string;
  price: number;
}

/* ---------- Order Item ---------- */
export interface OrderItem {
  product: string | { _id: string; name: string }; // can be string or populated object
  name?: string; // deprecated: prefer product.name from populated data
  price: number;
  quantity: number;
  image: string;
  variant?: ProductVariant;
}

/* ---------- Shipping Address ---------- */
export interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

/* ---------- Order Status ---------- */
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

/* ---------- Payment ---------- */
export type PaymentMethod = "UPI_MANUAL" | "RAZORPAY";
export type PaymentStatus = "pending" | "paid" | "failed";

/* ---------- Payment Result ---------- */
export interface PaymentResult {
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  razorpaySignature?: string;
  status?: string;
}

/* ---------- Order ---------- */
/* ---------- Order ---------- */
export interface Order {
  _id: string;
  user: string;

  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;

  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;

  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;

  isPaid: boolean;
  isDelivered: boolean;

  paidAt?: string;
  deliveredAt?: string;

  paymentResult?: PaymentResult;

  createdAt: string;
  updatedAt?: string;
}
