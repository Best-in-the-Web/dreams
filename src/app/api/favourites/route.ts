import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ ids: [] });
  const favs = await prisma.favourite.findMany({ where: { userId: user.id } });
  return NextResponse.json({ ids: favs.map((f) => f.propertyId) });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { propertyId } = await req.json();
  const existing = await prisma.favourite.findUnique({
    where: { userId_propertyId: { userId: user.id, propertyId } },
  });
  if (existing) {
    await prisma.favourite.delete({ where: { id: existing.id } });
    return NextResponse.json({ saved: false });
  }
  await prisma.favourite.create({ data: { userId: user.id, propertyId } });
  return NextResponse.json({ saved: true });
}
