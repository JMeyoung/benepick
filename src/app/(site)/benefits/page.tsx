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
import { SearchIcon, BookmarkIcon } from "lucide-react";
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
    <div className="mx-auto max-w-3xl px-4 py-12 relative">
      {/* Decorative orbs */}
      <div className="orb orb-primary animate-glow-pulse size-[300px] top-[-80px] right-[-80px] -z-10" />
      <div className="orb orb-cyan animate-glow-pulse size-[200px] bottom-[20%] left-[-100px] -z-10" style={{ animationDelay: '1.5s' }} />

      {/* Header section with premium user profile card */}
      <div className="mb-10 p-7 rounded-2xl glass card-premium bg-gradient-to-r from-primary/[0.06] via-card/80 to-card/80">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              <span className="text-gradient">내 조건 맞춤</span> 혜택
            </h1>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/5 border border-primary/10 text-primary/80 font-medium">
                ✦ {AGE_GROUP_LABELS[profile.ageGroup]} ·{" "}
                {profile.isStudent ? "대학생" : "일반"} ·{" "}
                {telecomLabel(profile.telecom)}
                {profile.cardIssuerIds.length > 0
                  ? ` · ${profile.cardIssuerIds.map(cardIssuerLabel).join(", ")}`
                  : ""}
                {profile.region ? ` · ${profile.region}` : ""}
              </span>
            </p>
          </div>
          <Button asChild variant="outline" size="sm" className="w-fit border-primary/20 text-primary font-semibold transition-all duration-300 hover:bg-primary/5 hover:border-primary/30 hover:shadow-sm hover:shadow-primary/10">
            <Link href="/onboarding">⚙️ 조건 변경</Link>
          </Button>
        </div>
      </div>

      {/* Category filter */}
      <CategoryFilterChips currentCategory={category} />

      {/* Benefits list */}
      {filtered.length === 0 ? (
        <div className="mt-16 text-center py-16 rounded-2xl border border-dashed border-border/50 bg-card/30 backdrop-blur-sm">
          <div className="size-16 mx-auto mb-5 rounded-2xl bg-primary/5 flex items-center justify-center">
            <SearchIcon className="size-8 text-primary/40" aria-hidden />
          </div>
          <p className="font-bold text-lg text-foreground">이 조건에 맞는 혜택이 없어요.</p>
          <p className="mt-2 text-sm text-muted-foreground">다른 관심사 카테고리를 선택하거나 조건을 수정해 보세요.</p>
        </div>
      ) : (
        <ul className="mt-8 space-y-4">
          {filtered.map((b, i) => {
            const benefit = benefitMap.get(b.id)!;
            const providers = benefit.organizations
              .filter((bo) => bo.role === "PROVIDER")
              .map((bo) => bo.organization.name);

            return (
              <li key={benefit.id} className="group animate-slide-up" style={{ animationDelay: `${i * 0.05}s`, animationFillMode: 'backwards' }}>
                <Link
                  href={`/benefits/${benefit.id}`}
                  className="block rounded-2xl card-premium bg-card/70 backdrop-blur-sm p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 mb-3">
                        <Badge variant="secondary" className="text-xs font-semibold bg-primary/8 text-primary border-primary/15">
                          {categoryLabel(benefit.category)}
                        </Badge>
                        {benefit.isFeatured && (
                          <Badge className="text-xs bg-gradient-to-r from-primary/15 to-premium-cyan/15 text-primary border-primary/15 hover:bg-primary/15 font-bold">
                            ✦ 추천
                          </Badge>
                        )}
                        {providers.map((p) => (
                          <Badge key={p} variant="outline" className="text-xs border-border/50 text-muted-foreground">
                            {p}
                          </Badge>
                        ))}
                      </div>
                      <h3 className="font-bold text-lg text-foreground leading-snug truncate transition-colors duration-300 group-hover:text-primary">
                        {benefit.title}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {benefit.summary}
                      </p>
                    </div>
                    {savedIds.has(benefit.id) && (
                      <BookmarkIcon
                        className="size-5 shrink-0 text-primary fill-primary/20"
                        aria-label="저장됨"
                      />
                    )}
                  </div>
                  <div className="mt-4 pt-4 border-t border-border/20 flex items-center justify-between text-xs text-muted-foreground">
                    <div>
                      최근 업데이트: <strong className="text-foreground/80">{formatRelativeDate(benefit.sourceUpdatedAt)}</strong>
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
      <p className="mt-10 text-center text-xs text-muted-foreground glass-subtle py-3 px-4 rounded-xl">
        맞춤형 혜택 총 {ranked.length}개 중{" "}
        {category ? `[${CATEGORY_LABELS[category] ?? category}] 필터링 ` : ""}
        {filtered.length}개 매칭 완료
      </p>
    </div>
  );
}
