"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { addressService } from "@/services/address.service";
import { Trash2, Check, Plus, Edit2 } from "lucide-react";
import AddressModal from "@/components/profile/AddressModal";
import type { Address } from "@/types/user";

export default function AddressList() {
  const { user, refreshProfile } = useAuth();

  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Address | null>(null);

  if (!user) return null;

  const addresses = user.addresses ?? [];

  async function handleMakeDefault(id: string) {
    try {
      setLoadingId(id);
      await addressService.setDefault(id);
      await refreshProfile();
    } finally {
      setLoadingId(null);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this address?")) return;

    try {
      setLoadingId(id);
      await addressService.deleteAddress(id);
      await refreshProfile();
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Addresses</h2>
          <p className="text-xs sm:text-sm text-gray-600">Manage your delivery addresses</p>
        </div>

        <button
          onClick={() => {
            setSelected(null);
            setOpen(true);
          }}
          className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-brand-primary hover:bg-brand-primary/90 transition"
        >
          <Plus size={18} />
          Add Address
        </button>
      </div>

      {/* Empty State */}
      {addresses.length === 0 && (
        <div className="p-12 text-center border-2 border-dashed border-gray-300">
          <p className="mb-6 text-base text-gray-500">
            You haven’t added any addresses yet.
          </p>
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-2 text-sm font-semibold text-white bg-brand-primary hover:bg-brand-primary/90 transition"
          >
            <Plus size={18} />
            Add your first address
          </button>
        </div>
      )}

      {/* Address Cards */}
      <div className="space-y-6">
        {addresses.map(addr => {
          const loading = loadingId === addr._id;

          return (
            <div
              key={addr._id}
              className="relative hover:border-brand-secondary hover:border p-6 shadow-sm hover:shadow-md transition cursor-default"
            >
              {/* Default Badge */}
              {addr.isDefault && (
                <span className="absolute top-4 right-4 px-3 py-1 text-xs font-semibold text-green-800 bg-green-100 select-none">
                  Default
                </span>
              )}

              {/* Address Info */}
              <div className="mb-4">
                <p className="text-lg font-semibold text-gray-900 truncate">{addr.fullName}</p>
                <p className="mt-1 text-sm text-gray-700">
                  {addr.street}, {addr.landmark && `${addr.landmark}, `}
                  {addr.city}, {addr.state} – {addr.pincode}
                </p>
                <p className="mt-1 text-sm text-gray-700">Phone: {addr.phone}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                {!addr.isDefault && (
                  <button
                    disabled={loading}
                    onClick={() => handleMakeDefault(addr._id)}
                    className="inline-flex items-center gap-1 px-3 py-1 text-sm font-semibold text-blue-700 bg-blue-100 hover:bg-blue-200 disabled:opacity-50 transition"
                  >
                    <Check size={16} />
                    Make Default
                  </button>
                )}

                <button
                  onClick={() => {
                    setSelected(addr);
                    setOpen(true);
                  }}
                  className="inline-flex hover:cursor-pointer items-center gap-1 px-3 py-1 text-sm font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition"
                >
                  <Edit2 size={16} />
                  Edit
                </button>

                <button
                  disabled={loading}
                  onClick={() => handleDelete(addr._id)}
                  className="inline-flex hover:cursor-pointer items-center gap-1 px-3 py-1 text-sm font-semibold text-red-700 bg-red-100 hover:bg-red-200 disabled:opacity-50 transition"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      <AddressModal
        open={open}
        address={selected ?? undefined}
        onClose={() => {
          setOpen(false);
          setSelected(null);
        }}
      />
    </div>
  );
}
