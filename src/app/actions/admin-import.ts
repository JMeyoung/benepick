"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { writeAuditLog } from "@/lib/audit";
import { redirect } from "next/navigation";

async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}

export interface ImportBenefitItem {
  title: string;
  summary: string;
  description: string;
  category: string;
  endsAt?: string; // YYYY-MM-DD
}

export async function importBenefitsAction(
  organizationId: string,
  sourceUrl: string,
  items: ImportBenefitItem[]
) {
  const session = await requireAdmin();

  if (!organizationId) {
    return { success: false, error: "조직(제공사)을 선택해 주세요." };
  }
  if (!sourceUrl) {
    return { success: false, error: "출처 URL을 입력해 주세요." };
  }
  if (items.length === 0) {
    return { success: false, error: "저장할 혜택 항목이 없습니다." };
  }

  try {
    const org = await prisma.organization.findUnique({
      where: { id: organizationId }
    });

    if (!org) {
      return { success: false, error: "존재하지 않는 조직입니다." };
    }

    // Run in a transaction
    await prisma.$transaction(async (tx) => {
      for (const item of items) {
        // Parse endsAt if provided
        const endsAtDate = item.endsAt ? new Date(item.endsAt) : null;

        // Check if there is an existing benefit with the exact title and sourceUrl
        const existingBenefit = await tx.benefit.findFirst({
          where: {
            title: item.title,
            sourceUrl: sourceUrl,
          }
        });

        let benefit;
        if (existingBenefit) {
          benefit = await tx.benefit.update({
            where: { id: existingBenefit.id },
            data: {
              summary: item.summary,
              description: item.description,
              category: item.category,
              sourceUpdatedAt: new Date(),
              endsAt: endsAtDate,
              status: "PUBLISHED",
            }
          });
        } else {
          benefit = await tx.benefit.create({
            data: {
              title: item.title,
              summary: item.summary,
              description: item.description,
              category: item.category,
              sourceUrl: sourceUrl,
              sourceUpdatedAt: new Date(),
              endsAt: endsAtDate,
              status: "PUBLISHED",
            }
          });
        }

        // Connect the benefit to the organization under PROVIDER role
        await tx.benefitOrganization.upsert({
          where: {
            benefitId_organizationId_role: {
              benefitId: benefit.id,
              organizationId: org.id,
              role: "PROVIDER"
            }
          },
          update: {},
          create: {
            benefitId: benefit.id,
            organizationId: org.id,
            role: "PROVIDER"
          }
        });
      }
    });

    // Write audit log
    await writeAuditLog(
      session.adminId,
      "CREATE",
      "Benefit",
      null,
      { detail: `수기 텍스트 임포트를 통해 혜택 ${items.length}개 생성/업데이트 완료 (조직: ${org.name})` }
    );

    revalidatePath("/admin/benefits");
    return { success: true, count: items.length };

  } catch (error) {
    console.error("[Import Action Error]", error);
    return { success: false, error: "데이터 저장 중 오류가 발생했습니다." };
  }
}

/**
 * Fetch all available organizations to display in the dropdown.
 */
export async function getOrganizationsForImport() {
  await requireAdmin();
  try {
    const orgs = await prisma.organization.findMany({
      orderBy: { name: 'asc' }
    });
    return { success: true, data: orgs };
  } catch (error) {
    console.error("[Get Orgs Error]", error);
    return { success: false, error: "조직 목록을 가져오는 중 오류가 발생했습니다." };
  }
}
