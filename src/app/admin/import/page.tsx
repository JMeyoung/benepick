import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ImportClient } from "./import-client";

export const metadata: Metadata = { title: "혜택 임포트 | 관리자" };

export default async function AdminImportPage() {
  // Check admin session
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  // Fetch organizations
  const organizations = await prisma.organization.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold">혜택 임포트 (수기 텍스트 파싱)</h1>
      </div>
      
      <ImportClient organizations={organizations} />
    </div>
  );
}
