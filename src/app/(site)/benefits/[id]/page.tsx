import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Link href="/benefits" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        ← 목록으로
      </Link>

      <div className="rounded-2xl border bg-card p-6 sm:p-8">
        {/* 상태 경고 */}
        {isExpired && (
          <div className="mb-4 rounded-lg bg-destructive/10 px-4 py-2 text-sm text-destructive">
            이 혜택은 {formatDate(benefit.endsAt!)}에 종료되었습니다.
          </div>
        )}

        {/* 뱃지 행 */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <Badge variant="secondary">{categoryLabel(benefit.category)}</Badge>
          {benefit.isFeatured && (
            <Badge className="bg-primary/10 text-primary border-primary/20">추천</Badge>
          )}
          {providers.map((org) => (
            <Badge key={org.id} variant="outline">{org.name}</Badge>
          ))}
          {partners.map((org) => (
            <Badge key={org.id} variant="outline" className="border-dashed">{org.name}</Badge>
          ))}
        </div>

        <h1 className="text-2xl font-extrabold leading-snug">{benefit.title}</h1>
        <p className="mt-3 text-muted-foreground leading-relaxed">{benefit.description}</p>

        {/* 적용 조건 */}
        {benefit.rules.length > 0 && (
          <>
            <Separator className="my-5" />
            <h2 className="mb-3 font-semibold">적용 조건</h2>
            <ul className="space-y-1.5">
              {benefit.rules.map((rule) => (
                <li key={rule.id} className="flex items-center gap-2 text-sm">
                  <span className="size-1.5 rounded-full bg-primary shrink-0" />
                  <span className="font-medium text-muted-foreground mr-1">
                    {RULE_TYPE_LABELS[rule.ruleType] ?? rule.ruleType}:
                  </span>
                  {rule.ruleType === "STUDENT_ONLY" && "재학생 전용"}
                  {rule.ruleType === "TELECOM" && telecomLabel(rule.stringValue ?? "")}
                  {rule.ruleType === "CARD_ISSUER" && cardIssuerLabel(rule.stringValue ?? "")}
                  {rule.ruleType === "AGE_RANGE" &&
                    `만 ${rule.minAge}세 ~ ${rule.maxAge}세`}
                  {rule.ruleType === "REGION" && (rule.stringValue ?? "")}
                </li>
              ))}
            </ul>
          </>
        )}

        <Separator className="my-5" />

        {/* 출처 정보 */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>
            갱신일:{" "}
            <span className="font-medium text-foreground">
              {formatDate(benefit.sourceUpdatedAt)}{" "}
              ({formatRelativeDate(benefit.sourceUpdatedAt)})
            </span>
          </p>
          {benefit.endsAt && (
            <p>
              종료 예정:{" "}
              <span className={isExpired ? "text-destructive font-medium" : "font-medium text-foreground"}>
                {formatDate(benefit.endsAt)}
              </span>
            </p>
          )}
          {benefit.region && <p>지역: <span className="font-medium text-foreground">{benefit.region}</span></p>}
        </div>

        {/* CTA 버튼 */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
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
