"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  href: string;
  visitorId: string | null;
  benefitId: string;
  className?: string;
};

export function OutboundLink({ href, visitorId, benefitId, className }: Props) {
  const handleClick = () => {
    // fire-and-forget via API Route (클라이언트에서 trackEvent 직접 호출 불가)
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventName: "outbound_click",
        visitorId,
        properties: { benefitId, url: href },
      }),
    }).catch(() => {});
  };

  return (
    <Button asChild className={cn("flex-1", className)}>
      <a href={href} target="_blank" rel="noopener noreferrer" onClick={handleClick}>
        원문 확인 →
      </a>
    </Button>
  );
}
