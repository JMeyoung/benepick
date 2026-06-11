"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { writeAuditLog } from "@/lib/audit";

async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}

const benefitSchema = z.object({
  title: z.string().min(1, "제목 필수"),
  summary: z.string().min(1, "요약 필수"),
  description: z.string().min(1, "설명 필수"),
  category: z.string().min(1, "카테고리 필수"),
  sourceUrl: z.string().url("올바른 URL 입력"),
  sourceUpdatedAt: z.string().min(1, "갱신일 필수"),
  endsAt: z.string().optional(),
  isFeatured: z.enum(["true", "false"]).default("false"),
  region: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  // 조직 및 규칙은 별도 필드로 받음
  providerIds: z.array(z.string()).default([]),
  // 규칙은 JSON 문자열로 전송
  rulesJson: z.string().optional(),
});

type RuleInput = {
  ruleType: string;
  minAge?: number | null;
  maxAge?: number | null;
  stringValue?: string | null;
};

export async function createBenefitAction(_prev: unknown, formData: FormData) {
  const session = await requireAdmin();

  const raw = {
    title: formData.get("title"),
    summary: formData.get("summary"),
    description: formData.get("description"),
    category: formData.get("category"),
    sourceUrl: formData.get("sourceUrl"),
    sourceUpdatedAt: formData.get("sourceUpdatedAt"),
    endsAt: formData.get("endsAt") || undefined,
    isFeatured: formData.get("isFeatured") ?? "false",
    region: formData.get("region") || undefined,
    status: formData.get("status") ?? "DRAFT",
    providerIds: formData.getAll("providerIds"),
    rulesJson: formData.get("rulesJson") || undefined,
  };

  const result = benefitSchema.safeParse(raw);
  if (!result.success) {
    return { error: result.error.issues[0]?.message ?? "입력값 오류" };
  }
  const d = result.data;
  const rules: RuleInput[] = d.rulesJson ? (JSON.parse(d.rulesJson) as RuleInput[]) : [];

  const benefit = await prisma.benefit.create({
    data: {
      title: d.title,
      summary: d.summary,
      description: d.description,
      category: d.category,
      sourceUrl: d.sourceUrl,
      sourceUpdatedAt: new Date(d.sourceUpdatedAt),
      endsAt: d.endsAt ? new Date(d.endsAt) : null,
      isFeatured: d.isFeatured === "true",
      region: d.region ?? null,
      status: d.status,
      rules: {
        create: rules.map((r) => ({
          ruleType: r.ruleType,
          minAge: r.minAge ?? null,
          maxAge: r.maxAge ?? null,
          stringValue: r.stringValue ?? null,
        })),
      },
      organizations: {
        create: d.providerIds.map((id) => ({ organizationId: id, role: "PROVIDER" })),
      },
    },
  });

  await writeAuditLog(session.adminId, "CREATE", "Benefit", benefit.id, { title: benefit.title });

  revalidatePath("/admin/benefits");
  revalidatePath("/benefits");
  redirect(`/admin/benefits/${benefit.id}/edit`);
}

export async function updateBenefitAction(benefitId: string, _prev: unknown, formData: FormData) {
  const session = await requireAdmin();

  const raw = {
    title: formData.get("title"),
    summary: formData.get("summary"),
    description: formData.get("description"),
    category: formData.get("category"),
    sourceUrl: formData.get("sourceUrl"),
    sourceUpdatedAt: formData.get("sourceUpdatedAt"),
    endsAt: formData.get("endsAt") || undefined,
    isFeatured: formData.get("isFeatured") ?? "false",
    region: formData.get("region") || undefined,
    status: formData.get("status") ?? "DRAFT",
    providerIds: formData.getAll("providerIds"),
    rulesJson: formData.get("rulesJson") || undefined,
  };

  const result = benefitSchema.safeParse(raw);
  if (!result.success) {
    return { error: result.error.issues[0]?.message ?? "입력값 오류" };
  }
  const d = result.data;
  const rules: RuleInput[] = d.rulesJson ? (JSON.parse(d.rulesJson) as RuleInput[]) : [];

  await prisma.$transaction([
    prisma.eligibilityRule.deleteMany({ where: { benefitId } }),
    prisma.benefitOrganization.deleteMany({ where: { benefitId } }),
    prisma.benefit.update({
      where: { id: benefitId },
      data: {
        title: d.title,
        summary: d.summary,
        description: d.description,
        category: d.category,
        sourceUrl: d.sourceUrl,
        sourceUpdatedAt: new Date(d.sourceUpdatedAt),
        endsAt: d.endsAt ? new Date(d.endsAt) : null,
        isFeatured: d.isFeatured === "true",
        region: d.region ?? null,
        status: d.status,
        rules: {
          create: rules.map((r) => ({
            ruleType: r.ruleType,
            minAge: r.minAge ?? null,
            maxAge: r.maxAge ?? null,
            stringValue: r.stringValue ?? null,
          })),
        },
        organizations: {
          create: d.providerIds.map((id) => ({ organizationId: id, role: "PROVIDER" })),
        },
      },
    }),
  ]);

  await writeAuditLog(session.adminId, "UPDATE", "Benefit", benefitId, { title: d.title });

  revalidatePath("/admin/benefits");
  revalidatePath(`/admin/benefits/${benefitId}/edit`);
  revalidatePath("/benefits");
  return { error: null };
}

export async function changeBenefitStatusAction(benefitId: string, status: string) {
  const session = await requireAdmin();
  const oldBenefit = await prisma.benefit.findUnique({ where: { id: benefitId }, select: { status: true } });
  await prisma.benefit.update({ where: { id: benefitId }, data: { status } });
  await writeAuditLog(session.adminId, "STATUS_CHANGE", "Benefit", benefitId, {
    from: oldBenefit?.status,
    to: status,
  });
  revalidatePath("/admin/benefits");
  revalidatePath("/benefits");
}
