import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { prisma } from "@/lib/prisma";
import { getVisitorId } from "@/lib/visitor";
import { trackEvent } from "@/lib/track";
import { categoryLabel, telecomLabel, cardIssuerLabel, RULE_TYPE_LABELS } from "@/lib/constants";
import { formatDate, formatRelativeDate } from "@/lib/format";
import { FavoriteButton } from "./favorite-button";
import { OutboundLink } from "./outbound-link";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const benefit = await prisma.benefit.findUnique({ where: { id }, select: { title: true } });
  return { title: benefit?.title ?? "혜택 상세" };
}

export default async function BenefitDetailPage({ params }: Props) {
  const { id } = await params;
  const benefit = await prisma.benefit.findUnique({
    where: { id },
    include: {
      rules: true,
      organizations: { include: { organization: true } },
    },
  });

  if (!benefit || benefit.status !== "PUBLISHED") notFound();

  const visitorId = await getVisitorId();

  // 페이지 조회 이벤트 (await 없이 fire-and-forget)
  trackEvent("benefit_view", visitorId, { benefitId: id });

  const isSaved = visitorId
    ? !!(await prisma.favorite.findUnique({
        where: { visitorId_benefitId: { visitorId, benefitId: id } },
      }))
    : false;

  const providers = benefit.organizations
    .filter((bo) => bo.role === "PROVIDER")
    .map((bo) => bo.organization);
  const partners = benefit.organizations
    .filter((bo) => bo.role === "PARTNER")
    .map((bo) => bo.organization);

  const isExpired = benefit.endsAt && new Date(benefit.endsAt) < new Date();

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 relative">
      {/* Decorative background */}
      <div className="orb orb-primary animate-glow-pulse size-[250px] top-[-50px] right-[-80px] -z-10" />

      <Link href="/benefits" className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors duration-300 hover:text-primary group">
        <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span> 목록으로
      </Link>

      <div className="rounded-2xl glass card-premium bg-card/70 p-7 sm:p-9">
        {/* 상태 경고 */}
        {isExpired && (
          <div className="mb-5 rounded-xl bg-destructive/10 border border-destructive/20 px-5 py-3 text-sm text-destructive font-medium">
            이 혜택은 {formatDate(benefit.endsAt!)}에 종료되었습니다.
          </div>
        )}

        {/* 뱃지 행 */}
        <div className="flex flex-wrap gap-2 mb-5">
          <Badge variant="secondary" className="bg-primary/8 text-primary border-primary/15 font-semibold">{categoryLabel(benefit.category)}</Badge>
          {benefit.isFeatured && (
            <Badge className="bg-gradient-to-r from-primary/15 to-premium-cyan/15 text-primary border-primary/15 font-bold">✦ 추천</Badge>
          )}
          {providers.map((org) => (
            <Badge key={org.id} variant="outline" className="border-border/50">{org.name}</Badge>
          ))}
          {partners.map((org) => (
            <Badge key={org.id} variant="outline" className="border-dashed border-border/50">{org.name}</Badge>
          ))}
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold leading-snug">{benefit.title}</h1>
        <p className="mt-4 text-muted-foreground leading-relaxed text-base">{benefit.description}</p>

        {/* 적용 조건 */}
        {benefit.rules.length > 0 && (
          <>
            <Separator className="my-6 bg-border/30" />
            <h2 className="mb-4 font-bold text-sm uppercase tracking-wider text-muted-foreground">적용 조건</h2>
            <ul className="space-y-2.5">
              {benefit.rules.map((rule) => (
                <li key={rule.id} className="flex items-center gap-3 text-sm">
                  <span className="size-2 rounded-full bg-gradient-to-br from-primary to-premium-cyan shrink-0" />
                  <span className="font-medium text-muted-foreground">
                    {RULE_TYPE_LABELS[rule.ruleType] ?? rule.ruleType}:
                  </span>
                  <span className="text-foreground">
                    {rule.ruleType === "STUDENT_ONLY" && "재학생 전용"}
                    {rule.ruleType === "TELECOM" && telecomLabel(rule.stringValue ?? "")}
                    {rule.ruleType === "CARD_ISSUER" && cardIssuerLabel(rule.stringValue ?? "")}
                    {rule.ruleType === "AGE_RANGE" && `만 ${rule.minAge}세 ~ ${rule.maxAge}세`}
                    {rule.ruleType === "REGION" && (rule.stringValue ?? "")}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}

        <Separator className="my-6 bg-border/30" />

        {/* 출처 정보 */}
        <div className="text-xs text-muted-foreground space-y-2 p-4 rounded-xl bg-muted/20 border border-border/20">
          <p>
            갱신일:{" "}
            <span className="font-semibold text-foreground">
              {formatDate(benefit.sourceUpdatedAt)}{" "}
              ({formatRelativeDate(benefit.sourceUpdatedAt)})
            </span>
          </p>
          {benefit.endsAt && (
            <p>
              종료 예정:{" "}
              <span className={isExpired ? "text-destructive font-semibold" : "font-semibold text-foreground"}>
                {formatDate(benefit.endsAt)}
              </span>
            </p>
          )}
          {benefit.region && <p>지역: <span className="font-semibold text-foreground">{benefit.region}</span></p>}
        </div>

        {/* CTA 버튼 */}
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <OutboundLink
            href={benefit.sourceUrl}
            visitorId={visitorId}
            benefitId={id}
            className="flex-1"
          />
          <FavoriteButton
            benefitId={id}
            initialSaved={isSaved}
            visitorId={visitorId}
          />
        </div>
      </div>
    </div>
  );
}
