"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { trackEvent } from "@/lib/track";

const COOKIE_NAME = "benepick_vid";

async function getOrCreateVisitorId(): Promise<string> {
  const cookieStore = await cookies();
  const existing = cookieStore.get(COOKIE_NAME)?.value;
  if (existing) return existing;
  const id = crypto.randomUUID();
  cookieStore.set(COOKIE_NAME, id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return id;
}

export async function toggleFavoriteAction(benefitId: string): Promise<{ saved: boolean }> {
  const visitorId = await getOrCreateVisitorId();

  const existing = await prisma.favorite.findUnique({
    where: { visitorId_benefitId: { visitorId, benefitId } },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
    await trackEvent("favorite_remove", visitorId, { benefitId });
    revalidatePath("/saved");
    return { saved: false };
  } else {
    await prisma.favorite.create({ data: { visitorId, benefitId } });
    await trackEvent("favorite_add", visitorId, { benefitId });
    revalidatePath("/saved");
    return { saved: true };
  }
}
