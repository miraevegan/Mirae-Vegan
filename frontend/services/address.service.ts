import axios from "@/lib/axios";
import type { Address } from "@/types/user";
import type { AddressFormValues } from "@/components/profile/AddressForm";

export const addressService = {
  addAddress: (data: AddressFormValues): Promise<{
    success: boolean;
    message: string;
    addresses: Address[];
  }> =>
    axios.post("/auth/address", data).then(res => res.data),

  updateAddress: (
    id: string,
    data: AddressFormValues
  ): Promise<{
    success: boolean;
    message: string;
    addresses: Address[];
  }> =>
    axios.put(`/auth/address/${id}`, data).then(res => res.data),

  deleteAddress: (id: string): Promise<{
    success: boolean;
    message: string;
    addresses: Address[];
  }> =>
    axios.delete(`/auth/address/${id}`).then(res => res.data),

  setDefault: (id: string): Promise<{
    success: boolean;
    message: string;
    addresses: Address[];
  }> =>
    axios.put(`/auth/address/default/${id}`).then(res => res.data),
};
