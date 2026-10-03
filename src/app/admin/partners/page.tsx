import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function PartnersPage() {
  const partners = await prisma.partner.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      accountManager: true,
      properties: { select: { id: true, name: true, published: true } },
      _count: { select: { notes: true, tasks: true } },
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold text-forest">Partners</h1>
        <Link
          href="/admin/partners/new"
          className="rounded-xl bg-forest px-4 py-2 text-sm font-semibold text-cream"
        >
          Add partner
        </Link>
      </div>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-mist bg-cream">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="border-b border-mist bg-sand/50 text-xs uppercase tracking-wider text-moss">
            <tr>
              <th className="px-4 py-3">Business</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Commission</th>
              <th className="px-4 py-3">Manager</th>
              <th className="px-4 py-3">Properties</th>
              <th className="px-4 py-3">Notes</th>
            </tr>
          </thead>
          <tbody>
            {partners.map((p) => (
              <tr key={p.id} className="border-b border-mist/60 hover:bg-sand/30">
                <td className="px-4 py-3">
                  <Link href={`/admin/partners/${p.id}`} className="font-semibold text-forest hover:underline">
                    {p.businessName}
                  </Link>
                  <p className="text-xs text-ink/50">{p.contactPerson} · {p.email}</p>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={p.status} />
                </td>
                <td className="px-4 py-3">
                  {p.commissionPercent}% · {p.commissionModel}
                </td>
                <td className="px-4 py-3">{p.accountManager?.name || "—"}</td>
                <td className="px-4 py-3">{p.properties.length}</td>
                <td className="px-4 py-3">{p._count.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    ACTIVE: "bg-forest/15 text-forest",
    LEAD: "bg-clay/15 text-clay",
    CONTACTED: "bg-amber-100 text-amber-900",
    NEGOTIATING: "bg-blue-100 text-blue-900",
    ONBOARDING: "bg-violet-100 text-violet-900",
    PAUSED: "bg-mist text-ink/70",
    CLOSED: "bg-ink/10 text-ink/50",
  };
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${colors[status] || "bg-mist"}`}>
      {status}
    </span>
  );
}
