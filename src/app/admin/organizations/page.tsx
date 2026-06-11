import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ORG_TYPE_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "조직 관리 | 관리자" };

export default async function AdminOrgsPage() {
  const orgs = await prisma.organization.findMany({ orderBy: [{ type: "asc" }, { name: "asc" }] });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-extrabold">조직 관리</h1>
      <p className="mb-4 text-sm text-muted-foreground">시드 데이터로 조직이 등록되어 있습니다. 추가/수정이 필요하면 혜택 등록 폼의 제공사 항목을 활용하세요.</p>
      <div className="rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">이름</th>
              <th className="px-4 py-3 text-left font-semibold">유형</th>
              <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">웹사이트</th>
              <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">등록일</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orgs.map((org) => (
              <tr key={org.id} className="hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{org.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{ORG_TYPE_LABELS[org.type] ?? org.type}</td>
                <td className="px-4 py-3 hidden md:table-cell">
                  {org.websiteUrl ? (
                    <a href={org.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline-offset-2 hover:underline text-xs">
                      {org.websiteUrl}
                    </a>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </td>
                <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{formatDate(org.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
