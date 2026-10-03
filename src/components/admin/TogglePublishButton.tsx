"use client";

import { useRouter } from "next/navigation";

export function TogglePublishButton({ id, published }: { id: string; published: boolean }) {
  const router = useRouter();
  return (
    <button
      className={`rounded-xl px-4 py-2 text-sm font-semibold ${
        published ? "border border-mist text-ink/70" : "bg-forest text-cream"
      }`}
      onClick={async () => {
        await fetch(`/api/admin/properties/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ published: !published }),
        });
        router.refresh();
      }}
    >
      {published ? "Unpublish" : "Publish"}
    </button>
  );
}
