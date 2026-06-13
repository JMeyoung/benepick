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

export const metadata: Metadata = { title: "내 조건 맞춤 혜택 목록" };

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

  const benefitMap = new Map(allBenefits.map((b) => [b.id, b]));

  const savedIds = new Set<string>();
  if (visitorId) {
    const favs = await prisma.favorite.findMany({
      where: { visitorId, benefitId: { in: ranked.map((b) => b.id) } },
      select: { benefitId: true },
    });
    favs.forEach((f) => savedIds.add(f.benefitId));
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 relative">
      {/* Background glowing decorations */}
      <div className="absolute top-[-50px] right-[-50px] -z-10 size-[250px] rounded-full bg-primary/5 blur-[50px] pointer-events-none" />

      {/* Header section with user profile card */}
      <div className="mb-8 p-6 rounded-2xl border border-border/60 bg-gradient-to-r from-primary/5 via-card to-card shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">내 조건 맞춤 혜택</h1>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            ✨ {AGE_GROUP_LABELS[profile.ageGroup]} ·{" "}
            {profile.isStudent ? "대학생" : "일반"} ·{" "}
            {telecomLabel(profile.telecom)}
            {profile.cardIssuerIds.length > 0
              ? ` · ${profile.cardIssuerIds.map(cardIssuerLabel).join(", ")}`
              : ""}
            {profile.region ? ` · ${profile.region}` : ""}
          </p>
        </div>
        <Button asChild variant="outline" size="sm" className="w-fit hover:bg-primary/5 border-primary/20 text-primary font-semibold transition-colors">
          <Link href="/onboarding">⚙️ 조건 변경</Link>
        </Button>
      </div>

      {/* Category filter */}
      <CategoryFilterChips currentCategory={category} />

      {/* Benefits list */}
      {filtered.length === 0 ? (
        <div className="mt-16 text-center py-12 rounded-2xl border border-dashed border-border/80 bg-muted/5">
          <p className="text-5xl mb-4">🔍</p>
          <p className="font-bold text-lg text-foreground">이 조건에 맞는 혜택이 없어요.</p>
          <p className="mt-2 text-sm text-muted-foreground">다른 관심사 카테고리를 선택하거나 조건을 수정해 보세요.</p>
        </div>
      ) : (
        <ul className="mt-6 space-y-4">
          {filtered.map((b) => {
            const benefit = benefitMap.get(b.id)!;
            const providers = benefit.organizations
              .filter((bo) => bo.role === "PROVIDER")
              .map((bo) => bo.organization.name);

            return (
              <li key={benefit.id} className="group">
                <Link
                  href={`/benefits/${benefit.id}`}
                  className="block rounded-2xl border border-border/50 bg-card p-6 shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:border-primary/25 transform group-hover:-translate-y-0.5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 mb-3">
                        <Badge variant="secondary" className="text-xs font-semibold bg-secondary/80 text-secondary-foreground">
                          {categoryLabel(benefit.category)}
                        </Badge>
                        {benefit.isFeatured && (
                          <Badge className="text-xs bg-primary/10 text-primary border-primary/10 hover:bg-primary/10 font-bold">
                            추천
                          </Badge>
                        )}
                        {providers.map((p) => (
                          <Badge key={p} variant="outline" className="text-xs border-muted-foreground/30 text-muted-foreground">
                            {p}
                          </Badge>
                        ))}
                      </div>
                      <h3 className="font-bold text-lg text-foreground leading-snug truncate group-hover:text-primary transition-colors">
                        {benefit.title}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {benefit.summary}
                      </p>
                    </div>
                    {savedIds.has(benefit.id) && (
                      <span className="text-xl shrink-0 filter drop-shadow-sm select-none" title="저장됨">🔖</span>
                    )}
                  </div>
                  <div className="mt-4 pt-4 border-t border-border/30 flex items-center justify-between text-xs text-muted-foreground">
                    <div>
                      최근 업데이트: <strong>{formatRelativeDate(benefit.sourceUpdatedAt)}</strong>
                    </div>
                    {benefit.endsAt && (
                      <div className="flex items-center gap-1 text-destructive font-semibold">
                        <span>⏰</span>
                        <span>~{formatRelativeDate(benefit.endsAt)}</span>
                      </div>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      {/* Info indicator */}
      <p className="mt-8 text-center text-xs text-muted-foreground bg-muted/10 py-2 rounded-lg border border-border/20">
        맞춤형 혜택 총 {ranked.length}개 중{" "}
        {category ? `[${CATEGORY_LABELS[category] ?? category}] 필터링 ` : ""}
        {filtered.length}개 매칭 완료
      </p>
    </div>
  );
}
