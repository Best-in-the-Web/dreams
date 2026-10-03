import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json();
  const property = await prisma.property.update({
    where: { id },
    data: {
      ...(body.published !== undefined ? { published: body.published } : {}),
      ...(body.basePriceCzk !== undefined ? { basePriceCzk: body.basePriceCzk } : {}),
      ...(body.weekendPriceCzk !== undefined ? { weekendPriceCzk: body.weekendPriceCzk } : {}),
    },
  });
  return NextResponse.json({ property });
}
