import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { BenefitForm } from "@/components/admin/benefit-form";
import { createBenefitAction } from "@/app/actions/admin-benefits";

export const metadata: Metadata = { title: "혜택 등록 | 관리자" };

export default async function NewBenefitPage() {
  const organizations = await prisma.organization.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="max-w-2xl">
      <h1 className="mb-8 text-2xl font-extrabold">혜택 등록</h1>
      <BenefitForm action={createBenefitAction} organizations={organizations} submitLabel="등록" />
    </div>
  );
}
