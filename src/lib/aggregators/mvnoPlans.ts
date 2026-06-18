import { Aggregator, AggregatedBenefit } from './types';

/**
 * 알뜰폰(MVNO) 요금제 Aggregator — 정가거부 채널 핵심 주제.
 *
 * 정가거부 채널은 통신비 절감을 위한 알뜰폰 요금제 비교를 꾸준히 다룬다.
 * 본 aggregator는 통신3사 대비 저렴한 알뜰폰 요금제/프로모션을 통신(TELECOM)
 * 카테고리로 담는다. 요금제는 가입 조건이 따로 없으므로 카드사 규칙을 두지 않고
 * 전 사용자에게 노출한다.
 *
 * - sourceUrl 은 공식 통신사/공신력 있는 비교 플랫폼(모요 등).
 * - 0원·프로모션 요금제는 약정 기간 후 정가로 전환되므로 description 에 유의사항 명시.
 */
export const mvnoPlansAggregator: Aggregator = {
  name: "MVNO_PLANS",
  run: async (): Promise<AggregatedBenefit[]> => {
    console.log("[MVNO_PLANS] Building curated MVNO plan benefits (정가거부 reference)...");

    const note = " (정가거부 채널 큐레이션 기준 / 프로모션 종료 후 정가 전환·조건 변동 가능)";

    const benefits: AggregatedBenefit[] = [
      {
        title: "알뜰폰 프로모션 요금제 — 데이터 7GB 월 0원대",
        summary: "페이백 포함 초기 수개월 월 0원, 이후 정가 전환",
        description:
          "모요 등 비교 플랫폼 기준, 데이터 7GB대 유심 요금제가 페이백 포함 초기 수개월 월 0원으로 제공되는 프로모션이 상시 등장한다. 약정 기간 종료 후에는 정가(예: 월 15,900원대)로 전환되므로 전환 시점을 확인하고 가입한다." +
          note,
        category: "TELECOM",
        sourceUrl: "https://www.moyoplan.com/plans",
        organizationName: "모요",
        organizationType: "TELECOM",
      },
      {
        title: "알뜰폰 무약정 요금제 — 통신3사 대비 약 50% 저렴",
        summary: "약정 없이 통신3사 동급 요금제 대비 절반 수준",
        description:
          "알뜰폰(MVNO)은 통신3사 망을 그대로 쓰면서 동급 데이터 요금제를 약 50% 저렴하게 제공한다. 약정·결합 조건이 없는 무약정 요금제가 많아 통신비 고정지출을 줄이려는 사용자에게 적합하다." +
          note,
        category: "TELECOM",
        sourceUrl: "https://www.mvnohub.kr/main",
        organizationName: "알뜰폰허브",
        organizationType: "TELECOM",
      },
      {
        title: "U+유모바일 맞춤 알뜰폰 요금제",
        summary: "데이터 사용량에 맞춘 LGU+ 망 알뜰폰 요금제",
        description:
          "LG U+ 망을 쓰는 알뜰폰 브랜드로, 데이터 사용량에 맞춰 요금제를 추천받아 통신비를 낮출 수 있다. 소량·중량·무제한 구간이 폭넓어 본인 사용량에 맞게 고르기 좋다." +
          note,
        category: "TELECOM",
        sourceUrl: "https://www.uplusumobile.com/",
        organizationName: "U+유모바일",
        organizationType: "TELECOM",
      },
    ];

    console.log(`[MVNO_PLANS] Curated ${benefits.length} MVNO plan benefits.`);
    return benefits;
  },
};
