import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BenefitForm } from "@/components/admin/benefit-form";
import { updateBenefitAction } from "@/app/actions/admin-benefits";

export const metadata: Metadata = { title: "혜택 수정 | 관리자" };

type Props = { params: Promise<{ id: string }> };

export default async function EditBenefitPage({ params }: Props) {
  const { id } = await params;
  const benefit = await prisma.benefit.findUnique({
    where: { id },
    include: {
      rules: true,
      organizations: { where: { role: "PROVIDER" }, select: { organizationId: true } },
    },
  });
  if (!benefit) notFound();

  const organizations = await prisma.organization.findMany({ orderBy: { name: "asc" } });

  const boundAction = updateBenefitAction.bind(null, id);

  return (
    <div className="max-w-2xl">
      <h1 className="mb-8 text-2xl font-extrabold">혜택 수정</h1>
      <BenefitForm
        action={boundAction}
        organizations={organizations}
        submitLabel="수정 저장"
        initialData={{
          title: benefit.title,
          summary: benefit.summary,
          description: benefit.description,
          category: benefit.category,
          status: benefit.status,
          sourceUrl: benefit.sourceUrl,
          sourceUpdatedAt: benefit.sourceUpdatedAt.toISOString().slice(0, 10),
          endsAt: benefit.endsAt ? benefit.endsAt.toISOString().slice(0, 10) : null,
          isFeatured: benefit.isFeatured,
          region: benefit.region,
          providerIds: benefit.organizations.map((o) => o.organizationId),
          rules: benefit.rules.map((r) => ({
            ruleType: r.ruleType,
            minAge: r.minAge,
            maxAge: r.maxAge,
            stringValue: r.stringValue,
          })),
        }}
      />
    </div>
  );
}
