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
    <div className="flex flex-col min-h-screen bg-background">
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden px-4 py-28 sm:py-36 text-center">
        {/* Animated decorative orbs */}
        <div className="orb orb-primary animate-float size-[400px] top-[-15%] left-[5%] -z-10" />
        <div className="orb orb-teal animate-float-delayed size-[350px] top-[10%] right-[0%] -z-10" />
        <div className="orb orb-cyan animate-float-slow size-[300px] bottom-[-10%] left-[30%] -z-10" />
        
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(oklch(0.55_0.16_168/0.06)_1px,transparent_1px)] [background-size:32px_32px]" />

        <div className="mx-auto max-w-2xl relative z-10">
          <Badge 
            variant="outline" 
            className="mb-8 border-primary/25 bg-primary/5 text-primary px-4 py-1.5 font-semibold text-sm backdrop-blur-sm shadow-sm shadow-primary/10"
          >
            ✦ MVP 베타 서비스 오픈
          </Badge>
          
          <h1 className="text-5xl font-extrabold leading-[1.15] tracking-tight sm:text-7xl text-foreground">
            내 조건에 맞는<br />
            <span className="text-gradient">
              혜택만
            </span>{" "}
            한 번에
          </h1>
          
          <p className="mt-7 text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto">
            나이·학생 여부·통신사·카드사를 한 번 입력하면<br />
            지금 당장 바로 쓸 수 있는 할인 혜택들만 모아서 보여드려요.
          </p>
          
          <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button 
              asChild 
              size="lg" 
              className="shimmer-btn w-full sm:w-auto px-12 h-13 text-base font-bold text-white rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/35 transition-all duration-500 hover:-translate-y-0.5"
            >
              <Link href="/onboarding">내 맞춤 혜택 찾기 →</Link>
            </Button>
            <Button 
              asChild 
              variant="outline" 
              size="lg" 
              className="w-full sm:w-auto px-12 h-13 text-base font-semibold rounded-xl border-border/60 bg-background/50 backdrop-blur-sm hover:bg-primary/5 hover:border-primary/30 transition-all duration-300"
            >
              <Link href="/waitlist">베타 테스터 신청</Link>
            </Button>
          </div>
        </div>
        
        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-background to-transparent -z-[5]" />
      </section>

      {/* ── Value Props Section ── */}
      <section className="mx-auto w-full max-w-4xl px-4 py-24">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            모든 할인 혜택을 <span className="text-gradient">한 곳에서</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">흩어진 혜택 정보, 더 이상 찾아다니지 마세요.</p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {VALUE_PROPS.map((vp, i) => (
            <div
              key={vp.title}
              className="card-premium group flex flex-col items-center gap-4 rounded-2xl bg-card/60 p-7 text-center backdrop-blur-sm"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-premium-cyan/10 text-3xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                {vp.icon}
              </div>
              <p className="font-bold text-lg text-foreground">{vp.title}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{vp.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works Section ── */}
      <section className="relative border-t border-border/30 px-4 py-24 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/[0.02] via-transparent to-primary/[0.02]" />
        
        <div className="mx-auto max-w-2xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              이렇게 <span className="text-gradient">간편하게</span> 사용해요
            </h2>
          </div>
          <ol className="space-y-10 relative">
            {/* Connecting line */}
            <div className="absolute left-5 top-12 bottom-12 w-px bg-gradient-to-b from-primary/30 via-premium-teal/20 to-transparent" />
            
            {[
              ["1", "조건 입력", "나이·학생 여부·통신사·주로 쓰는 카드사 등 간단한 맞춤 조건을 선택해요."],
              ["2", "나만의 혜택 확인", "입력해주신 조건에 가장 잘 부합하는 순서대로 혜택을 랭킹 필터링하여 매칭해 드려요."],
              ["3", "저장 및 활용", "눈에 띄는 혜택을 나중에 찾아보기 편하도록 저장하고, 공식 출처에서 바로 확인해요."],
            ].map(([num, title, desc]) => (
              <li key={num} className="flex gap-6 items-start relative">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-premium-cyan text-white font-extrabold text-base shadow-md shadow-primary/20 ring-4 ring-background relative z-10">
                  {num}
                </span>
                <div className="pt-0.5">
                  <p className="font-bold text-lg text-foreground">{title}</p>
                  <p className="text-base text-muted-foreground mt-1.5 leading-relaxed">{desc}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-16 text-center">
            <Button 
              asChild 
              size="lg" 
              className="shimmer-btn px-14 h-13 text-base font-bold text-white rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/35 transition-all duration-500"
            >
              <Link href="/onboarding">지금 무료로 체험해보기 →</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Trust Banner ── */}
      <section className="relative px-4 py-14 text-center border-t border-border/20">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-primary/[0.03] to-transparent" />
        <div className="flex items-center justify-center gap-3">
          <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-sm">🔒</span>
          <span className="text-sm text-muted-foreground">
            모든 혜택 정보에는 <strong className="text-foreground">공식 출처 링크</strong>와 <strong className="text-foreground">최종 갱신일</strong>이 필수 표시됩니다.
          </span>
        </div>
      </section>
    </div>
  );
}
