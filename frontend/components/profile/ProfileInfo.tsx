"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

type Props = {
  user: {
    name: string;
    email: string;
  };
};

export default function ProfileInfo({ user }: Props) {
  const { refreshProfile } = useAuth();

  const [name, setName] = useState(user.name);

  async function save() {
    // await api.put("/auth/profile", { name });
    alert("Profile updated");
    refreshProfile();
  }

  return (
    <>
      <h2 className="mb-6 text-xl font-semibold">Profile Info</h2>

      <div className="max-w-md space-y-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border"
          placeholder="Full Name"
        />

        <input
          value={user.email}
          disabled
          className="w-full px-3 py-2 border bg-muted"
        />

        <button
          onClick={save}
          className="px-6 py-2 text-white bg-brand-primary"
        >
          Save Changes
        </button>
      </div>
    </>
  );
}
