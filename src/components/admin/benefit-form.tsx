"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { CATEGORIES, BENEFIT_STATUSES, RULE_TYPES, CARD_ISSUERS, TELECOMS } from "@/lib/constants";

type Organization = { id: string; name: string; type: string };

type Rule = {
  ruleType: string;
  minAge?: number | null;
  maxAge?: number | null;
  stringValue?: string | null;
};

type InitialData = {
  title?: string;
  summary?: string;
  description?: string;
  category?: string;
  status?: string;
  sourceUrl?: string;
  sourceUpdatedAt?: string;
  endsAt?: string | null;
  isFeatured?: boolean;
  region?: string | null;
  providerIds?: string[];
  rules?: Rule[];
};

type Props = {
  action: (prev: unknown, formData: FormData) => Promise<{ error: string | null } | undefined>;
  organizations: Organization[];
  initialData?: InitialData;
  submitLabel?: string;
};

export function BenefitForm({ action, organizations, initialData, submitLabel = "저장" }: Props) {
  const [state, formAction, pending] = useActionState(action, { error: null });
  const [rules, setRules] = useState<Rule[]>(initialData?.rules ?? []);

  const addRule = (ruleType: string) => {
    setRules((prev) => [...prev, { ruleType }]);
  };

  const removeRule = (idx: number) => {
    setRules((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateRule = (idx: number, patch: Partial<Rule>) => {
    setRules((prev) => prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
  };

  return (
    <form action={formAction} className="space-y-8">
      {/* hidden rulesJson */}
      <input type="hidden" name="rulesJson" value={JSON.stringify(rules)} />

      {/* 기본 정보 */}
      <section className="space-y-4">
        <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">기본 정보</h2>
        <div className="space-y-2">
          <Label htmlFor="title">제목 *</Label>
          <Input id="title" name="title" required defaultValue={initialData?.title} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="summary">요약 (한 줄) *</Label>
          <Input id="summary" name="summary" required defaultValue={initialData?.summary} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">상세 설명 *</Label>
          <Textarea id="description" name="description" rows={5} required defaultValue={initialData?.description} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">카테고리 *</Label>
            <select
              id="category"
              name="category"
              required
              className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
              defaultValue={initialData?.category ?? ""}
            >
              <option value="" disabled>선택</option>
              {CATEGORIES.map((c) => (
                <option key={c.code} value={c.code}>{c.label}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">상태 *</Label>
            <select
              id="status"
              name="status"
              className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
              defaultValue={initialData?.status ?? "DRAFT"}
            >
              {BENEFIT_STATUSES.map((s) => (
                <option key={s.code} value={s.code}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="isFeatured"
            name="isFeatured"
            value="true"
            defaultChecked={initialData?.isFeatured}
          />
          <Label htmlFor="isFeatured">운영자 추천 (정렬 가산점)</Label>
        </div>
        <div className="space-y-2">
          <Label htmlFor="region">지역 (선택)</Label>
          <Input id="region" name="region" placeholder="예: 서울" defaultValue={initialData?.region ?? ""} />
        </div>
      </section>

      <Separator />

      {/* 출처 정보 */}
      <section className="space-y-4">
        <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">출처 정보 (신뢰 확보 필수)</h2>
        <div className="space-y-2">
          <Label htmlFor="sourceUrl">공식 출처 URL *</Label>
          <Input id="sourceUrl" name="sourceUrl" type="url" required defaultValue={initialData?.sourceUrl} placeholder="https://" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="sourceUpdatedAt">갱신일 (출처 확인일) *</Label>
            <Input
              id="sourceUpdatedAt"
              name="sourceUpdatedAt"
              type="date"
              required
              defaultValue={initialData?.sourceUpdatedAt}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endsAt">종료 예정일 (선택)</Label>
            <Input
              id="endsAt"
              name="endsAt"
              type="date"
              defaultValue={initialData?.endsAt ?? ""}
            />
          </div>
        </div>
      </section>

      <Separator />

      {/* 제공사 */}
      <section className="space-y-3">
        <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">제공사</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
          {organizations.map((org) => (
            <div key={org.id} className="flex items-center gap-2 rounded-lg border p-2.5">
              <Checkbox
                id={`org-${org.id}`}
                name="providerIds"
                value={org.id}
                defaultChecked={initialData?.providerIds?.includes(org.id)}
              />
              <Label htmlFor={`org-${org.id}`} className="cursor-pointer text-xs">
                {org.name}
              </Label>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* 적용 조건 규칙 */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">적용 조건 규칙</h2>
          <div className="flex gap-2 flex-wrap">
            {RULE_TYPES.map((rt) => (
              <Button
                key={rt.code}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addRule(rt.code)}
              >
                + {rt.label}
              </Button>
            ))}
          </div>
        </div>

        {rules.length === 0 && (
          <p className="text-sm text-muted-foreground">규칙 없음 — 모든 사용자에게 노출됩니다.</p>
        )}

        {rules.map((rule, idx) => (
          <div key={idx} className="rounded-lg border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {RULE_TYPES.find((r) => r.code === rule.ruleType)?.label ?? rule.ruleType}
              </span>
              <Button type="button" variant="ghost" size="sm" onClick={() => removeRule(idx)}>삭제</Button>
            </div>

            {rule.ruleType === "AGE_RANGE" && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>최소 나이 (만)</Label>
                  <Input
                    type="number"
                    value={rule.minAge ?? ""}
                    onChange={(e) => updateRule(idx, { minAge: Number(e.target.value) || null })}
                  />
                </div>
                <div className="space-y-1">
                  <Label>최대 나이 (만)</Label>
                  <Input
                    type="number"
                    value={rule.maxAge ?? ""}
                    onChange={(e) => updateRule(idx, { maxAge: Number(e.target.value) || null })}
                  />
                </div>
              </div>
            )}
            {rule.ruleType === "TELECOM" && (
              <select
                className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
                value={rule.stringValue ?? ""}
                onChange={(e) => updateRule(idx, { stringValue: e.target.value })}
              >
                <option value="" disabled>선택</option>
                {TELECOMS.filter((t) => !["MVNO", "NONE"].includes(t.code)).map((t) => (
                  <option key={t.code} value={t.code}>{t.label}</option>
                ))}
              </select>
            )}
            {rule.ruleType === "CARD_ISSUER" && (
              <select
                className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
                value={rule.stringValue ?? ""}
                onChange={(e) => updateRule(idx, { stringValue: e.target.value })}
              >
                <option value="" disabled>선택</option>
                {CARD_ISSUERS.map((c) => (
                  <option key={c.code} value={c.code}>{c.label}</option>
                ))}
              </select>
            )}
            {rule.ruleType === "REGION" && (
              <Input
                placeholder="예: 서울"
                value={rule.stringValue ?? ""}
                onChange={(e) => updateRule(idx, { stringValue: e.target.value })}
              />
            )}
            {rule.ruleType === "STUDENT_ONLY" && (
              <p className="text-xs text-muted-foreground">재학생에게만 노출됩니다.</p>
            )}
          </div>
        ))}
      </section>

      {state?.error && (
        <p className="rounded-lg bg-destructive/10 px-4 py-2 text-sm text-destructive">{state.error}</p>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={pending} className="flex-1">
          {pending ? "저장 중..." : submitLabel}
        </Button>
        <Button type="button" variant="outline" onClick={() => history.back()}>취소</Button>
      </div>
    </form>
  );
}
