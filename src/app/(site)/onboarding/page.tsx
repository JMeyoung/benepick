import type { Metadata } from "next";
import { OnboardingForm } from "./onboarding-form";

export const metadata: Metadata = { title: "내 조건 입력" };

export default function OnboardingPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-14 relative">
      {/* Decorative orb */}
      <div className="orb orb-primary animate-glow-pulse size-[250px] top-[-60px] left-[-80px] -z-10" />
      
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight">
          <span className="text-gradient">내 조건</span> 입력
        </h1>
        <p className="mt-3 text-base text-muted-foreground leading-relaxed">
          입력한 조건으로 맞춤 혜택을 보여드려요.<br />
          언제든지 수정할 수 있어요.
        </p>
      </div>
      <OnboardingForm />
    </div>
  );
}
