"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatPrice, getThisWeekend, nightsBetween } from "@/lib/utils";

type Pkg = { id: string; name: string; priceCzk: number; nights: number };

export function BookingWidget({
  propertyId,
  slug,
  basePrice,
  packages,
  defaultCheckIn,
  defaultCheckOut,
  capacity,
}: {
  propertyId: string;
  slug: string;
  basePrice: number;
  packages: Pkg[];
  defaultCheckIn?: string;
  defaultCheckOut?: string;
  capacity: number;
}) {
  const weekend = getThisWeekend();
  const [checkIn, setCheckIn] = useState(defaultCheckIn || weekend.checkIn);
  const [checkOut, setCheckOut] = useState(defaultCheckOut || weekend.checkOut);
  const [packageId, setPackageId] = useState(packages[0]?.id || "");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [pets, setPets] = useState(0);
  const [step, setStep] = useState<"select" | "details">("select");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const selectedPkg = packages.find((p) => p.id === packageId);
  const nights = nightsBetween(checkIn, checkOut);
  const accommodation = selectedPkg ? selectedPkg.priceCzk : basePrice * nights;
  const taxes = Math.round(accommodation * 0.1);
  const total = accommodation + taxes;

  const book = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId,
          packageId: packageId || null,
          checkIn,
          checkOut,
          adults,
          children,
          pets,
          guestName,
          guestEmail,
          guestPhone,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Booking failed");
      router.push(data.checkoutUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sticky top-6 rounded-3xl border border-mist bg-cream p-5 shadow-lg">
      <p className="font-display text-2xl font-semibold text-forest">
        {formatPrice(selectedPkg ? selectedPkg.priceCzk : basePrice)}
        <span className="text-sm font-normal text-ink/50">
          {selectedPkg ? " / package" : " / night"}
        </span>
      </p>

      {step === "select" && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <label className="text-xs font-semibold uppercase text-moss">
              Check-in
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="mt-1 w-full rounded-xl border border-mist px-2 py-2 text-sm font-normal text-ink"
              />
            </label>
            <label className="text-xs font-semibold uppercase text-moss">
              Check-out
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="mt-1 w-full rounded-xl border border-mist px-2 py-2 text-sm font-normal text-ink"
              />
            </label>
          </div>

          {packages.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase text-moss">Package</p>
              <div className="mt-2 space-y-2">
                <button
                  onClick={() => setPackageId("")}
                  className={`w-full rounded-xl border px-3 py-2 text-left text-sm ${
                    !packageId ? "border-forest bg-forest/5" : "border-mist"
                  }`}
                >
                  Room only · {formatPrice(basePrice)}/night
                </button>
                {packages.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPackageId(p.id)}
                    className={`w-full rounded-xl border px-3 py-2 text-left text-sm ${
                      packageId === p.id ? "border-forest bg-forest/5" : "border-mist"
                    }`}
                  >
                    <span className="font-semibold">{p.name}</span>
                    <span className="float-right">{formatPrice(p.priceCzk)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 flex gap-4 text-sm">
            {(
              [
                ["Adults", adults, setAdults, capacity],
                ["Children", children, setChildren, 6],
                ["Pets", pets, setPets, 3],
              ] as const
            ).map(([label, val, set, max]) => (
              <div key={label}>
                <p className="text-xs font-semibold uppercase text-moss">{label}</p>
                <div className="mt-1 flex items-center gap-2">
                  <button
                    className="h-7 w-7 rounded-full border border-mist"
                    onClick={() => set(Math.max(0, val - 1))}
                  >
                    −
                  </button>
                  <span>{val}</span>
                  <button
                    className="h-7 w-7 rounded-full border border-mist"
                    onClick={() => set(Math.min(max, val + 1))}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 space-y-1 border-t border-mist pt-4 text-sm">
            <div className="flex justify-between">
              <span>Accommodation</span>
              <span>{formatPrice(accommodation)}</span>
            </div>
            <div className="flex justify-between text-ink/60">
              <span>Taxes (est.)</span>
              <span>{formatPrice(taxes)}</span>
            </div>
            <div className="flex justify-between pt-2 text-base font-semibold">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          <button
            onClick={() => setStep("details")}
            className="mt-5 w-full rounded-xl bg-clay py-3 text-sm font-semibold text-cream hover:bg-[#b56a3d]"
          >
            Continue to book
          </button>
          <p className="mt-2 text-center text-xs text-ink/40">Ref: {slug}</p>
        </>
      )}

      {step === "details" && (
        <>
          <button onClick={() => setStep("select")} className="mt-2 text-sm text-moss hover:underline">
            ← Back
          </button>
          <div className="mt-3 space-y-3">
            <input
              placeholder="Full name"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="w-full rounded-xl border border-mist px-3 py-2.5"
            />
            <input
              type="email"
              placeholder="Email"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              className="w-full rounded-xl border border-mist px-3 py-2.5"
            />
            <input
              placeholder="Phone"
              value={guestPhone}
              onChange={(e) => setGuestPhone(e.target.value)}
              className="w-full rounded-xl border border-mist px-3 py-2.5"
            />
          </div>
          <div className="mt-4 rounded-xl bg-sand/60 p-3 text-sm">
            <p className="font-semibold">Total {formatPrice(total)}</p>
            <p className="text-ink/60">Mock sandbox payment — no real charge.</p>
          </div>
          {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
          <button
            disabled={loading || !guestName || !guestEmail}
            onClick={book}
            className="mt-4 w-full rounded-xl bg-forest py-3 text-sm font-semibold text-cream hover:bg-moss disabled:opacity-50"
          >
            {loading ? "Processing…" : "Pay with mock checkout"}
          </button>
        </>
      )}
    </div>
  );
}
