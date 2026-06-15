import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeAuditLog } from "@/lib/audit";

interface BenefitItem {
  title: string;
  summary: string;
  description: string;
  category: string;
  status?: string;
  sourceUrl: string;
  sourceUpdatedAt: string;
  endsAt?: string | null;
  isFeatured?: boolean;
  region?: string | null;
  rules?: Array<{
    ruleType: string;
    minAge?: number | null;
    maxAge?: number | null;
    stringValue?: string | null;
  }>;
}

interface ImportBody {
  organizationName: string; // e.g. "SKT"
  benefits: BenefitItem[];
}

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function POST(req: NextRequest) {
  // API key auth
  const authHeader = req.headers.get("authorization") ?? "";
  const apiKey = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!apiKey || apiKey !== process.env.ADMIN_API_KEY) {
    return unauthorized();
  }

  let body: ImportBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { organizationName, benefits } = body;

  if (!organizationName || !Array.isArray(benefits) || benefits.length === 0) {
    return NextResponse.json(
      { error: "organizationName과 benefits 배열이 필요합니다." },
      { status: 400 }
    );
  }

  const org = await prisma.organization.findUnique({
    where: { name: organizationName },
  });
  if (!org) {
    return NextResponse.json(
      { error: `Organization '${organizationName}' 을 찾을 수 없습니다.` },
      { status: 404 }
    );
  }

  let created = 0;
  let updated = 0;

  for (const item of benefits) {
    const existing = await prisma.benefit.findFirst({
      where: { title: item.title, sourceUrl: item.sourceUrl },
    });

    let benefitId: string;

    if (existing) {
      await prisma.benefit.update({
        where: { id: existing.id },
        data: {
          summary: item.summary,
          description: item.description,
          category: item.category,
          status: item.status ?? "PUBLISHED",
          sourceUpdatedAt: new Date(item.sourceUpdatedAt),
          endsAt: item.endsAt ? new Date(item.endsAt) : null,
          isFeatured: item.isFeatured ?? false,
          region: item.region ?? null,
        },
      });
      benefitId = existing.id;
      updated++;
    } else {
      const benefit = await prisma.benefit.create({
        data: {
          title: item.title,
          summary: item.summary,
          description: item.description,
          category: item.category,
          status: item.status ?? "PUBLISHED",
          sourceUrl: item.sourceUrl,
          sourceUpdatedAt: new Date(item.sourceUpdatedAt),
          endsAt: item.endsAt ? new Date(item.endsAt) : null,
          isFeatured: item.isFeatured ?? false,
          region: item.region ?? null,
        },
      });
      benefitId = benefit.id;
      created++;
    }

    await prisma.benefitOrganization.upsert({
      where: {
        benefitId_organizationId_role: {
          benefitId,
          organizationId: org.id,
          role: "PROVIDER",
        },
      },
      update: {},
      create: { benefitId, organizationId: org.id, role: "PROVIDER" },
    });

    if (item.rules && item.rules.length > 0) {
      await prisma.eligibilityRule.deleteMany({ where: { benefitId } });
      await prisma.eligibilityRule.createMany({
        data: item.rules.map((r) => ({
          benefitId,
          ruleType: r.ruleType,
          minAge: r.minAge ?? null,
          maxAge: r.maxAge ?? null,
          stringValue: r.stringValue ?? null,
        })),
      });
    }
  }

  await writeAuditLog(
    null,
    "CREATE",
    "Benefit",
    null,
    { detail: `크롤러 업로드: ${organizationName} — 신규 ${created}건, 업데이트 ${updated}건` }
  );

  return NextResponse.json({ success: true, created, updated, total: benefits.length });
}
