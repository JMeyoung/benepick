import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { runAllAggregators } from '@/lib/aggregators';

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
          // Since there might not be a unique field for benefit matching other than a composite of (title, organization), 
          // we should be careful. We will use `sourceUrl` as a unique identifier for Upsert if possible,
          // but if your Prisma schema doesn't have `@unique` on `sourceUrl`, we will use `findFirst` then `update` or `create`.
          
          const existingBenefit = await prisma.benefit.findFirst({
            where: { sourceUrl: item.sourceUrl }
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
          if (item.rules?.length) {
            await prisma.eligibilityRule.createMany({
              data: item.rules.map((r) => ({
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
