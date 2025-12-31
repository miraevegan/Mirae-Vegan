"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

import AddressForm, { AddressFormValues } from "./AddressForm";
import { addressService } from "@/services/address.service";
import { useAuth } from "@/context/AuthContext";
import type { Address } from "@/types/user";

type Props = {
  open: boolean;
  onClose: () => void;
  address?: Address;
};

export default function AddressModal({ open, onClose, address }: Props) {
  const { refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);

  // Close on Escape key press for accessibility
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = async (data: AddressFormValues) => {
    setLoading(true);

    try {
      if (address?._id) {
        await addressService.updateAddress(address._id, data);
      } else {
        await addressService.addAddress(data);
      }

      await refreshProfile();
      onClose();
    } catch (error) {
      // You may want to add error handling here
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
      aria-labelledby="address-modal-title"
    >
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-lg p-6 bg-surface z-10"
        style={{ color: "var(--text-primary)" }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3
            id="address-modal-title"
            className="text-lg font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            {address ? "Edit Address" : "Add New Address"}
          </h3>

          <button
            onClick={onClose}
            aria-label="Close address form"
            className="text-muted hover:text-text-primary transition"
            style={{ color: "var(--text-secondary)" }}
          >
            <X size={20} />
          </button>
        </div>

        <AddressForm
          initialData={address}
          loading={loading}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
