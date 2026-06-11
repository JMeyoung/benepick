import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { LEAD_TYPE_LABELS } from "@/lib/constants";
import { formatDateTime } from "@/lib/format";

export const metadata: Metadata = { title: "리드 목록 | 관리자" };

export default async function AdminLeadsPage() {
  const leads = await prisma.leadSubmission.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-extrabold">리드 목록</h1>
      <p className="mb-4 text-sm text-muted-foreground">총 {leads.length}건</p>
      <div className="rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">유형</th>
              <th className="px-4 py-3 text-left font-semibold">연락처</th>
              <th className="px-4 py-3 text-left font-semibold hidden sm:table-cell">이름</th>
              <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">UTM</th>
              <th className="px-4 py-3 text-left font-semibold">제출일</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-muted/30">
                <td className="px-4 py-3">
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    {LEAD_TYPE_LABELS[lead.type] ?? lead.type}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium">{lead.contact}</td>
                <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{lead.name ?? "-"}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground hidden md:table-cell">
                  {[lead.utmSource, lead.utmMedium, lead.utmCampaign].filter(Boolean).join(" / ") || "-"}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{formatDateTime(lead.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {leads.length === 0 && (
          <p className="px-4 py-8 text-center text-muted-foreground">리드가 없습니다.</p>
        )}
      </div>
    </div>
  );
}
