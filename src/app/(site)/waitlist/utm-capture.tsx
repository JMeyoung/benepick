"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function UtmCaptureInner() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const utm: Record<string, string> = {};
    for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content"]) {
      const val = searchParams.get(key);
      if (val) utm[key] = val;
    }
    if (Object.keys(utm).length === 0) return;
    // 쿠키에 저장 (서버 액션에서 읽음)
    document.cookie = `benepick_utm=${encodeURIComponent(JSON.stringify(utm))};path=/;max-age=${60 * 60 * 24 * 30}`;
  }, [searchParams]);

  return null;
}

export function UtmCapture() {
  return (
    <Suspense>
      <UtmCaptureInner />
    </Suspense>
  );
}
