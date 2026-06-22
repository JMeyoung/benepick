import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { runAllAggregators } from '@/lib/aggregators';
import { CATEGORIES, ORG_TYPES, RULE_TYPES } from '@/lib/constants';

const VALID_CATEGORIES = new Set<string>(CATEGORIES.map((c) => c.code));
const VALID_ORG_TYPES = new Set<string>(ORG_TYPES.map((o) => o.code));
const VALID_RULE_TYPES = new Set<string>(RULE_TYPES.map((r) => r.code));

/**
 * aggregator 산출물을 DB에 쓰기 전 도메인 코드 화이트리스트로 검증한다.
 * 잘못된 category/organizationType 가 프로덕션에 게시되는 것을 막는다.
 * 반환값이 null 이면 해당 혜택은 스킵한다.
 */
function validateItem(item: {
  title: string;
  category: string;
  organizationType: string;
  organizationName?: string;
}): string | null {
  if (!item.organizationName) return 'organizationName 누락';
  if (!VALID_CATEGORIES.has(item.category)) return `유효하지 않은 category: ${item.category}`;
  if (!VALID_ORG_TYPES.has(item.organizationType))
    return `유효하지 않은 organizationType: ${item.organizationType}`;
  return null;
}

// Optional: if you deploy to Vercel, this restricts execution time to max duration.
export const maxDuration = 300; // 5 minutes limit (Vercel hobby plan allows up to 10s, pro allows 300s. Adjust if needed).

export async function GET(request: Request) {
  // Security check: ensure the request is authorized.
  // When using Vercel Cron, the `Authorization` header has a Bearer token that matches CRON_SECRET.
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (
    process.env.NODE_ENV === 'production' && 
    cronSecret && 
    authHeader !== `Bearer ${cronSecret}`
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('[Cron] Starting aggregation cron job...');
    const results = await runAllAggregators();

    for (const result of results) {
      if (result.status === 'success' && result.data) {
        console.log(`[Cron] Saving ${result.data.length} records for ${result.name}...`);
        
        for (const item of result.data) {
          // 0. 도메인 코드 검증 — 위반 시 스킵(프로덕션 오염 방지)
          const validationError = validateItem(item);
          if (validationError) {
            console.warn(`[Cron] Skipping "${item.title}" from ${result.name}: ${validationError}`);
            continue;
          }

          // 1. Upsert Organization first
          const org = await prisma.organization.upsert({
            where: { name: item.organizationName },
            update: { type: item.organizationType },
            create: {
              name: item.organizationName,
              type: item.organizationType,
            }
          });

          // 2. Upsert Benefit
          // sourceUrl 단독은 고유하지 않다 — 여러 혜택이 같은 공식 안내 페이지(예:
          // 네이버플러스 멤버십 안내)를 공유한다. title 까지 묶어 식별해야 같은 URL
          // 혜택들이 서로 덮어써지지 않는다(데이터 손실 방지).
          const existingBenefit = await prisma.benefit.findFirst({
            where: { sourceUrl: item.sourceUrl, title: item.title }
          });

          const benefitData = {
            title: item.title,
            summary: item.summary,
            description: item.description,
            category: item.category,
            sourceUrl: item.sourceUrl,
            sourceUpdatedAt: new Date(),
            endsAt: item.endsAt,
            region: item.region,
            status: "PUBLISHED" // Automatically publish, or set to "DRAFT" to require admin approval
          };

          let savedBenefit;
          if (existingBenefit) {
            savedBenefit = await prisma.benefit.update({
              where: { id: existingBenefit.id },
              data: benefitData
            });
          } else {
            savedBenefit = await prisma.benefit.create({
              data: benefitData
            });
          }

          // 3. Connect Benefit & Organization
          await prisma.benefitOrganization.upsert({
            where: {
              benefitId_organizationId_role: {
                benefitId: savedBenefit.id,
                organizationId: org.id,
                role: "PROVIDER"
              }
            },
            update: {}, // No updates needed
            create: {
              benefitId: savedBenefit.id,
              organizationId: org.id,
              role: "PROVIDER"
            }
          });

          // 4. Sync EligibilityRules (노출 조건) — delete & recreate each run.
          // 규칙이 없으면 전 사용자에게 노출된다(matchesBenefit: rules.length===0 → true).
          await prisma.eligibilityRule.deleteMany({
            where: { benefitId: savedBenefit.id }
          });
          const validRules = item.rules?.filter((r) => {
            const ok = VALID_RULE_TYPES.has(r.ruleType);
            if (!ok) console.warn(`[Cron] Dropping invalid ruleType "${r.ruleType}" on "${item.title}"`);
            return ok;
          });
          if (validRules?.length) {
            await prisma.eligibilityRule.createMany({
              data: validRules.map((r) => ({
                benefitId: savedBenefit.id,
                ruleType: r.ruleType,
                minAge: r.minAge ?? null,
                maxAge: r.maxAge ?? null,
                stringValue: r.stringValue ?? null,
              })),
            });
          }
        }
      }
    }

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error('[Cron] Aggregation job failed:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
