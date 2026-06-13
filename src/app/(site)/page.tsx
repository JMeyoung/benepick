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
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-24 text-center border-b border-border/50">
        {/* Background Decorative Glowing Blobs */}
        <div className="absolute top-[-20%] left-[10%] -z-10 size-[350px] rounded-full bg-primary/15 blur-[80px]" />
        <div className="absolute bottom-[-10%] right-[10%] -z-10 size-[400px] rounded-full bg-emerald-500/10 blur-[100px]" />
        
        <div className="mx-auto max-w-2xl relative z-10">
          <Badge 
            variant="outline" 
            className="mb-6 border-primary/20 bg-primary/5 text-primary px-3 py-1 font-semibold animate-pulse"
          >
            🚀 MVP 베타 서비스 오픈
          </Badge>
          
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl text-foreground">
            내 조건에 맞는<br />
            <span className="bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">
              혜택만
            </span> 한 번에
          </h1>
          
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            나이·학생 여부·통신사·카드사를 한 번 입력하면<br />
            지금 당장 바로 쓸 수 있는 할인 혜택들만 모아서 보여드려요.
          </p>
          
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button 
              asChild 
              size="lg" 
              className="w-full sm:w-auto px-10 h-12 text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <Link href="/onboarding">내 맞춤 혜택 찾기 →</Link>
            </Button>
            <Button 
              asChild 
              variant="outline" 
              size="lg" 
              className="w-full sm:w-auto px-10 h-12 text-base font-semibold hover:bg-accent/50 transition-colors"
            >
              <Link href="/waitlist">베타 테스터 신청</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Value Props Section */}
      <section className="mx-auto w-full max-w-4xl px-4 py-20">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight">모든 할인 혜택을 한 곳에서</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUE_PROPS.map((vp) => (
            <div
              key={vp.title}
              className="flex flex-col items-center gap-3 rounded-2xl border border-border/60 bg-card/50 p-6 text-center backdrop-blur-sm shadow-sm hover:shadow-md hover:border-primary/25 transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/5 text-3xl mb-2">
                {vp.icon}
              </div>
              <p className="font-bold text-lg text-foreground">{vp.title}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{vp.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works Section */}
      <section className="border-t border-b border-border/40 bg-muted/20 px-4 py-20">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight">이렇게 간편하게 사용해요</h2>
          <ol className="space-y-8">
            {[
              ["1", "조건 입력", "나이·학생 여부·통신사·주로 쓰는 카드사 등 간단한 맞춤 조건을 선택해요."],
              ["2", "나만의 혜택 확인", "입력해주신 조건에 가장 잘 부합하는 순서대로 혜택을 랭킹 필터링하여 매칭해 드려요."],
              ["3", "저장 및 활용", "눈에 띄는 혜택을 나중에 찾아보기 편하도록 저장하고, 공식 출처에서 바로 확인해요."],
            ].map(([num, title, desc]) => (
              <li key={num} className="flex gap-6 items-start">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-emerald-500 text-primary-foreground font-extrabold text-base shadow-sm">
                  {num}
                </span>
                <div>
                  <p className="font-bold text-lg text-foreground">{title}</p>
                  <p className="text-base text-muted-foreground mt-1 leading-relaxed">{desc}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-14 text-center">
            <Button 
              asChild 
              size="lg" 
              className="px-12 h-12 text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300"
            >
              <Link href="/onboarding">지금 무료로 체험해보기 →</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="px-4 py-12 text-center text-sm text-muted-foreground border-t border-border/20">
        <div className="flex items-center justify-center gap-2">
          <span>🔒 모든 혜택 정보에는 <strong>공식 출처 링크</strong>와 <strong>최종 갱신일</strong>이 필수 표시됩니다.</span>
        </div>
      </section>
    </div>
  );
}
