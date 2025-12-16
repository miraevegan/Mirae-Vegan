"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { addressService } from "@/services/address.service";
import { Trash2, Check } from "lucide-react";
import AddressModal from "./AddressModal";
import type { Address } from "@/types/user";

export default function AddressList() {
  const { user, refreshProfile } = useAuth();

  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Address | null>(null);

  if (!user) return null;

  const addresses = user.addresses ?? [];

  const handleMakeDefault = async (id: string) => {
    setLoadingId(id);
    await addressService.setDefault(id);
    await refreshProfile();
    setLoadingId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this address?")) return;

    setLoadingId(id);
    await addressService.deleteAddress(id);
    await refreshProfile();
    setLoadingId(null);
  };

  return (
    <section>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Saved Addresses</h2>

        <button
          onClick={() => {
            setSelected(null);
            setOpen(true);
          }}
          className="px-4 py-2 text-sm font-medium border text-brand-primary border-brand-primary hover:text-background hover:bg-brand-primary"
        >
          Add Address
        </button>
      </div>

      {/* Empty State */}
      {addresses.length === 0 && (
        <div className="p-6 text-sm text-center border border-dashed text-muted">
          No addresses added yet
        </div>
      )}

      {/* Address Cards */}
      <div className="space-y-4">
        {addresses.map(addr => (
          <div
            key={addr._id}
            className="flex flex-col gap-4 p-4 border sm:flex-row sm:items-start sm:justify-between"
          >
            {/* Left */}
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium">{addr.fullName}</p>

                {addr.isDefault && (
                  <span className="px-2 py-0.5 text-xs text-green-700 bg-green-100">
                    Default
                  </span>
                )}
              </div>

              <p className="mt-1 text-sm text-muted">
                {addr.street}, {addr.city}, {addr.state} – {addr.pincode}
              </p>

              <p className="mt-1 text-sm text-muted">
                Phone: {addr.phone}
              </p>
            </div>

            {/* Actions */}
            <div className="flex self-end gap-3 sm:self-center">
              {!addr.isDefault && (
                <button
                  disabled={loadingId === addr._id}
                  onClick={() => handleMakeDefault(addr._id)}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:underline disabled:opacity-50"
                >
                  <Check size={14} />
                  Make default
                </button>
              )}

              <button
                onClick={() => {
                  setSelected(addr);
                  setOpen(true);
                }}
                className="text-sm text-gray-700 hover:underline"
              >
                Edit
              </button>

              <button
                disabled={loadingId === addr._id}
                onClick={() => handleDelete(addr._id)}
                className="flex items-center gap-1 text-sm text-red-600 hover:underline disabled:opacity-50"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal (render once) */}
      <AddressModal
        open={open}
        address={selected ?? undefined}
        onClose={() => {
          setOpen(false);
          setSelected(null);
        }}
      />
    </section>
  );
}
