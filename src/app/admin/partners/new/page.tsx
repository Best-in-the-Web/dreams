"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewPartnerPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    businessName: "",
    propertyName: "",
    contactPerson: "",
    phone: "",
    email: "",
    address: "",
    lat: "",
    lng: "",
    status: "LEAD",
    commissionPercent: "15",
  });
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/partners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed");
      return;
    }
    router.push(`/admin/partners/${data.partner.id}`);
  };

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-3xl font-semibold text-forest">New partner</h1>
      <form onSubmit={submit} className="mt-6 space-y-3">
        {(
          [
            ["businessName", "Business name"],
            ["propertyName", "Property name"],
            ["contactPerson", "Contact person"],
            ["phone", "Phone"],
            ["email", "Email"],
            ["address", "Address"],
            ["lat", "Latitude"],
            ["lng", "Longitude"],
            ["commissionPercent", "Commission %"],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="block text-xs font-semibold uppercase text-moss">
            {label}
            <input
              required={!["propertyName", "lat", "lng"].includes(key)}
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className="mt-1 w-full rounded-xl border border-mist px-3 py-2 text-sm font-normal text-ink"
            />
          </label>
        ))}
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button type="submit" className="rounded-xl bg-forest px-5 py-3 text-sm font-semibold text-cream">
          Create partner
        </button>
      </form>
    </div>
  );
}
