import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const partner = await prisma.partner.create({
    data: {
      businessName: body.businessName,
      propertyName: body.propertyName || null,
      contactPerson: body.contactPerson,
      phone: body.phone,
      email: body.email,
      address: body.address,
      lat: body.lat ? parseFloat(body.lat) : null,
      lng: body.lng ? parseFloat(body.lng) : null,
      status: body.status || "LEAD",
      commissionPercent: body.commissionPercent
        ? parseFloat(body.commissionPercent)
        : 15,
      accountManagerId: user.id,
    },
  });
  return NextResponse.json({ partner });
}
