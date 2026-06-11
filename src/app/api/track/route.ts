import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { eventName, visitorId, properties } = await req.json();
    if (typeof eventName !== "string") {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    await prisma.eventLog.create({
      data: {
        visitorId: typeof visitorId === "string" ? visitorId : null,
        eventName,
        propertiesJson: properties ? JSON.stringify(properties) : null,
      },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
