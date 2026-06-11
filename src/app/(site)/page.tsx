import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const VALUE_PROPS = [
  {
    icon: "💳",
    title: "카드 혜택",
    desc: "신한·삼성·현대·KB 등 8개 카드사 혜택",
  },
  {
    icon: "📱",
    title: "통신사 멤버십",
    desc: "SKT·KT·LG U+ 멤버십 혜택",
  },
  {
    icon: "🎓",
    title: "학생 할인",
    desc: "유니데이즈·스튜던트빈즈 학생 전용 혜택",
  },
  {
    icon: "🏙️",
    title: "지역·연령 혜택",
    desc: "청년 패스, 지자체 지원 혜택",
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-background px-4 py-20 text-center">
        <div className="mx-auto max-w-2xl">
          <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
            MVP 베타 오픈 중
          </Badge>
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            내 조건에 맞는<br />
            <span className="text-primary">혜택만</span> 한 번에
          </h1>
          <p className="mt-5 text-lg text-muted-foreground">
            나이·학생 여부·통신사·카드사를 입력하면<br />
            지금 바로 쓸 수 있는 할인 혜택을 정리해 드려요.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="w-full sm:w-auto px-8">
              <Link href="/onboarding">내 혜택 찾기</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto px-8">
              <Link href="/waitlist">베타 신청</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="mx-auto w-full max-w-3xl px-4 py-14">
        <h2 className="mb-8 text-center text-2xl font-bold">모든 혜택을 한 곳에서</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {VALUE_PROPS.map((vp) => (
            <div
              key={vp.title}
              className="flex flex-col items-center gap-2 rounded-xl border bg-card p-5 text-center"
            >
              <span className="text-3xl">{vp.icon}</span>
              <p className="font-semibold">{vp.title}</p>
              <p className="text-xs text-muted-foreground">{vp.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-t bg-muted/40 px-4 py-14">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-8 text-center text-2xl font-bold">이렇게 사용해요</h2>
          <ol className="space-y-5">
            {[
              ["1", "조건 입력", "나이·학생·통신사·카드사·관심 분야를 선택해요."],
              ["2", "맞춤 혜택 확인", "내 조건에 맞는 혜택만 정렬해서 보여드려요."],
              ["3", "저장하고 바로 활용", "마음에 드는 혜택을 저장하고 원문 링크로 이동해요."],
            ].map(([num, title, desc]) => (
              <li key={num} className="flex gap-4 items-start">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm">
                  {num}
                </span>
                <div>
                  <p className="font-semibold">{title}</p>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-10 text-center">
            <Button asChild size="lg" className="px-10">
              <Link href="/onboarding">지금 시작하기 →</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="px-4 py-10 text-center text-sm text-muted-foreground">
        <p>
          모든 혜택에는 <strong>공식 출처 링크</strong>와 <strong>갱신일</strong>이 함께 표시됩니다.
        </p>
      </section>
    </div>
  );
}
