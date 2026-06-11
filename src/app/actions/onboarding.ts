"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { trackEvent } from "@/lib/track";

const COOKIE_NAME = "benepick_vid";

const schema = z.object({
  ageGroup: z.string().min(1),
  isStudent: z.enum(["true", "false"]),
  telecom: z.string().min(1),
  cardIssuerIds: z.array(z.string()).default([]),
  categories: z.array(z.string()).min(1, "최소 1개 선택해 주세요"),
  region: z.string().optional(),
});

export async function saveOnboardingAction(_prev: unknown, formData: FormData) {
  const raw = {
    ageGroup: formData.get("ageGroup"),
    isStudent: formData.get("isStudent"),
    telecom: formData.get("telecom"),
    cardIssuerIds: formData.getAll("cardIssuerIds"),
    categories: formData.getAll("categories"),
    region: formData.get("region") || undefined,
  };

  const result = schema.safeParse(raw);
  if (!result.success) {
    return { error: result.error.issues[0]?.message ?? "입력값을 확인해 주세요." };
  }
  const data = result.data;

  const cookieStore = await cookies();
  let visitorId = cookieStore.get(COOKIE_NAME)?.value;
  if (!visitorId) {
    visitorId = crypto.randomUUID();
    cookieStore.set(COOKIE_NAME, visitorId, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  await prisma.visitorProfile.upsert({
    where: { visitorId },
    create: {
      visitorId,
      ageGroup: data.ageGroup,
      isStudent: data.isStudent === "true",
      telecom: data.telecom,
      cardIssuerIds: JSON.stringify(data.cardIssuerIds),
      categories: JSON.stringify(data.categories),
      region: data.region ?? null,
    },
    update: {
      ageGroup: data.ageGroup,
      isStudent: data.isStudent === "true",
      telecom: data.telecom,
      cardIssuerIds: JSON.stringify(data.cardIssuerIds),
      categories: JSON.stringify(data.categories),
      region: data.region ?? null,
    },
  });

  await trackEvent("onboarding_complete", visitorId, {
    ageGroup: data.ageGroup,
    telecom: data.telecom,
    categoryCount: data.categories.length,
  });

  redirect("/benefits");
}
