"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import NavbarDefault from "@/components/layout/NavbarDefault";
import { useCart } from "@/context/CartContext";
import { loadRazorpay } from "@/lib/razorpay";
import api from "@/lib/axios";
import type { Address } from "@/types/user";
import type { RazorpayOptions, RazorpaySuccessResponse } from "@/types/razorpay";
import { AxiosError } from "axios";

type AddressForm = Omit<Address, "_id" | "isDefault" | "landmark"> & {
  landmark?: string;
};

const LABEL_KEYS: (keyof AddressForm)[] = [
  "fullName",
  "phone",
  "street",
  "landmark",
  "city",
  "state",
  "pincode",
];

const LABELS: Record<keyof AddressForm, string> = {
  fullName: "Full Name",
  phone: "Phone Number",
  street: "Street Address",
  landmark: "Landmark",
  city: "City",
  state: "State",
  pincode: "Pincode",
};

const isValidPhone = (phone: string) => /^[6-9]\d{9}$/.test(phone);
const isValidPincode = (pin: string) => /^\d{6}$/.test(pin);

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, loading: cartLoading } = useCart();
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [addressMode, setAddressMode] = useState<"select" | "add">("add");
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [saveAddress, setSaveAddress] = useState(false);

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("appliedCoupon");
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);
      setAppliedCoupon(parsed.code);
      setCouponCode(parsed.code);
      setDiscountAmount(parsed.discountAmount);
    } catch {
      localStorage.removeItem("appliedCoupon");
    }
  }, []);

  const [address, setAddress] = useState<AddressForm>({
    fullName: "",
    phone: "",
    street: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
  });

  const isSelectMode = addressMode === "select";

  const switchToSelectMode = () => {
    setAddressMode("select");

    const fallback =
      savedAddresses.find(a => a.isDefault) || savedAddresses[0];

    if (fallback) {
      setSelectedAddressId(fallback._id!);
    }
  };


  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/auth/profile");
        const addresses: Address[] = res.data.user.addresses || [];

        setSavedAddresses(addresses);

        if (addresses.length > 0) {
          setAddressMode("select");
          const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];
          setSelectedAddressId(defaultAddr._id!);
        }
      } catch (err) {
        console.error("Profile fetch failed", err);
      }
    })();
  }, []);

  const onSelectSavedAddress = (id: string) => {
    setSelectedAddressId(id);
    setError(null);
  };

  const onAddressChange = (key: keyof AddressForm, value: string) => {
    setAddress(prev => ({ ...prev, [key]: value }));
  };

  const itemsPrice = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const taxPrice = 0;
  const totalPrice = Math.max(itemsPrice - discountAmount + taxPrice, 0);

  const isAddressValid =
    address.fullName.trim().length >= 2 &&
    isValidPhone(address.phone) &&
    isValidPincode(address.pincode) &&
    address.street.trim() &&
    address.city.trim() &&
    address.state.trim();

  if (couponLoading) return;

  const placeOrderAndPay = async () => {
    if (!cart.length) return setError("Cart is empty");

    if (!isSelectMode && !isAddressValid) {
      return setError("Please fill all shipping details correctly");
    }

    try {
      setLoading(true);
      setError(null);

      let finalShippingAddress: Address | AddressForm | undefined;

      if (isSelectMode) {
        finalShippingAddress = savedAddresses.find(
          a => a._id === selectedAddressId
        );
      } else {
        finalShippingAddress = address;

        if (saveAddress) {
          await api.post("/auth/address", {
            ...address,
            isDefault: true,
          });
        }
      }

      // ✅ CREATE ORDER ONLY ONCE
      let orderId = createdOrderId;

      if (!orderId) {
        const orderRes = await api.post("/orders/from-cart", {
          shippingAddress: finalShippingAddress,
          couponCode: appliedCoupon || null,
        });

        orderId = orderRes.data.order._id;
        setCreatedOrderId(orderId);
      }

      const paymentRes = await api.post("/payments/razorpay/create", {
        orderId,
      });

      await loadRazorpay();

      const options: RazorpayOptions = {
        key: paymentRes.data.key,
        amount: paymentRes.data.amount,
        currency: "INR",
        name: "Miraé Vegan",
        order_id: paymentRes.data.razorpayOrderId,

        handler: async (response: RazorpaySuccessResponse) => {
          await api.post("/payments/razorpay/verify", {
            ...response,
            orderId,
          });

          localStorage.removeItem("appliedCoupon");
          router.push(`/checkout/success?orderId=${orderId}`);
        },

        modal: {
          ondismiss: () => {
            console.log("❌ Razorpay modal closed");
            setLoading(false);
          },
        },

        theme: { color: "#224c2d" },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      console.error(err);
      setError("Payment failed. Please try again.");
      setLoading(false);
    }
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;

    try {
      setCouponLoading(true);
      setCouponError(null);

      const res = await api.post("/coupons/apply", {
        code: couponCode,
        cartTotal: itemsPrice,
      });

      setDiscountAmount(res.data.discountAmount);
      setAppliedCoupon(res.data.coupon);

      localStorage.setItem(
        "appliedCoupon",
        JSON.stringify({
          code: res.data.coupon,
          discountAmount: res.data.discountAmount,
        })
      );
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      setDiscountAmount(0);
      setAppliedCoupon(null);
      setCouponError(err.response?.data?.message || "Invalid coupon");
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setCouponCode("");
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponError(null);

    localStorage.removeItem("appliedCoupon");
  };

  if (cartLoading) return <p className="text-center py-20">Loading checkout…</p>;

  return (
    <>
      <NavbarDefault />

      <main className="max-w-7xl mx-auto px-4 py-12 grid lg:grid-cols-3 gap-12">
        {/* LEFT */}
        <section className="lg:col-span-2">
          {isSelectMode && (
            <>
              <h2 className="text-xl mb-6 uppercase text-brand-primary">Select Address</h2>

              <div className="space-y-3 mb-6">
                {savedAddresses.map(addr => (
                  <label key={addr._id} className="block border p-4 cursor-pointer border-brand-primary">
                    <input
                      type="radio"
                      checked={selectedAddressId === addr._id}
                      onChange={() => onSelectSavedAddress(addr._id!)}
                      className="mr-3"
                    />
                    <p className="font-medium">{addr.fullName}</p>
                    <p className="text-sm">{addr.street}</p>
                  </label>
                ))}
              </div>

              <button
                onClick={() => setAddressMode("add")}
                className="text-sm bg-brand-primary text-background px-4 py-2 hover:bg-hover hover:cursor-pointer"
              >
                + Add New Address
              </button>
            </>
          )}

          {!isSelectMode && (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl uppercase">Add Shipping Address</h2>

                {savedAddresses.length > 0 && (
                  <button
                    onClick={switchToSelectMode}
                    className="text-sm bg-brand-primary text-background px-4 py-2 hover:bg-hover hover:cursor-pointer"
                  >
                    ← Back To Saved Addresses
                  </button>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {LABEL_KEYS.map(key => (
                  <div
                    key={key}
                    className={key === "street" || key === "landmark" ? "sm:col-span-2" : ""}
                  >
                    <label className="text-xs uppercase text-black/60">
                      {LABELS[key]}
                    </label>
                    <input
                      value={address[key] || ""}
                      onChange={e => onAddressChange(key, e.target.value)}
                      className="w-full border-b py-3 bg-transparent"
                    />
                  </div>
                ))}
              </div>

              <label className="inline-flex items-center mt-4">
                <input
                  type="checkbox"
                  checked={saveAddress}
                  onChange={() => setSaveAddress(p => !p)}
                  className="mr-2"
                />
                Save this address
              </label>
            </>
          )}
        </section>

        {/* RIGHT */}
        <div className="">
          {/* Coupon */}
          <div className="">
            <div className="mb-6 border p-6 h-fit">
              <label className="text-xs uppercase text-black/60">
                Coupon Code
              </label>

              <div className="flex gap-2 mt-2">
                <input
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="ENTER CODE"
                  disabled={!!appliedCoupon}
                  className="flex-1 border-b py-2 bg-transparent uppercase disabled:opacity-60"
                />

                <button
                  onClick={applyCoupon}
                  disabled={couponLoading || !!appliedCoupon}
                  className="px-4 py-2 bg-brand-primary text-background text-xs hover:bg-hover disabled:opacity-50"
                >
                  {couponLoading ? "Applying…" : "Apply"}
                </button>
              </div>

              {couponError && (
                <p className="text-xs text-red-600 mt-1">{couponError}</p>
              )}

              <div className="flex justify-between mt-2">
                {discountAmount > 0 && (
                  <p className="text-xs text-green-700 mt-1">
                    {couponCode} (Applied) − ₹{discountAmount}
                  </p>
                )}

                {appliedCoupon && (
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-error hover:cursor-pointer underline mt-1"
                  >
                    Remove coupon
                  </button>
                )}
              </div>
            </div>
          </div>
          <h2 className="text-xl mb-2 uppercase text-brand-primary">Order Summary</h2>
          <aside className="border p-6 h-fit">
            <h2 className="text-md font-semibold">Order Items</h2>
            {cart.map(item => (
              <div
                key={item.productId}
                className="flex justify-between text-sm mb-2"
              >
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}

            <hr className="my-4" />

            <div className="flex justify-between text-sm mb-1">
              <span>Items</span>
              <span>₹{itemsPrice}</span>
            </div>

            <div className="flex justify-between text-sm mb-1">
              <span>Tax (5%)</span>
              <span>₹{taxPrice}</span>
            </div>

            <div className="flex justify-between text-sm mb-1">
              <span className="text-success">{couponCode} Applied</span>
              <span>-₹{discountAmount}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span className="text-green-700">Free</span>
            </div>

            <div className="flex justify-between font-medium mt-4">
              <span>Total</span>
              <span>₹{totalPrice}</span>
            </div>

            {error && (
              <p className="text-red-600 text-xs mt-3">{error}</p>
            )}

            <button
              onClick={placeOrderAndPay}
              disabled={loading}
              className="w-full mt-6 py-4 bg-brand-primary text-background disabled:opacity-40 hover:bg-hover hover:cursor-pointer"
            >
              {loading ? "Processing…" : "Pay Securely"}
            </button>
          </aside>
        </div>
      </main>
    </>
  );
}
