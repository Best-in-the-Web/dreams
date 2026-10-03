import { NextRequest, NextResponse } from "next/server";
import { smartSearch } from "@/lib/smart-search";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const filters = await smartSearch(body.query || "");
  return NextResponse.json({ filters });
}
