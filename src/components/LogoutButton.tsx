"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  return (
    <button
      className="rounded-full border border-mist px-4 py-2 text-sm hover:bg-sand"
      onClick={async () => {
        await fetch("/api/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "logout" }),
        });
        router.push("/");
        router.refresh();
      }}
    >
      Log out
    </button>
  );
}
