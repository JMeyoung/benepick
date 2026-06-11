"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { changeBenefitStatusAction } from "@/app/actions/admin-benefits";
import { toast } from "sonner";

type Props = { benefitId: string; currentStatus: string };

const TRANSITIONS: Record<string, { label: string; next: string }[]> = {
  DRAFT: [{ label: "게시", next: "PUBLISHED" }],
  PUBLISHED: [{ label: "초안으로", next: "DRAFT" }, { label: "종료", next: "ARCHIVED" }],
  ARCHIVED: [{ label: "다시 게시", next: "PUBLISHED" }],
};

export function StatusChangeButtons({ benefitId, currentStatus }: Props) {
  const [pending, startTransition] = useTransition();
  const options = TRANSITIONS[currentStatus] ?? [];

  return (
    <>
      {options.map(({ label, next }) => (
        <Button
          key={next}
          variant="ghost"
          size="sm"
          disabled={pending}
          onClick={() => {
            startTransition(async () => {
              await changeBenefitStatusAction(benefitId, next);
              toast(`상태가 변경되었습니다.`);
            });
          }}
        >
          {label}
        </Button>
      ))}
    </>
  );
}
