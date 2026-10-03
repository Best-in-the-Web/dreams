import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const property = await prisma.property.findUnique({
    where: { slug },
    include: { nearbyPlaces: true },
  });
  if (!property) return NextResponse.json({ nearby: [] }, { status: 404 });
  return NextResponse.json({ nearby: property.nearbyPlaces });
}
