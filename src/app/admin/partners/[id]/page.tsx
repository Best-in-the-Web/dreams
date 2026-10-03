import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { PartnerDetailClient } from "@/components/admin/PartnerDetailClient";

export default async function PartnerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") redirect("/login");

  const { id } = await params;
  const partner = await prisma.partner.findUnique({
    where: { id },
    include: {
      accountManager: true,
      properties: true,
      notes: { include: { author: true }, orderBy: { createdAt: "desc" } },
      tasks: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!partner) notFound();

  const managers = await prisma.user.findMany({
    where: { role: "ADMIN" },
    select: { id: true, name: true },
  });

  return (
    <PartnerDetailClient
      partner={JSON.parse(JSON.stringify(partner))}
      managers={managers}
      authorId={user.id}
    />
  );
}
