// 베네픽 시드 데이터.
// ⚠️ 혜택 내용은 실제 멤버십/카드/학생 혜택을 모사한 "예시 데이터"다.
// 실제 조건·할인율과 다를 수 있으며, sourceUrl의 공식 페이지가 항상 기준이다.
// 실행: npm run db:seed (기존 데이터를 모두 지우고 다시 넣는다)

import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(__dirname, "../.env") });

import bcrypt from "bcryptjs";
import ws from "ws";
import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../src/generated/prisma/client";

neonConfig.webSocketConstructor = ws;

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) throw new Error(".env의 DATABASE_URL이 설정되지 않았습니다.");

const adapter = new PrismaNeon({ connectionString: dbUrl });
const prisma = new PrismaClient({ adapter });

const d = (y: number, m: number, day: number) => new Date(y, m - 1, day, 12, 0, 0);

type OrgSeed = { key: string; name: string; type: string; websiteUrl?: string };

const ORGS: OrgSeed[] = [
  { key: "SKT", name: "SKT", type: "TELECOM", websiteUrl: "https://www.tworld.co.kr" },
  { key: "KT", name: "KT", type: "TELECOM", websiteUrl: "https://membership.kt.com" },
  { key: "LGU", name: "LG유플러스", type: "TELECOM", websiteUrl: "https://www.lguplus.com" },
  { key: "SHINHAN", name: "신한카드", type: "CARD", websiteUrl: "https://www.shinhancard.com" },
  { key: "SAMSUNG", name: "삼성카드", type: "CARD", websiteUrl: "https://www.samsungcard.com" },
  { key: "HYUNDAI", name: "현대카드", type: "CARD", websiteUrl: "https://www.hyundaicard.com" },
  { key: "KB", name: "KB국민카드", type: "CARD", websiteUrl: "https://card.kbcard.com" },
  { key: "LOTTE", name: "롯데카드", type: "CARD", websiteUrl: "https://www.lottecard.co.kr" },
  { key: "WOORI", name: "우리카드", type: "CARD", websiteUrl: "https://www.wooricard.com" },
  { key: "HANA", name: "하나카드", type: "CARD", websiteUrl: "https://www.hanacard.co.kr" },
  { key: "BC", name: "BC카드", type: "CARD", websiteUrl: "https://www.bccard.com" },
  { key: "UNIDAYS", name: "유니데이즈", type: "STUDENT_PLATFORM", websiteUrl: "https://www.myunidays.com" },
  { key: "STUDENTBEANS", name: "스튜던트빈즈", type: "STUDENT_PLATFORM", websiteUrl: "https://www.studentbeans.com" },
  { key: "SPOTIFY", name: "스포티파이", type: "BRAND", websiteUrl: "https://www.spotify.com/kr-ko" },
  { key: "KORAIL", name: "코레일", type: "BRAND", websiteUrl: "https://www.letskorail.com" },
  { key: "CGV", name: "CGV", type: "BRAND", websiteUrl: "https://www.cgv.co.kr" },
  { key: "SEOUL", name: "서울특별시", type: "GOVERNMENT", websiteUrl: "https://youth.seoul.go.kr" },
  { key: "GYEONGGI", name: "경기도", type: "GOVERNMENT", websiteUrl: "https://www.gg.go.kr" },
  { key: "EDIYA", name: "이디야커피", type: "BRAND", websiteUrl: "https://www.ediya.com" },
  { key: "BAEMIN", name: "배달의민족", type: "BRAND", websiteUrl: "https://www.baemin.com" },
];

type RuleSeed =
  | { ruleType: "AGE_RANGE"; minAge: number; maxAge: number }
  | { ruleType: "STUDENT_ONLY" }
  | { ruleType: "TELECOM"; stringValue: string }
  | { ruleType: "CARD_ISSUER"; stringValue: string }
  | { ruleType: "REGION"; stringValue: string };

type BenefitSeed = {
  title: string;
  summary: string;
  description: string;
  category: string;
  status?: string;
  sourceUrl: string;
  sourceUpdatedAt: Date;
  endsAt?: Date;
  isFeatured?: boolean;
  region?: string;
  rules?: RuleSeed[];
  providers: string[]; // ORGS key
  partners?: string[];
};

const BENEFITS: BenefitSeed[] = [
  // ---- 통신사 멤버십 ----
  {
    title: "KT 멤버십 파리바게뜨 할인",
    summary: "KT 멤버십 등급에 따라 1천 원당 최대 100원 할인",
    description:
      "KT 멤버십 앱 바코드를 결제 전에 제시하면 등급에 따라 1천 원당 50~100원이 할인됩니다. 일 1회 사용 가능하며, 일부 매장과 행사 상품은 제외될 수 있습니다.",
    category: "CAFE_FOOD",
    sourceUrl: "https://membership.kt.com",
    sourceUpdatedAt: d(2026, 6, 5),
    isFeatured: true,
    rules: [{ ruleType: "TELECOM", stringValue: "KT" }],
    providers: ["KT"],
  },
  {
    title: "KT 멤버십 CGV 영화 예매 할인",
    summary: "CGV 영화 예매 시 KT 멤버십 포인트로 할인",
    description:
      "KT 멤버십 앱 또는 CGV 예매 화면에서 멤버십을 선택하면 1일 1회 영화 예매 할인이 적용됩니다. 좌석 등급과 특별관에 따라 할인 폭이 다를 수 있습니다.",
    category: "CULTURE",
    sourceUrl: "https://membership.kt.com",
    sourceUpdatedAt: d(2026, 5, 28),
    rules: [{ ruleType: "TELECOM", stringValue: "KT" }],
    providers: ["KT"],
    partners: ["CGV"],
  },
  {
    title: "KT Y덤 — 만 34세 이하 데이터 2배",
    summary: "만 34세 이하 가입자에게 5G 요금제 데이터 2배 제공",
    description:
      "만 34세 이하 KT 가입자가 대상 5G 요금제를 사용하면 기본 데이터가 2배로 제공됩니다. 별도 신청 없이 나이 조건이 확인되면 자동 적용됩니다.",
    category: "TELECOM",
    sourceUrl: "https://www.kt.com",
    sourceUpdatedAt: d(2026, 6, 8),
    isFeatured: true,
    rules: [
      { ruleType: "TELECOM", stringValue: "KT" },
      { ruleType: "AGE_RANGE", minAge: 13, maxAge: 34 },
    ],
    providers: ["KT"],
  },
  {
    title: "T멤버십 뚜레쥬르 할인",
    summary: "T멤버십 등급별 뚜레쥬르 결제 금액 할인",
    description:
      "T멤버십 앱 바코드를 제시하면 등급에 따라 결제 금액의 일부가 할인됩니다. 일부 케이크·행사 상품은 제외되며 다른 쿠폰과 중복 적용되지 않을 수 있습니다.",
    category: "CAFE_FOOD",
    sourceUrl: "https://www.tworld.co.kr",
    sourceUpdatedAt: d(2026, 6, 2),
    rules: [{ ruleType: "TELECOM", stringValue: "SKT" }],
    providers: ["SKT"],
  },
  {
    title: "T멤버십 롯데월드 자유이용권 할인",
    summary: "롯데월드 어드벤처 자유이용권 최대 40% 할인",
    description:
      "T멤버십 회원이 현장 매표소 또는 앱에서 멤버십을 인증하면 본인 포함 일행 일부까지 자유이용권 할인이 적용됩니다. 성수기에는 할인율이 달라질 수 있습니다.",
    category: "CULTURE",
    sourceUrl: "https://www.tworld.co.kr",
    sourceUpdatedAt: d(2026, 4, 20),
    region: "서울",
    rules: [{ ruleType: "TELECOM", stringValue: "SKT" }],
    providers: ["SKT"],
  },
  {
    title: "SKT 0(영) 청년 혜택",
    summary: "만 34세 이하 전용 요금제와 커피·영화 쿠폰 제공",
    description:
      "만 34세 이하 SKT 가입자는 0 청년 요금제로 데이터 추가 제공과 함께 카페·영화 할인 쿠폰을 정기적으로 받을 수 있습니다. 쿠폰은 T멤버십 앱에서 확인합니다.",
    category: "TELECOM",
    sourceUrl: "https://www.tworld.co.kr",
    sourceUpdatedAt: d(2026, 5, 15),
    rules: [
      { ruleType: "TELECOM", stringValue: "SKT" },
      { ruleType: "AGE_RANGE", minAge: 13, maxAge: 34 },
    ],
    providers: ["SKT"],
  },
  {
    title: "U+ 멤버십 GS25 할인",
    summary: "GS25에서 1천 원당 100원 멤버십 할인",
    description:
      "U+ 멤버십 앱 바코드를 GS25 결제 시 제시하면 1천 원당 100원이 할인됩니다. 일 1회, 월 사용 한도가 있으며 담배 등 일부 품목은 제외됩니다.",
    category: "LIFE",
    sourceUrl: "https://www.lguplus.com",
    sourceUpdatedAt: d(2026, 6, 9),
    rules: [{ ruleType: "TELECOM", stringValue: "LGU" }],
    providers: ["LGU"],
  },
  {
    title: "U+ 멤버십 메가박스 영화 할인",
    summary: "메가박스 영화 예매 시 등급별 할인 제공",
    description:
      "U+ 멤버십 회원은 메가박스 예매 시 등급에 따라 할인 또는 1+1 혜택을 받을 수 있습니다. 주말·특별관은 적용 조건이 다를 수 있습니다.",
    category: "CULTURE",
    sourceUrl: "https://www.lguplus.com",
    sourceUpdatedAt: d(2026, 3, 30),
    rules: [{ ruleType: "TELECOM", stringValue: "LGU" }],
    providers: ["LGU"],
  },

  // ---- 카드사 ----
  {
    title: "신한카드 스타벅스 20% 청구할인",
    summary: "스타벅스 결제 시 20% 청구할인 (월 한도 내)",
    description:
      "대상 신한카드로 스타벅스에서 결제하면 결제 금액의 20%가 청구할인됩니다. 전월 실적 조건과 월 할인 한도가 있으니 카드별 상세 페이지를 확인하세요.",
    category: "CAFE_FOOD",
    sourceUrl: "https://www.shinhancard.com",
    sourceUpdatedAt: d(2026, 6, 1),
    isFeatured: true,
    rules: [{ ruleType: "CARD_ISSUER", stringValue: "SHINHAN" }],
    providers: ["SHINHAN"],
  },
  {
    title: "신한 대학생 체크카드 혜택 패키지",
    summary: "대학생 인증 시 편의점·카페 적립률 상향",
    description:
      "대학생 인증을 완료한 신한 체크카드 회원은 편의점·카페·온라인 서점 적립률이 상향됩니다. 학기 단위로 재인증이 필요할 수 있습니다.",
    category: "FINANCE",
    sourceUrl: "https://www.shinhancard.com",
    sourceUpdatedAt: d(2026, 5, 10),
    rules: [
      { ruleType: "CARD_ISSUER", stringValue: "SHINHAN" },
      { ruleType: "STUDENT_ONLY" },
    ],
    providers: ["SHINHAN"],
  },
  {
    title: "삼성카드 이마트 5% 할인",
    summary: "이마트 오프라인 결제 5% 할인 (월 2회)",
    description:
      "대상 삼성카드로 이마트에서 결제하면 5% 할인이 월 2회 적용됩니다. 전월 실적 30만 원 이상 조건이 있으며 트레이더스는 제외될 수 있습니다.",
    category: "SHOPPING",
    sourceUrl: "https://www.samsungcard.com",
    sourceUpdatedAt: d(2026, 5, 25),
    rules: [{ ruleType: "CARD_ISSUER", stringValue: "SAMSUNG" }],
    providers: ["SAMSUNG"],
  },
  {
    title: "현대카드 코스트코 적립",
    summary: "코스트코 결제 금액의 일부를 M포인트로 적립",
    description:
      "코스트코 제휴 현대카드로 결제하면 결제 금액의 일부가 M포인트로 적립됩니다. 적립률은 카드 등급과 이용 실적에 따라 달라집니다.",
    category: "SHOPPING",
    sourceUrl: "https://www.hyundaicard.com",
    sourceUpdatedAt: d(2026, 4, 12),
    rules: [{ ruleType: "CARD_ISSUER", stringValue: "HYUNDAI" }],
    providers: ["HYUNDAI"],
  },
  {
    title: "KB국민카드 대중교통 10% 할인",
    summary: "버스·지하철 요금 10% 청구할인",
    description:
      "대상 KB국민카드로 버스·지하철을 이용하면 월 한도 내에서 10% 청구할인이 적용됩니다. 후불교통 기능이 등록된 카드만 해당됩니다.",
    category: "TRANSPORT",
    sourceUrl: "https://card.kbcard.com",
    sourceUpdatedAt: d(2026, 6, 7),
    isFeatured: true,
    rules: [{ ruleType: "CARD_ISSUER", stringValue: "KB" }],
    providers: ["KB"],
  },
  {
    title: "롯데카드 롯데시네마 할인",
    summary: "롯데시네마 예매 시 2천~4천 원 할인",
    description:
      "대상 롯데카드로 롯데시네마에서 예매하면 회당 2천~4천 원이 할인됩니다. 월 횟수 제한이 있고 특별관은 제외될 수 있습니다.",
    category: "CULTURE",
    sourceUrl: "https://www.lottecard.co.kr",
    sourceUpdatedAt: d(2026, 5, 18),
    rules: [{ ruleType: "CARD_ISSUER", stringValue: "LOTTE" }],
    providers: ["LOTTE"],
  },
  {
    title: "우리카드 통신요금 자동이체 할인",
    summary: "통신요금 자동이체 시 월 최대 1만 원 할인",
    description:
      "대상 우리카드로 통신요금을 자동이체하면 전월 실적에 따라 월 최대 1만 원이 할인됩니다. 통신사 제한 없이 적용됩니다.",
    category: "TELECOM",
    sourceUrl: "https://www.wooricard.com",
    sourceUpdatedAt: d(2026, 5, 2),
    rules: [{ ruleType: "CARD_ISSUER", stringValue: "WOORI" }],
    providers: ["WOORI"],
  },
  {
    title: "하나카드 올리브영 10% 할인",
    summary: "올리브영 온·오프라인 결제 10% 할인",
    description:
      "대상 하나카드로 올리브영에서 결제하면 10% 할인이 적용됩니다. 월 할인 한도와 전월 실적 조건을 확인하세요.",
    category: "BEAUTY_HEALTH",
    sourceUrl: "https://www.hanacard.co.kr",
    sourceUpdatedAt: d(2026, 6, 3),
    rules: [{ ruleType: "CARD_ISSUER", stringValue: "HANA" }],
    providers: ["HANA"],
  },
  {
    title: "BC카드 페이북 포인트 적립",
    summary: "페이북 QR 결제 시 결제 금액 적립",
    description:
      "페이북 앱으로 QR 결제하면 결제 금액의 일부가 포인트로 적립됩니다. 적립률은 프로모션 기간에 따라 달라질 수 있습니다.",
    category: "FINANCE",
    sourceUrl: "https://www.bccard.com",
    sourceUpdatedAt: d(2026, 3, 22),
    rules: [{ ruleType: "CARD_ISSUER", stringValue: "BC" }],
    providers: ["BC"],
  },

  // ---- 학생 전용 ----
  {
    title: "유니데이즈 Apple 교육 할인",
    summary: "대학생 인증 시 Mac·iPad 교육 할인가 적용",
    description:
      "유니데이즈에서 대학생 인증을 하면 Apple 교육 스토어에서 Mac·iPad를 할인가에 구매할 수 있습니다. 연간 구매 수량 제한이 있습니다.",
    category: "EDUCATION",
    sourceUrl: "https://www.myunidays.com",
    sourceUpdatedAt: d(2026, 6, 4),
    isFeatured: true,
    rules: [{ ruleType: "STUDENT_ONLY" }],
    providers: ["UNIDAYS"],
  },
  {
    title: "스튜던트빈즈 나이키 학생 할인",
    summary: "학생 인증 시 나이키 온라인 10% 할인 코드",
    description:
      "스튜던트빈즈에서 학생 인증 후 발급받은 코드를 나이키 온라인 스토어 결제 시 입력하면 10% 할인이 적용됩니다. 일부 한정판은 제외됩니다.",
    category: "SHOPPING",
    sourceUrl: "https://www.studentbeans.com",
    sourceUpdatedAt: d(2026, 5, 20),
    rules: [{ ruleType: "STUDENT_ONLY" }],
    providers: ["STUDENTBEANS"],
  },
  {
    title: "스포티파이 학생 요금제 50% 할인",
    summary: "대학생 인증 시 프리미엄 요금제 반값",
    description:
      "재학 인증을 완료하면 스포티파이 프리미엄을 50% 할인된 가격에 이용할 수 있습니다. 12개월마다 재인증이 필요하며 최대 4년까지 적용됩니다.",
    category: "CULTURE",
    sourceUrl: "https://www.spotify.com/kr-ko/student",
    sourceUpdatedAt: d(2026, 6, 6),
    rules: [{ ruleType: "STUDENT_ONLY" }],
    providers: ["SPOTIFY"],
  },

  // ---- 연령/지역 ----
  {
    title: "KTX 청년 할인 (힘내라 청년)",
    summary: "만 19~34세 KTX 운임 10~40% 할인",
    description:
      "만 19~34세는 코레일톡에서 청년 할인 대상 좌석을 예매하면 운임의 10~40%를 할인받을 수 있습니다. 좌석 수량이 한정되어 조기 매진될 수 있습니다.",
    category: "TRANSPORT",
    sourceUrl: "https://www.letskorail.com",
    sourceUpdatedAt: d(2026, 6, 10),
    isFeatured: true,
    rules: [{ ruleType: "AGE_RANGE", minAge: 19, maxAge: 34 }],
    providers: ["KORAIL"],
  },
  {
    title: "서울 청년문화패스",
    summary: "만 19~23세 서울 청년에게 공연·전시 관람비 지원",
    description:
      "서울 거주 만 19~23세 청년에게 연간 20만 원 상당의 공연·전시 관람 지원금을 제공합니다. 신청 기간과 소득 기준 등 조건은 공고를 확인하세요.",
    category: "CULTURE",
    sourceUrl: "https://youth.seoul.go.kr",
    sourceUpdatedAt: d(2026, 5, 30),
    region: "서울",
    rules: [
      { ruleType: "AGE_RANGE", minAge: 19, maxAge: 23 },
      { ruleType: "REGION", stringValue: "서울" },
    ],
    providers: ["SEOUL"],
  },
  {
    title: "경기 청소년 교통비 지원",
    summary: "경기 거주 만 13~23세 대중교통비 분기별 지원",
    description:
      "경기도에 거주하는 만 13~23세 청소년·청년에게 분기별 대중교통비 일부를 지역화폐로 환급합니다. 경기도 통합 포털에서 신청합니다.",
    category: "TRANSPORT",
    sourceUrl: "https://www.gg.go.kr",
    sourceUpdatedAt: d(2026, 4, 28),
    region: "경기",
    rules: [
      { ruleType: "AGE_RANGE", minAge: 13, maxAge: 23 },
      { ruleType: "REGION", stringValue: "경기" },
    ],
    providers: ["GYEONGGI"],
  },

  // ---- 전체 공개 ----
  {
    title: "CGV 컬처데이 할인",
    summary: "매월 마지막 수요일 영화 관람 할인",
    description:
      "문화가 있는 날(매월 마지막 수요일) 오후 시간대에 CGV에서 영화를 할인된 가격에 관람할 수 있습니다. 일부 특별관은 제외됩니다.",
    category: "CULTURE",
    sourceUrl: "https://www.cgv.co.kr",
    sourceUpdatedAt: d(2026, 6, 1),
    providers: ["CGV"],
  },
  {
    title: "이디야 멤버스 적립 혜택",
    summary: "음료 구매 시 스탬프 적립, 11잔째 무료",
    description:
      "이디야 멤버스 앱으로 음료를 구매하면 스탬프가 적립되고, 10개를 모으면 무료 음료 쿠폰이 발급됩니다. 일부 음료는 적립 제외될 수 있습니다.",
    category: "CAFE_FOOD",
    sourceUrl: "https://www.ediya.com",
    sourceUpdatedAt: d(2026, 5, 12),
    providers: ["EDIYA"],
  },
  {
    title: "배달의민족 첫 주문 쿠폰",
    summary: "신규 가입 시 첫 주문 할인 쿠폰 제공",
    description:
      "배달의민족에 신규 가입하면 첫 주문에 사용할 수 있는 할인 쿠폰이 제공됩니다. 쿠폰 금액과 최소 주문 금액은 시기에 따라 달라질 수 있습니다.",
    category: "CAFE_FOOD",
    sourceUrl: "https://www.baemin.com",
    sourceUpdatedAt: d(2026, 6, 9),
    providers: ["BAEMIN"],
  },

  // ---- 상태 검증용 (종료/초안/보관) ----
  {
    title: "롯데카드 봄맞이 백화점 5% 할인",
    summary: "백화점 결제 5% 청구할인 (5월 말 종료)",
    description:
      "봄 시즌 한정으로 백화점 결제 금액의 5%가 청구할인되었던 프로모션입니다. 2026년 5월 31일로 종료되었습니다.",
    category: "SHOPPING",
    sourceUrl: "https://www.lottecard.co.kr",
    sourceUpdatedAt: d(2026, 5, 1),
    endsAt: d(2026, 5, 31),
    rules: [{ ruleType: "CARD_ISSUER", stringValue: "LOTTE" }],
    providers: ["LOTTE"],
  },
  {
    title: "신한카드 여름 카페 프로모션 (준비 중)",
    summary: "여름 시즌 카페 추가 할인 — 검수 중",
    description: "여름 시즌 카페 추가 할인 프로모션 초안입니다. 출처 검수 후 게시 예정입니다.",
    category: "CAFE_FOOD",
    status: "DRAFT",
    sourceUrl: "https://www.shinhancard.com",
    sourceUpdatedAt: d(2026, 6, 10),
    rules: [{ ruleType: "CARD_ISSUER", stringValue: "SHINHAN" }],
    providers: ["SHINHAN"],
  },
  {
    title: "우리카드 2025 겨울 페스타 (종료)",
    summary: "지난 시즌 프로모션 — 보관 처리",
    description: "2025년 겨울 시즌 프로모션으로 현재는 종료되어 보관 상태입니다.",
    category: "SHOPPING",
    status: "ARCHIVED",
    sourceUrl: "https://www.wooricard.com",
    sourceUpdatedAt: d(2026, 1, 5),
    rules: [{ ruleType: "CARD_ISSUER", stringValue: "WOORI" }],
    providers: ["WOORI"],
  },
];

async function main() {
  console.log("🧹 기존 데이터 삭제...");
  await prisma.eventLog.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.leadSubmission.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.visitorProfile.deleteMany();
  await prisma.eligibilityRule.deleteMany();
  await prisma.benefitOrganization.deleteMany();
  await prisma.benefit.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.adminUser.deleteMany();

  console.log("🏢 조직 생성...");
  const orgIdByKey = new Map<string, string>();
  for (const org of ORGS) {
    const created = await prisma.organization.create({
      data: { name: org.name, type: org.type, websiteUrl: org.websiteUrl },
    });
    orgIdByKey.set(org.key, created.id);
  }

  console.log("🎁 혜택 생성...");
  for (const b of BENEFITS) {
    await prisma.benefit.create({
      data: {
        title: b.title,
        summary: b.summary,
        description: b.description,
        category: b.category,
        status: b.status ?? "PUBLISHED",
        sourceUrl: b.sourceUrl,
        sourceUpdatedAt: b.sourceUpdatedAt,
        endsAt: b.endsAt,
        isFeatured: b.isFeatured ?? false,
        region: b.region,
        rules: {
          create: (b.rules ?? []).map((r) => ({
            ruleType: r.ruleType,
            minAge: "minAge" in r ? r.minAge : null,
            maxAge: "maxAge" in r ? r.maxAge : null,
            stringValue: "stringValue" in r ? r.stringValue : null,
          })),
        },
        organizations: {
          create: [
            ...b.providers.map((key) => ({
              organizationId: orgIdByKey.get(key)!,
              role: "PROVIDER",
            })),
            ...(b.partners ?? []).map((key) => ({
              organizationId: orgIdByKey.get(key)!,
              role: "PARTNER",
            })),
          ],
        },
      },
    });
  }

  console.log("👤 관리자 생성...");
  const email = process.env.ADMIN_EMAIL ?? "admin@benepick.local";
  const password = process.env.ADMIN_PASSWORD ?? "benepick2026!";
  await prisma.adminUser.create({
    data: {
      email,
      passwordHash: bcrypt.hashSync(password, 10),
      name: "운영자",
    },
  });

  const counts = {
    organizations: await prisma.organization.count(),
    benefits: await prisma.benefit.count(),
    published: await prisma.benefit.count({ where: { status: "PUBLISHED" } }),
    rules: await prisma.eligibilityRule.count(),
  };
  console.log("✅ 시드 완료:", counts, `관리자: ${email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
