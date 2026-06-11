"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { trackEvent } from "@/lib/track";

const UTM_COOKIE = "benepick_utm";
const COOKIE_NAME = "benepick_vid";

const schema = z.object({
  type: z.enum(["WAITLIST", "INTERVIEW"]),
  name: z.string().optional(),
  contact: z.string().min(1, "연락처를 입력해 주세요."),
  message: z.string().optional(),
  consent: z.literal("true", { message: "개인정보 수집에 동의해 주세요." }),
});

export async function submitLeadAction(_prev: unknown, formData: FormData) {
  const raw = {
    type: formData.get("type"),
    name: formData.get("name") || undefined,
    contact: formData.get("contact"),
    message: formData.get("message") || undefined,
    consent: formData.get("consent"),
  };

  const result = schema.safeParse(raw);
  if (!result.success) {
    return { error: result.error.issues[0]?.message ?? "입력값을 확인해 주세요.", success: false };
  }
  const d = result.data;

  const cookieStore = await cookies();
  const utmRaw = cookieStore.get(UTM_COOKIE)?.value;
  const utm = utmRaw ? (JSON.parse(utmRaw) as Record<string, string>) : {};
  const visitorId = cookieStore.get(COOKIE_NAME)?.value ?? null;

  await prisma.leadSubmission.create({
    data: {
      type: d.type,
      name: d.name ?? null,
      contact: d.contact,
      message: d.message ?? null,
      consent: true,
      utmSource: utm.utm_source ?? null,
      utmMedium: utm.utm_medium ?? null,
      utmCampaign: utm.utm_campaign ?? null,
      utmContent: utm.utm_content ?? null,
      referrer: utm.referrer ?? null,
    },
  });

  await trackEvent("lead_submit", visitorId, { type: d.type, utmSource: utm.utm_source });

  return { success: true, error: null };
}
