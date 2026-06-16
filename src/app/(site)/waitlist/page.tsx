import type { Metadata } from "next";
import { WaitlistForm } from "./waitlist-form";
import { UtmCapture } from "./utm-capture";

export const metadata: Metadata = { title: "베타 신청 | 베네픽" };

export default function WaitlistPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-14 relative">
      {/* Decorative orb */}
      <div className="orb orb-teal animate-glow-pulse size-[200px] top-[-40px] right-[-60px] -z-10" />
      
      <UtmCapture />
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight">
          <span className="text-gradient">베타 테스트</span> 신청
        </h1>
        <p className="mt-3 text-base text-muted-foreground leading-relaxed">
          베네픽 베타 오픈 소식을 가장 먼저 받아보거나,<br />
          사용자 인터뷰에 참여해 서비스 개선에 기여해 보세요.
        </p>
      </div>
      <WaitlistForm />
    </div>
  );
}
