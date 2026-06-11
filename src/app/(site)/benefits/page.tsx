import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { getVisitorId, getVisitorProfile } from "@/lib/visitor";
import { filterAndRankBenefits } from "@/lib/matching";
import { categoryLabel, telecomLabel, cardIssuerLabel, AGE_GROUP_LABELS, CATEGORY_LABELS } from "@/lib/constants";
import { formatRelativeDate } from "@/lib/format";
import { CategoryFilterChips } from "./category-filter-chips";

export const metadata: Metadata = { title: "내 혜택 목록" };

type Props = { searchParams: Promise<{ category?: string }> };

export default async function BenefitsPage({ searchParams }: Props) {
  const { category } = await searchParams;
  const [visitorId, profile] = await Promise.all([getVisitorId(), getVisitorProfile()]);

  if (!profile) {
    redirect("/onboarding");
  }

  const allBenefits = await prisma.benefit.findMany({
    where: { status: "PUBLISHED" },
    include: {
      rules: true,
      organizations: { include: { organization: true } },
    },
    orderBy: { sourceUpdatedAt: "desc" },
  });

  const ranked = filterAndRankBenefits(allBenefits, profile);
  const filtered = category ? ranked.filter((b) => b.category === category) : ranked;

  // id → 원본 Prisma 객체 룩업용 맵 (title, organizations 등 접근)
  const benefitMap = new Map(allBenefits.map((b) => [b.id, b]));

  // 저장 여부 조회
  const savedIds = new Set<string>();
  if (visitorId) {
    const favs = await prisma.favorite.findMany({
      where: { visitorId, benefitId: { in: ranked.map((b) => b.id) } },
      select: { benefitId: true },
    });
    favs.forEach((f) => savedIds.add(f.benefitId));
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* 헤더 */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">내 혜택</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {AGE_GROUP_LABELS[profile.ageGroup]} ·{" "}
            {profile.isStudent ? "재학생" : "비학생"} ·{" "}
            {telecomLabel(profile.telecom)}
            {profile.cardIssuerIds.length > 0
              ? ` · ${profile.cardIssuerIds.map(cardIssuerLabel).join(", ")}`
              : ""}
            {profile.region ? ` · ${profile.region}` : ""}
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/onboarding">조건 수정</Link>
        </Button>
      </div>

      {/* 카테고리 필터 */}
      <CategoryFilterChips currentCategory={category} />

      {/* 목록 */}
      {filtered.length === 0 ? (
        <div className="mt-10 text-center text-muted-foreground">
          <p className="text-4xl mb-3">🔍</p>
          <p className="font-medium">이 조건에 맞는 혜택이 없어요.</p>
          <p className="mt-1 text-sm">조건을 수정하거나 다른 카테고리를 선택해 보세요.</p>
        </div>
      ) : (
        <ul className="mt-4 space-y-3">
          {filtered.map((b) => {
            const benefit = benefitMap.get(b.id)!;
            const providers = benefit.organizations
              .filter((bo) => bo.role === "PROVIDER")
              .map((bo) => bo.organization.name);

            return (
              <li key={benefit.id}>
                <Link
                  href={`/benefits/${benefit.id}`}
                  className="block rounded-xl border bg-card p-5 transition-shadow hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {categoryLabel(benefit.category)}
                        </Badge>
                        {benefit.isFeatured && (
                          <Badge className="text-xs bg-primary/10 text-primary border-primary/20">
                            추천
                          </Badge>
                        )}
                        {providers.map((p) => (
                          <Badge key={p} variant="outline" className="text-xs">
                            {p}
                          </Badge>
                        ))}
                      </div>
                      <p className="font-semibold leading-snug truncate">{benefit.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                        {benefit.summary}
                      </p>
                    </div>
                    {savedIds.has(benefit.id) && (
                      <span className="text-lg shrink-0" title="저장됨">🔖</span>
                    )}
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">
                    갱신: {formatRelativeDate(benefit.sourceUpdatedAt)}
                    {benefit.endsAt && (
                      <span className="ml-2 text-destructive">
                        ~{formatRelativeDate(benefit.endsAt)}
                      </span>
                    )}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      {/* 조건에 맞는 총 개수 */}
      <p className="mt-6 text-center text-xs text-muted-foreground">
        내 조건에 맞는 혜택 {ranked.length}개 중{" "}
        {category ? `${CATEGORY_LABELS[category] ?? category} ` : ""}
        {filtered.length}개 표시
      </p>
    </div>
  );
}
