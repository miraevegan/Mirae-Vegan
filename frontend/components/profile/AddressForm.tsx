"use client";

import { useState } from "react";

export type AddressFormValues = {
  fullName: string;
  phone: string;
  street: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
};

type Props = {
  initialData?: Partial<AddressFormValues>;
  loading?: boolean;
  onSubmit: (data: AddressFormValues) => Promise<void>;
};

export default function AddressForm({
  initialData = {},
  loading,
  onSubmit,
}: Props) {
  const [form, setForm] = useState<AddressFormValues>({
    fullName: initialData.fullName ?? "",
    phone: initialData.phone ?? "",
    street: initialData.street ?? "",
    landmark: initialData.landmark ?? "",
    city: initialData.city ?? "",
    state: initialData.state ?? "",
    pincode: initialData.pincode ?? "",
    isDefault: initialData.isDefault ?? false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.currentTarget;

    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox"
        ? (e.currentTarget as HTMLInputElement).checked
        : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} />
      <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} />
      <Textarea label="Street Address" name="street" value={form.street} onChange={handleChange} />
      <Input label="Landmark (optional)" name="landmark" value={form.landmark} onChange={handleChange} />
      <div className="grid grid-cols-2 gap-4">
        <Input label="City" name="city" value={form.city} onChange={handleChange} />
        <Input label="State" name="state" value={form.state} onChange={handleChange} />
      </div>
      <Input label="Pincode" name="pincode" value={form.pincode} onChange={handleChange} />

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="isDefault"
          checked={form.isDefault}
          onChange={handleChange}
        />
        Set as default address
      </label>

      <button
        disabled={loading}
        type="submit"
        className="w-full py-2 text-white bg-black rounded-lg hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save Address"}
      </button>
    </form>
  );
}

/* Small reusable inputs */
type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

function Input({ label, ...props }: InputProps) {
  return (
    <div>
      <label className="block mb-1 text-sm font-medium">{label}</label>
      <input
        {...props}
        className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
      />
    </div>
  );
}

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
};

function Textarea({ label, ...props }: TextareaProps) {
  return (
    <div>
      <label className="block mb-1 text-sm font-medium">{label}</label>
      <textarea
        {...props}
        rows={3}
        className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
      />
    </div>
  );
}
