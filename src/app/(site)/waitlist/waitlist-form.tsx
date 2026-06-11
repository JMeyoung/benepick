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
      <div className="rounded-xl border bg-card p-8 text-center space-y-3">
        <p className="text-4xl">🎉</p>
        <p className="font-semibold text-lg">신청 완료!</p>
        <p className="text-sm text-muted-foreground">
          베타 오픈 또는 인터뷰 일정이 정해지면 입력하신 연락처로 먼저 안내해 드릴게요.
        </p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/benefits">혜택 목록 보기</Link>
        </Button>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-5">
      {/* 유형 선택 */}
      <fieldset>
        <legend className="mb-2 font-semibold text-sm">신청 유형 *</legend>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: "WAITLIST", label: "대기자 등록", desc: "베타 오픈 알림 수신" },
            { value: "INTERVIEW", label: "인터뷰 신청", desc: "30분 사용자 인터뷰 참여" },
          ].map((opt) => (
            <label
              key={opt.value}
              className="flex cursor-pointer flex-col rounded-xl border p-4 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/10"
            >
              <input type="radio" name="type" value={opt.value} className="sr-only" required />
              <span className="font-semibold text-sm">{opt.label}</span>
              <span className="text-xs text-muted-foreground mt-0.5">{opt.desc}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="space-y-2">
        <Label htmlFor="name">이름 (선택)</Label>
        <Input id="name" name="name" placeholder="홍길동" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact">이메일 또는 연락처 *</Label>
        <Input id="contact" name="contact" required placeholder="hello@example.com" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">한마디 (선택)</Label>
        <Textarea
          id="message"
          name="message"
          rows={3}
          placeholder="혜택을 찾을 때 가장 불편한 점이 있다면 알려주세요."
        />
      </div>

      {/* 개인정보 동의 */}
      <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
        <div className="flex items-start gap-2">
          <Checkbox id="consent" name="consent" value="true" required className="mt-0.5" />
          <Label htmlFor="consent" className="cursor-pointer text-sm leading-relaxed">
            개인정보(이름, 연락처)를 베타 운영 목적으로 수집·이용하는 것에 동의합니다.{" "}
            <Link href="/privacy" className="text-primary underline-offset-2 hover:underline" target="_blank">
              개인정보처리방침
            </Link>
          </Label>
        </div>
      </div>

      {state.error && (
        <p className="rounded-lg bg-destructive/10 px-4 py-2 text-sm text-destructive">{state.error}</p>
      )}

      <Button type="submit" disabled={pending} className="w-full" size="lg">
        {pending ? "제출 중..." : "신청 완료"}
      </Button>
    </form>
  );
}
