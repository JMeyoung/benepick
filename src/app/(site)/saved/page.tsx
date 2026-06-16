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
    <div className="mx-auto max-w-2xl px-4 py-12 relative">
      {/* Decorative orb */}
      <div className="orb orb-cyan animate-glow-pulse size-[200px] top-[-40px] right-[-60px] -z-10" />
      
      <h1 className="mb-8 text-3xl font-extrabold tracking-tight">
        <span className="text-gradient">저장한</span> 혜택
      </h1>

      {activeFavs.length === 0 ? (
        <div className="mt-10 text-center py-16 rounded-2xl border border-dashed border-border/50 bg-card/30 backdrop-blur-sm">
          <div className="size-16 mx-auto mb-5 rounded-2xl bg-primary/5 flex items-center justify-center text-4xl">
            🔖
          </div>
          <p className="font-bold text-lg">저장된 혜택이 없어요.</p>
          <p className="mt-2 text-sm text-muted-foreground">혜택 상세 페이지에서 저장 버튼을 눌러 보세요.</p>
          <Button asChild className="shimmer-btn mt-8 text-white font-bold shadow-lg shadow-primary/20">
            <Link href="/benefits">혜택 목록 보기</Link>
          </Button>
        </div>
      ) : (
        <ul className="space-y-4">
          {activeFavs.map(({ benefit }, i) => {
            const providers = benefit.organizations
              .filter((bo) => bo.role === "PROVIDER")
              .map((bo) => bo.organization.name);
            return (
              <li key={benefit.id} className="animate-slide-up" style={{ animationDelay: `${i * 0.05}s`, animationFillMode: 'backwards' }}>
                <Link
                  href={`/benefits/${benefit.id}`}
                  className="block rounded-2xl card-premium bg-card/70 backdrop-blur-sm p-6"
                >
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <Badge variant="secondary" className="text-xs font-semibold bg-primary/8 text-primary border-primary/15">
                      {categoryLabel(benefit.category)}
                    </Badge>
                    {providers.map((p) => (
                      <Badge key={p} variant="outline" className="text-xs border-border/50">{p}</Badge>
                    ))}
                  </div>
                  <p className="font-bold text-lg">{benefit.title}</p>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {benefit.summary}
                  </p>
                  <p className="mt-3 text-xs text-muted-foreground">
                    갱신: <span className="text-foreground/80 font-medium">{formatRelativeDate(benefit.sourceUpdatedAt)}</span>
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
