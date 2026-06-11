import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { getVisitorId } from "@/lib/visitor";
import { categoryLabel } from "@/lib/constants";
import { formatRelativeDate } from "@/lib/format";

export const metadata: Metadata = { title: "저장한 혜택" };

export default async function SavedPage() {
  const visitorId = await getVisitorId();

  const favorites = visitorId
    ? await prisma.favorite.findMany({
        where: { visitorId },
        include: {
          benefit: {
            include: { organizations: { include: { organization: true } } },
          },
        },
        orderBy: { createdAt: "desc" },
      })
    : [];

  const activeFavs = favorites.filter(
    (f) =>
      f.benefit.status === "PUBLISHED" &&
      (!f.benefit.endsAt || new Date(f.benefit.endsAt) >= new Date())
  );

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-extrabold">저장한 혜택</h1>

      {activeFavs.length === 0 ? (
        <div className="mt-10 text-center text-muted-foreground">
          <p className="text-4xl mb-3">🔖</p>
          <p className="font-medium">저장된 혜택이 없어요.</p>
          <p className="mt-1 text-sm">혜택 상세 페이지에서 저장 버튼을 눌러 보세요.</p>
          <Button asChild className="mt-6">
            <Link href="/benefits">혜택 목록 보기</Link>
          </Button>
        </div>
      ) : (
        <ul className="space-y-3">
          {activeFavs.map(({ benefit }) => {
            const providers = benefit.organizations
              .filter((bo) => bo.role === "PROVIDER")
              .map((bo) => bo.organization.name);
            return (
              <li key={benefit.id}>
                <Link
                  href={`/benefits/${benefit.id}`}
                  className="block rounded-xl border bg-card p-5 transition-shadow hover:shadow-md"
                >
                  <div className="flex flex-wrap items-center gap-1.5 mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {categoryLabel(benefit.category)}
                    </Badge>
                    {providers.map((p) => (
                      <Badge key={p} variant="outline" className="text-xs">{p}</Badge>
                    ))}
                  </div>
                  <p className="font-semibold">{benefit.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {benefit.summary}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    갱신: {formatRelativeDate(benefit.sourceUpdatedAt)}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
