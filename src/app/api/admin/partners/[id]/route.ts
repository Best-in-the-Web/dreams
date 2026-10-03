import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

async function requireAdmin() {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") return null;
  return user;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const partner = await prisma.partner.update({
    where: { id },
    data: {
      ...(body.status !== undefined ? { status: body.status } : {}),
      ...(body.commissionPercent !== undefined
        ? { commissionPercent: body.commissionPercent }
        : {}),
      ...(body.contractStatus !== undefined ? { contractStatus: body.contractStatus } : {}),
      ...(body.paymentDetails !== undefined ? { paymentDetails: body.paymentDetails } : {}),
      ...(body.accountManagerId !== undefined
        ? { accountManagerId: body.accountManagerId }
        : {}),
    },
  });
  return NextResponse.json({ partner });
}
