"use client";

import { useActionState } from "react";
import { submitLeadAction } from "@/app/actions/leads";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";

const INITIAL = { error: null as string | null, success: false };

export function WaitlistForm() {
  const [state, action, pending] = useActionState(submitLeadAction, INITIAL);

  if (state.success) {
    return (
      <div className="rounded-2xl glass card-premium p-10 text-center space-y-4">
        <div className="size-16 mx-auto rounded-2xl bg-gradient-to-br from-primary/10 to-premium-cyan/10 flex items-center justify-center text-4xl">
          🎉
        </div>
        <p className="font-bold text-xl text-foreground">신청 완료!</p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          베타 오픈 또는 인터뷰 일정이 정해지면 입력하신 연락처로 먼저 안내해 드릴게요.
        </p>
        <Button asChild variant="outline" className="mt-6 border-primary/20 text-primary hover:bg-primary/5">
          <Link href="/benefits">혜택 목록 보기</Link>
        </Button>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-6">
      {/* 유형 선택 */}
      <fieldset>
        <legend className="mb-3 font-bold text-sm uppercase tracking-wider text-muted-foreground">신청 유형 *</legend>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: "WAITLIST", label: "대기자 등록", desc: "베타 오픈 알림 수신" },
            { value: "INTERVIEW", label: "인터뷰 신청", desc: "30분 사용자 인터뷰 참여" },
          ].map((opt) => (
            <label
              key={opt.value}
              className="flex cursor-pointer flex-col rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-5 transition-all duration-300 has-[:checked]:border-primary/40 has-[:checked]:bg-gradient-to-br has-[:checked]:from-primary/10 has-[:checked]:to-premium-cyan/10 has-[:checked]:shadow-sm has-[:checked]:shadow-primary/10 hover:border-primary/20 hover:bg-primary/[0.03]"
            >
              <input type="radio" name="type" value={opt.value} className="sr-only" required />
              <span className="font-bold text-sm">{opt.label}</span>
              <span className="text-xs text-muted-foreground mt-1">{opt.desc}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-semibold">이름 (선택)</Label>
        <Input id="name" name="name" placeholder="홍길동" className="rounded-xl border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 focus:border-primary/40 focus:ring-2 focus:ring-primary/10" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact" className="text-sm font-semibold">이메일 또는 연락처 *</Label>
        <Input id="contact" name="contact" required placeholder="hello@example.com" className="rounded-xl border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 focus:border-primary/40 focus:ring-2 focus:ring-primary/10" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message" className="text-sm font-semibold">한마디 (선택)</Label>
        <Textarea
          id="message"
          name="message"
          rows={3}
          placeholder="혜택을 찾을 때 가장 불편한 점이 있다면 알려주세요."
          className="rounded-xl border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
        />
      </div>

      {/* 개인정보 동의 */}
      <div className="rounded-xl glass-subtle p-5 space-y-3">
        <div className="flex items-start gap-2.5">
          <Checkbox id="consent" name="consent" value="true" required className="mt-0.5" />
          <Label htmlFor="consent" className="cursor-pointer text-sm leading-relaxed">
            개인정보(이름, 연락처)를 베타 운영 목적으로 수집·이용하는 것에 동의합니다.{" "}
            <Link href="/privacy" className="text-primary underline-offset-4 hover:underline font-medium" target="_blank">
              개인정보처리방침
            </Link>
          </Label>
        </div>
      </div>

      {state.error && (
        <p className="rounded-xl bg-destructive/10 border border-destructive/20 px-5 py-3 text-sm text-destructive font-medium">{state.error}</p>
      )}

      <Button type="submit" disabled={pending} className="shimmer-btn w-full h-13 text-base font-bold text-white rounded-xl shadow-lg shadow-primary/20" size="lg">
        {pending ? "제출 중..." : "신청 완료"}
      </Button>
    </form>
  );
}
