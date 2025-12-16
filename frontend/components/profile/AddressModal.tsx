"use client";

import { useState } from "react";
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

  if (!open) return null;

  const handleSubmit = async (data: AddressFormValues) => {
    setLoading(true);

    if (address?._id) {
      await addressService.updateAddress(address._id, data);
    } else {
      await addressService.addAddress(data);
    }

    await refreshProfile();
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg p-6 bg-white rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            {address ? "Edit Address" : "Add New Address"}
          </h3>

          <button onClick={onClose}>
            <X />
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
