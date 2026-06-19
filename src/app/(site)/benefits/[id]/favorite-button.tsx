"use client";

import { useState, useTransition } from "react";
import { BookmarkIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleFavoriteAction } from "@/app/actions/favorites";
import { toast } from "sonner";

type Props = {
  benefitId: string;
  initialSaved: boolean;
  visitorId: string | null;
};

export function FavoriteButton({ benefitId, initialSaved }: Props) {
  const [saved, setSaved] = useState(initialSaved);
  const [pending, startTransition] = useTransition();

  const toggle = () => {
    startTransition(async () => {
      const result = await toggleFavoriteAction(benefitId);
      setSaved(result.saved);
      toast(result.saved ? "혜택을 저장했어요" : "저장을 취소했어요");
    });
  };

  return (
    <Button variant={saved ? "default" : "outline"} onClick={toggle} disabled={pending} className="flex-1 sm:flex-none gap-1.5">
      {pending ? (
        <Loader2 className="size-4 animate-spin" aria-hidden />
      ) : (
        <BookmarkIcon className={saved ? "size-4 fill-current" : "size-4"} aria-hidden />
      )}
      {saved ? "저장됨" : "저장하기"}
    </Button>
  );
}
