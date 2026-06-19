"use client";

import { useActionState } from "react";
import { saveOnboardingAction } from "@/app/actions/onboarding";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import {
  AGE_GROUPS,
  TELECOMS,
  CARD_ISSUERS,
  CATEGORIES,
  REGIONS,
} from "@/lib/constants";

const INITIAL_STATE = { error: undefined as string | undefined };

const RADIO_LABEL_BASE =
  "flex cursor-pointer items-center justify-center rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-3.5 text-sm font-medium transition-all duration-300 has-[:checked]:border-primary/40 has-[:checked]:bg-gradient-to-br has-[:checked]:from-primary/10 has-[:checked]:to-premium-cyan/10 has-[:checked]:text-primary has-[:checked]:shadow-sm has-[:checked]:shadow-primary/10 hover:border-primary/20 hover:bg-primary/[0.03] has-[:focus-visible]:outline-none has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2";

export function OnboardingForm() {
  const [state, action, pending] = useActionState(saveOnboardingAction, INITIAL_STATE);

  return (
    <form action={action} className="space-y-10">
      {/* 섹션 개요 */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {["연령대", "학생 여부", "통신사", "카드사", "관심 분야", "지역"].map((step, i) => (
          <span key={step} className="flex items-center gap-2">
            {i > 0 && <span className="text-border" aria-hidden>·</span>}
            {step}
          </span>
        ))}
      </div>

      {/* 연령대 */}
      <fieldset>
        <legend className="mb-4 font-bold text-sm uppercase tracking-wider text-muted-foreground">나이대 *</legend>
        <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-5">
          {AGE_GROUPS.map((g) => (
            <label key={g.code} className={RADIO_LABEL_BASE}>
              <input type="radio" name="ageGroup" value={g.code} className="sr-only" required />
              {g.label}
            </label>
          ))}
        </div>
      </fieldset>

      {/* 학생 여부 */}
      <fieldset>
        <legend className="mb-4 font-bold text-sm uppercase tracking-wider text-muted-foreground">학생 여부 *</legend>
        <div className="grid grid-cols-2 gap-2.5">
          {[
            { value: "true", label: "재학생이에요" },
            { value: "false", label: "해당 없어요" },
          ].map((opt) => (
            <label key={opt.value} className={RADIO_LABEL_BASE}>
              <input type="radio" name="isStudent" value={opt.value} className="sr-only" required />
              {opt.label}
            </label>
          ))}
        </div>
      </fieldset>

      {/* 통신사 */}
      <fieldset>
        <legend className="mb-4 font-bold text-sm uppercase tracking-wider text-muted-foreground">통신사 *</legend>
        <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-5">
          {TELECOMS.map((t) => (
            <label key={t.code} className={RADIO_LABEL_BASE}>
              <input type="radio" name="telecom" value={t.code} className="sr-only" required />
              {t.label}
            </label>
          ))}
        </div>
      </fieldset>

      {/* 보유 카드사 */}
      <fieldset>
        <legend className="mb-2 font-bold text-sm uppercase tracking-wider text-muted-foreground">보유 카드사 (복수 선택)</legend>
        <p className="mb-4 text-xs text-muted-foreground">없으면 선택하지 않아도 돼요.</p>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {CARD_ISSUERS.map((c) => (
            <div key={c.code} className="flex items-center gap-2.5 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-3.5 transition-all duration-300 hover:border-primary/20 hover:bg-primary/[0.03] has-[:checked]:border-primary/40 has-[:checked]:bg-gradient-to-br has-[:checked]:from-primary/10 has-[:checked]:to-premium-cyan/10">
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
        <legend className="mb-2 font-bold text-sm uppercase tracking-wider text-muted-foreground">관심 분야 * (복수 선택)</legend>
        <p className="mb-4 text-xs text-muted-foreground">관심 분야가 일치하는 혜택이 상단에 표시돼요.</p>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {CATEGORIES.map((cat) => (
            <div key={cat.code} className="flex items-center gap-2.5 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-3.5 transition-all duration-300 hover:border-primary/20 hover:bg-primary/[0.03] has-[:checked]:border-primary/40 has-[:checked]:bg-gradient-to-br has-[:checked]:from-primary/10 has-[:checked]:to-premium-cyan/10">
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
        <legend className="mb-2 font-bold text-sm uppercase tracking-wider text-muted-foreground">지역 (선택)</legend>
        <p className="mb-4 text-xs text-muted-foreground">지역 맞춤 혜택을 우선 노출해요.</p>
        <div className="flex flex-wrap gap-2">
          <label className="flex cursor-pointer items-center rounded-full border border-border/50 bg-card/50 backdrop-blur-sm px-4 py-2 text-sm font-medium transition-all duration-300 has-[:checked]:border-primary/40 has-[:checked]:bg-gradient-to-r has-[:checked]:from-primary has-[:checked]:to-premium-cyan has-[:checked]:text-white has-[:checked]:shadow-sm has-[:checked]:shadow-primary/20 hover:border-primary/20 has-[:focus-visible]:outline-none has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2">
            <input type="radio" name="region" value="" className="sr-only" defaultChecked />
            지역 무관
          </label>
          {REGIONS.map((r) => (
            <label
              key={r}
              className="flex cursor-pointer items-center rounded-full border border-border/50 bg-card/50 backdrop-blur-sm px-4 py-2 text-sm font-medium transition-all duration-300 has-[:checked]:border-primary/40 has-[:checked]:bg-gradient-to-r has-[:checked]:from-primary has-[:checked]:to-premium-cyan has-[:checked]:text-white has-[:checked]:shadow-sm has-[:checked]:shadow-primary/20 hover:border-primary/20 has-[:focus-visible]:outline-none has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2"
            >
              <input type="radio" name="region" value={r} className="sr-only" />
              {r}
            </label>
          ))}
        </div>
      </fieldset>

      {state?.error && (
        <p className="rounded-xl bg-destructive/10 border border-destructive/20 px-5 py-3 text-sm text-destructive font-medium">{state.error}</p>
      )}

      <Button type="submit" disabled={pending} className="shimmer-btn w-full h-13 text-base font-bold text-white rounded-xl shadow-lg shadow-primary/20" size="lg">
        {pending ? (
          <span className="flex items-center gap-2">
            <Loader2 className="size-4 animate-spin" />
            저장 중...
          </span>
        ) : (
          "맞춤 혜택 보기 →"
        )}
      </Button>
    </form>
  );
}
