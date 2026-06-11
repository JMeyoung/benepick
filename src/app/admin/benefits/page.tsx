import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { categoryLabel, STATUS_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import { StatusChangeButtons } from "./status-change-buttons";

export const metadata: Metadata = { title: "혜택 관리 | 관리자" };

type Props = { searchParams: Promise<{ status?: string; q?: string }> };

export default async function AdminBenefitsPage({ searchParams }: Props) {
  const { status, q } = await searchParams;

  const benefits = await prisma.benefit.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(q ? { title: { contains: q } } : {}),
    },
    include: { organizations: { include: { organization: true } } },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">혜택 관리</h1>
        <Button asChild size="sm">
          <Link href="/admin/benefits/new">+ 혜택 등록</Link>
        </Button>
      </div>

      {/* 상태 필터 */}
      <div className="mb-4 flex gap-2 flex-wrap">
        {[
          { label: "전체", value: undefined },
          { label: "게시 중", value: "PUBLISHED" },
          { label: "초안", value: "DRAFT" },
          { label: "종료", value: "ARCHIVED" },
        ].map(({ label, value }) => (
          <Link
            key={label}
            href={value ? `/admin/benefits?status=${value}` : "/admin/benefits"}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              status === value || (!status && !value)
                ? "border-primary bg-primary text-primary-foreground"
                : "hover:bg-accent"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      <div className="rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">제목</th>
              <th className="px-4 py-3 text-left font-semibold hidden sm:table-cell">카테고리</th>
              <th className="px-4 py-3 text-left font-semibold">상태</th>
              <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">갱신일</th>
              <th className="px-4 py-3 text-left font-semibold">작업</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {benefits.map((b) => (
              <tr key={b.id} className="hover:bg-muted/30">
                <td className="px-4 py-3">
                  <p className="font-medium line-clamp-1 max-w-xs">{b.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {b.organizations
                      .filter((bo) => bo.role === "PROVIDER")
                      .map((bo) => bo.organization.name)
                      .join(", ")}
                  </p>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <Badge variant="secondary">{categoryLabel(b.category)}</Badge>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={b.status} />
                </td>
                <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                  {formatDate(b.sourceUpdatedAt)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1 flex-wrap">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/benefits/${b.id}/edit`}>수정</Link>
                    </Button>
                    <StatusChangeButtons benefitId={b.id} currentStatus={b.status} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {benefits.length === 0 && (
          <p className="px-4 py-8 text-center text-muted-foreground">혜택이 없습니다.</p>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const label = STATUS_LABELS[status] ?? status;
  const cls =
    status === "PUBLISHED"
      ? "bg-green-100 text-green-800"
      : status === "DRAFT"
      ? "bg-yellow-100 text-yellow-800"
      : "bg-gray-100 text-gray-600";
  return <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>{label}</span>;
}
