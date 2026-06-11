import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/format";

export const metadata: Metadata = { title: "감사 로그 | 관리자" };

export default async function AdminLogsPage() {
  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { adminUser: { select: { name: true, email: true } } },
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-extrabold">감사 로그</h1>
      <div className="rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">시각</th>
              <th className="px-4 py-3 text-left font-semibold">관리자</th>
              <th className="px-4 py-3 text-left font-semibold">작업</th>
              <th className="px-4 py-3 text-left font-semibold">대상</th>
              <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">상세</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-muted/30">
                <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{formatDateTime(log.createdAt)}</td>
                <td className="px-4 py-3">{log.adminUser?.name ?? "-"}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-mono">{log.action}</span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{log.entityType}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground hidden md:table-cell truncate max-w-xs">
                  {log.detail ?? "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {logs.length === 0 && (
          <p className="px-4 py-8 text-center text-muted-foreground">로그가 없습니다.</p>
        )}
      </div>
    </div>
  );
}
