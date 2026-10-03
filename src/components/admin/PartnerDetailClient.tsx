"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

type Note = {
  id: string;
  body: string;
  createdAt: string;
  author: { name: string };
};

type Task = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  dueDate: string | null;
};

type Partner = {
  id: string;
  businessName: string;
  propertyName: string | null;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  status: string;
  contractStatus: string;
  commissionModel: string;
  commissionPercent: number;
  paymentDetails: string | null;
  internalTags: string;
  accountManagerId: string | null;
  notes: Note[];
  tasks: Task[];
  properties: { id: string; name: string; slug: string; published: boolean }[];
};

const STATUSES = ["LEAD", "CONTACTED", "NEGOTIATING", "ONBOARDING", "ACTIVE", "PAUSED", "CLOSED"];

export function PartnerDetailClient({
  partner,
  managers,
  authorId,
}: {
  partner: Partner;
  managers: { id: string; name: string }[];
  authorId: string;
}) {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [status, setStatus] = useState(partner.status);
  const [commission, setCommission] = useState(String(partner.commissionPercent));

  const saveMeta = async () => {
    await fetch(`/api/admin/partners/${partner.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status,
        commissionPercent: parseFloat(commission),
      }),
    });
    router.refresh();
  };

  const addNote = async () => {
    if (!note.trim()) return;
    await fetch(`/api/admin/partners/${partner.id}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: note, authorId }),
    });
    setNote("");
    router.refresh();
  };

  const addTask = async () => {
    if (!taskTitle.trim()) return;
    await fetch(`/api/admin/partners/${partner.id}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: taskTitle, assigneeId: authorId }),
    });
    setTaskTitle("");
    router.refresh();
  };

  return (
    <div>
      <Link href="/admin/partners" className="text-sm text-moss hover:underline">
        ← Partners
      </Link>
      <h1 className="mt-2 font-display text-3xl font-semibold text-forest">
        {partner.businessName}
      </h1>
      <p className="text-ink/60">
        {partner.contactPerson} · {partner.phone} · {partner.email}
      </p>
      <p className="text-sm text-ink/50">{partner.address}</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-mist bg-cream p-5">
          <h2 className="font-display text-lg font-semibold">Partner details</h2>
          <div className="mt-4 space-y-3">
            <label className="block text-xs font-semibold uppercase text-moss">
              Status
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-1 w-full rounded-xl border border-mist px-3 py-2 text-sm font-normal text-ink"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-xs font-semibold uppercase text-moss">
              Commission %
              <input
                value={commission}
                onChange={(e) => setCommission(e.target.value)}
                className="mt-1 w-full rounded-xl border border-mist px-3 py-2 text-sm font-normal text-ink"
              />
            </label>
            <p className="text-sm text-ink/60">
              Contract: {partner.contractStatus} · Model: {partner.commissionModel}
            </p>
            <p className="text-sm text-ink/60">
              Manager: {managers.find((m) => m.id === partner.accountManagerId)?.name || "—"}
            </p>
            <p className="text-sm text-ink/60">Payment: {partner.paymentDetails || "—"}</p>
            <button
              onClick={saveMeta}
              className="rounded-xl bg-forest px-4 py-2 text-sm font-semibold text-cream"
            >
              Save changes
            </button>
          </div>

          <h3 className="mt-6 font-semibold">Properties</h3>
          <ul className="mt-2 space-y-1 text-sm">
            {partner.properties.map((p) => (
              <li key={p.id}>
                <Link href={`/admin/properties/${p.id}`} className="text-forest hover:underline">
                  {p.name}
                </Link>{" "}
                {p.published ? "· live" : "· draft"}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-mist bg-cream p-5">
          <h2 className="font-display text-lg font-semibold">Internal history (CRM)</h2>
          <div className="mt-4 flex gap-2">
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note…"
              className="flex-1 rounded-xl border border-mist px-3 py-2 text-sm"
            />
            <button
              onClick={addNote}
              className="rounded-xl bg-clay px-4 py-2 text-sm font-semibold text-cream"
            >
              Add
            </button>
          </div>
          <div className="mt-4 max-h-80 space-y-3 overflow-y-auto">
            {partner.notes.map((n) => (
              <div key={n.id} className="rounded-xl bg-sand/50 px-3 py-2 text-sm">
                <p className="text-xs text-ink/50">
                  {new Date(n.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}{" "}
                  · {n.author.name}
                </p>
                <p className="mt-0.5">{n.body}</p>
              </div>
            ))}
          </div>

          <h3 className="mt-6 font-semibold">Tasks / follow-ups</h3>
          <div className="mt-2 flex gap-2">
            <input
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="New task…"
              className="flex-1 rounded-xl border border-mist px-3 py-2 text-sm"
            />
            <button
              onClick={addTask}
              className="rounded-xl border border-forest px-4 py-2 text-sm font-semibold text-forest"
            >
              Add
            </button>
          </div>
          <ul className="mt-3 space-y-2 text-sm">
            {partner.tasks.map((t) => (
              <li key={t.id} className="flex justify-between rounded-lg border border-mist px-3 py-2">
                <span>{t.title}</span>
                <span className="text-ink/50">{t.status}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
