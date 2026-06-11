"use client";

import { useActionState } from "react";
import { saveOnboardingAction } from "@/app/actions/onboarding";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AGE_GROUPS,
  TELECOMS,
  CARD_ISSUERS,
  CATEGORIES,
  REGIONS,
} from "@/lib/constants";

const INITIAL_STATE = { error: undefined as string | undefined };

export function OnboardingForm() {
  const [state, action, pending] = useActionState(saveOnboardingAction, INITIAL_STATE);

  return (
    <form action={action} className="space-y-8">
      {/* 연령대 */}
      <fieldset>
        <legend className="mb-3 font-semibold">나이대 *</legend>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {AGE_GROUPS.map((g) => (
            <label
              key={g.code}
              className="flex cursor-pointer items-center justify-center rounded-lg border p-3 text-sm font-medium transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/10 has-[:checked]:text-primary"
            >
              <input type="radio" name="ageGroup" value={g.code} className="sr-only" required />
              {g.label}
            </label>
          ))}
        </div>
      </fieldset>

      {/* 학생 여부 */}
      <fieldset>
        <legend className="mb-3 font-semibold">학생 여부 *</legend>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: "true", label: "재학생이에요" },
            { value: "false", label: "해당 없어요" },
          ].map((opt) => (
            <label
              key={opt.value}
              className="flex cursor-pointer items-center justify-center rounded-lg border p-3 text-sm font-medium transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/10 has-[:checked]:text-primary"
            >
              <input type="radio" name="isStudent" value={opt.value} className="sr-only" required />
              {opt.label}
            </label>
          ))}
        </div>
      </fieldset>

      {/* 통신사 */}
      <fieldset>
        <legend className="mb-3 font-semibold">통신사 *</legend>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {TELECOMS.map((t) => (
            <label
              key={t.code}
              className="flex cursor-pointer items-center justify-center rounded-lg border p-3 text-sm font-medium transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/10 has-[:checked]:text-primary"
            >
              <input type="radio" name="telecom" value={t.code} className="sr-only" required />
              {t.label}
            </label>
          ))}
        </div>
      </fieldset>

      {/* 보유 카드사 */}
      <fieldset>
        <legend className="mb-1 font-semibold">보유 카드사 (복수 선택)</legend>
        <p className="mb-3 text-xs text-muted-foreground">없으면 선택하지 않아도 돼요.</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {CARD_ISSUERS.map((c) => (
            <div key={c.code} className="flex items-center gap-2 rounded-lg border p-3">
              <Checkbox id={`card-${c.code}`} name="cardIssuerIds" value={c.code} />
              <Label htmlFor={`card-${c.code}`} className="cursor-pointer text-sm">
                {c.label}
              </Label>
            </div>
          ))}
        </div>
      </fieldset>

      {/* 관심 카테고리 */}
      <fieldset>
        <legend className="mb-1 font-semibold">관심 분야 * (복수 선택)</legend>
        <p className="mb-3 text-xs text-muted-foreground">관심 분야가 일치하는 혜택이 상단에 표시돼요.</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {CATEGORIES.map((cat) => (
            <div key={cat.code} className="flex items-center gap-2 rounded-lg border p-3">
              <Checkbox id={`cat-${cat.code}`} name="categories" value={cat.code} />
              <Label htmlFor={`cat-${cat.code}`} className="cursor-pointer text-sm">
                {cat.label}
              </Label>
            </div>
          ))}
        </div>
      </fieldset>

      {/* 지역 (선택) */}
      <fieldset>
        <legend className="mb-1 font-semibold">지역 (선택)</legend>
        <p className="mb-3 text-xs text-muted-foreground">지역 맞춤 혜택을 우선 노출해요.</p>
        <div className="flex flex-wrap gap-2">
          <label className="flex cursor-pointer items-center rounded-full border px-3 py-1.5 text-sm transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/10 has-[:checked]:text-primary">
            <input type="radio" name="region" value="" className="sr-only" defaultChecked />
            지역 무관
          </label>
          {REGIONS.map((r) => (
            <label
              key={r}
              className="flex cursor-pointer items-center rounded-full border px-3 py-1.5 text-sm transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/10 has-[:checked]:text-primary"
            >
              <input type="radio" name="region" value={r} className="sr-only" />
              {r}
            </label>
          ))}
        </div>
      </fieldset>

      {state?.error && (
        <p className="rounded-lg bg-destructive/10 px-4 py-2 text-sm text-destructive">{state.error}</p>
      )}

      <Button type="submit" disabled={pending} className="w-full" size="lg">
        {pending ? "저장 중..." : "맞춤 혜택 보기 →"}
      </Button>
    </form>
  );
}
