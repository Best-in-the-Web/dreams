import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Please sign in" }, { status: 401 });

  const body = await req.json();
  const booking = await prisma.booking.findUnique({
    where: { bookingNumber: body.bookingNumber },
  });
  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  if (booking.guestEmail !== user.email && booking.userId !== user.id) {
    return NextResponse.json({ error: "Not your booking" }, { status: 403 });
  }

  const existing = await prisma.review.findUnique({ where: { bookingId: booking.id } });
  if (existing) return NextResponse.json({ error: "Already reviewed" }, { status: 400 });

  const review = await prisma.review.create({
    data: {
      bookingId: booking.id,
      userId: user.id,
      propertyId: booking.propertyId,
      overall: body.overall,
      cleanliness: body.cleanliness,
      location: body.location,
      value: body.value,
      experience: body.experience,
      romanticScore: body.romanticScore,
      familyScore: body.familyScore,
      dogFriendlyScore: body.dogFriendlyScore,
      text: body.text,
    },
  });

  await prisma.booking.update({
    where: { id: booking.id },
    data: { status: "COMPLETED" },
  });

  return NextResponse.json({ review });
}
