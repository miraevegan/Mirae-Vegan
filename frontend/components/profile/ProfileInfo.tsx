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

      <div className="flex items-center gap-4 mb-8">
        <div className="flex items-center justify-center w-14 h-14 text-lg font-semibold text-white rounded-full bg-brand-primary">
          {user.name[0]}
        </div>
        <div>
          <p className="font-medium">{user.name}</p>
          <p className="text-sm text-muted">{user.email}</p>
        </div>
      </div>


      <div className="max-w-md space-y-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 text-sm rounded-xl bg-muted/40 focus:bg-background focus:ring-2 focus:ring-brand-primary outline-none"
          placeholder="Full Name"
        />

        <input
          value={user.email}
          disabled
          className="w-full px-4 py-3 text-sm rounded-xl bg-muted/40 focus:bg-background focus:ring-2 focus:ring-brand-primary outline-none"
        />

        <button
          onClick={save}
          className="px-6 py-3 mt-4 text-sm font-medium text-white rounded-xl bg-brand-primary hover:opacity-90"        >
          Save Changes
        </button>
      </div>
    </>
  );
}
