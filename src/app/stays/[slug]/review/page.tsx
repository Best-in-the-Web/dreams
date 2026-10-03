"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function ReviewForm() {
  const { slug } = useParams() as { slug: string };
  const params = useSearchParams();
  const bookingNumber = params.get("booking") || "";
  const router = useRouter();
  const [form, setForm] = useState({
    overall: 5,
    cleanliness: 5,
    location: 5,
    value: 5,
    experience: 5,
    romanticScore: 5,
    familyScore: 5,
    dogFriendlyScore: 5,
    text: "",
  });
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, bookingNumber, slug }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed");
      return;
    }
    setDone(true);
    setTimeout(() => router.push(`/stays/${slug}`), 1500);
  };

  if (done) {
    return <p className="py-20 text-center text-forest">Thanks for your review!</p>;
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-md space-y-4 px-4 py-12">
      <h1 className="font-display text-3xl font-semibold text-forest">Leave a review</h1>
      <p className="text-sm text-ink/50">Booking {bookingNumber || "(select from My trips)"}</p>
      {(
        [
          "overall",
          "cleanliness",
          "location",
          "value",
          "experience",
          "romanticScore",
          "familyScore",
          "dogFriendlyScore",
        ] as const
      ).map((key) => (
        <label key={key} className="block text-sm font-medium capitalize">
          {key.replace("Score", " score")}
          <input
            type="range"
            min={1}
            max={5}
            value={form[key]}
            onChange={(e) => setForm({ ...form, [key]: parseInt(e.target.value, 10) })}
            className="mt-1 w-full"
          />
          <span className="text-ink/50">{form[key]}/5</span>
        </label>
      ))}
      <textarea
        value={form.text}
        onChange={(e) => setForm({ ...form, text: e.target.value })}
        placeholder="Short review…"
        className="w-full rounded-xl border border-mist p-3"
        rows={4}
      />
      {error && <p className="text-sm text-red-700">{error}</p>}
      <button type="submit" className="w-full rounded-xl bg-forest py-3 font-semibold text-cream">
        Submit review
      </button>
    </form>
  );
}

export default function ReviewPage() {
  return (
    <Suspense>
      <ReviewForm />
    </Suspense>
  );
}
