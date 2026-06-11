import type { Metadata } from "next";
import { OnboardingForm } from "./onboarding-form";

export const metadata: Metadata = { title: "내 조건 입력" };

export default function OnboardingPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-extrabold">내 조건 입력</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          입력한 조건으로 맞춤 혜택을 보여드려요. 언제든지 수정할 수 있어요.
        </p>
      </div>
      <OnboardingForm />
    </div>
  );
}
