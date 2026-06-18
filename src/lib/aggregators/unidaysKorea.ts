import { Aggregator, AggregatedBenefit } from './types';

/**
 * 유니데이즈(UNiDAYS) 한국 학생 할인 Aggregator.
 *
 * 유니데이즈는 전 세계 2,000만 명 이상의 학생·교직원을 대상으로 Apple·삼성·ASOS·어도비
 * 등 글로벌 브랜드의 학생 전용 할인을 제공하는 플랫폼이다. 재학 증명 후 무료 가입하며,
 * 국내 대학·전문대학 재학생이면 한국 서비스를 이용할 수 있다.
 *
 * 학생 전용 혜택이므로 STUDENT_ONLY 규칙을 부여한다.
 * 유니데이즈 org는 prisma/seed.ts에 이미 STUDENT_PLATFORM 타입으로 seeded.
 */
export const unidaysKoreaAggregator: Aggregator = {
  name: "UNIDAYS_KOREA",
  run: async (): Promise<AggregatedBenefit[]> => {
    console.log("[UNIDAYS_KOREA] Building curated UNiDAYS Korea student benefits...");

    const note = " (유니데이즈 앱/사이트에서 재학생 인증 후 이용 / 혜택은 브랜드 정책에 따라 변동됩니다)";
    const studentRule = [{ ruleType: "STUDENT_ONLY" }];

    const benefits: AggregatedBenefit[] = [
      {
        title: "Apple 교육 할인 — 맥북·아이패드·에어팟 최대 할인 + 무이자 할부",
        summary: "유니데이즈 인증 학생·교직원 대상 Apple 기기 교육 할인 및 무이자 할부",
        description:
          "유니데이즈에서 학생 인증 후 Apple Education Store를 이용하면 맥북·아이패드·에어팟 등 Apple 기기를 교육 할인 가격에 구매할 수 있다. 추가로 무이자 할부 혜택과 함께 학기 시작 시즌(3월·9월)에는 에어팟 무상 제공 등 특별 프로모션이 진행된다." +
          note,
        category: "EDUCATION",
        sourceUrl: "https://www.myunidays.com/KR/ko-KR/partners/apple/view",
        organizationName: "유니데이즈",
        organizationType: "STUDENT_PLATFORM",
        rules: studentRule,
      },
      {
        title: "ASOS 학생 상시 10% 할인",
        summary: "유니데이즈 학생 인증 후 ASOS 전 상품 10% 상시 할인",
        description:
          "유니데이즈 학생 인증을 완료하면 ASOS 패션 플랫폼에서 전 상품(세일 상품 포함)에 10% 추가 할인 코드를 발급받는다. ASOS는 자체 브랜드 외에 나이키·아디다스·뉴발란스 등 다양한 글로벌 브랜드를 취급해 패션 쇼핑 비용을 줄이기에 유리하다." +
          note,
        category: "SHOPPING",
        sourceUrl: "https://www.myunidays.com/KR/ko-KR",
        organizationName: "유니데이즈",
        organizationType: "STUDENT_PLATFORM",
        rules: studentRule,
      },
      {
        title: "어도비 Creative Cloud 학생·교직원 플랜 — 최대 65% 할인",
        summary: "포토샵·일러스트레이터 등 Creative Cloud 앱 전체를 학생가로 구독",
        description:
          "어도비 공식 학생·교직원 요금제를 유니데이즈 인증 후 이용하면 Creative Cloud 모든 앱을 정가 대비 최대 65% 할인된 가격에 구독할 수 있다. 포토샵·일러스트레이터·프리미어 프로·라이트룸 등 20개 이상의 앱이 포함된다." +
          note,
        category: "EDUCATION",
        sourceUrl: "https://www.myunidays.com/KR/ko-KR",
        organizationName: "유니데이즈",
        organizationType: "STUDENT_PLATFORM",
        rules: studentRule,
      },
      {
        title: "Samsung Education Store — 노트북·갤럭시 기기 학생 할인",
        summary: "유니데이즈 인증 학생 대상 삼성 Education Store 기기 할인",
        description:
          "삼성 Education Store를 유니데이즈 인증을 통해 이용하면 갤럭시 북 노트북·갤럭시 탭 등 삼성 기기를 학생 할인 가격에 구매할 수 있다. 학기 시작 시즌에는 추가 사은품·무이자 할부 혜택이 함께 제공되는 경우가 많다." +
          note,
        category: "EDUCATION",
        sourceUrl: "https://www.myunidays.com/KR/ko-KR",
        organizationName: "유니데이즈",
        organizationType: "STUDENT_PLATFORM",
        rules: studentRule,
      },
    ];

    console.log(`[UNIDAYS_KOREA] Curated ${benefits.length} student benefits.`);
    return benefits;
  },
};
