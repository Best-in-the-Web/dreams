"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { brand } from "@/lib/brand";

function LoginForm() {
  const [email, setEmail] = useState("demo@escapemap.local");
  const [password, setPassword] = useState("demo1234");
  const [name, setName] = useState("");
  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState("");
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/account";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: mode === "login" ? "login" : "register",
        email,
        password,
        name,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed");
      return;
    }
    router.push(data.user?.role === "ADMIN" ? "/admin" : next);
    router.refresh();
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4">
      <h1 className="font-display text-3xl font-semibold text-forest">
        {mode === "login" ? "Welcome back" : "Join EscapeMap"}
      </h1>
      <p className="mt-2 text-ink/60">Demo: demo@escapemap.local / demo1234</p>
      <form onSubmit={submit} className="mt-8 space-y-3">
        {mode === "register" && (
          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-mist px-4 py-3"
          />
        )}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-mist px-4 py-3"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border border-mist px-4 py-3"
          required
        />
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button type="submit" className="w-full rounded-xl bg-forest py-3 font-semibold text-cream">
          {mode === "login" ? "Sign in" : "Create account"}
        </button>
      </form>
      <button
        className="mt-4 text-sm text-moss hover:underline"
        onClick={() => setMode(mode === "login" ? "register" : "login")}
      >
        {mode === "login" ? "Need an account? Register" : "Have an account? Sign in"}
      </button>
      <p className="mt-8 text-xs text-ink/40">
        Admin: admin@escapemap.local / demo1234 · {brand.name}
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
