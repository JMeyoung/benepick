// 익명 방문자 쿠키 관리 + VisitorProfile 조회/저장 헬퍼

import { cookies } from "next/headers";
import { prisma } from "./prisma";
import type { VisitorCondition } from "./matching";

const COOKIE_NAME = "benepick_vid";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1년

export async function getVisitorId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value ?? null;
}

export async function setVisitorId(id: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
}

export async function getVisitorProfile(): Promise<VisitorCondition | null> {
  const vid = await getVisitorId();
  if (!vid) return null;
  const profile = await prisma.visitorProfile.findUnique({ where: { visitorId: vid } });
  if (!profile) return null;
  return {
    ageGroup: profile.ageGroup,
    isStudent: profile.isStudent,
    telecom: profile.telecom,
    cardIssuerIds: JSON.parse(profile.cardIssuerIds) as string[],
    categories: JSON.parse(profile.categories) as string[],
    region: profile.region ?? null,
  };
}
