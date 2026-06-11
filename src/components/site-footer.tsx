import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-2 px-4 py-6 text-xs text-muted-foreground">
        <p>베네픽 — 모든 혜택은 공식 출처 링크와 갱신일을 함께 표시합니다.</p>
        <p>
          혜택 내용은 제공사 사정에 따라 변경될 수 있으니 원문에서 최종 확인해 주세요.
        </p>
        <div className="flex items-center gap-3 pt-1">
          <Link href="/privacy" className="underline-offset-2 hover:underline">
            개인정보처리방침
          </Link>
          <Link href="/waitlist" className="underline-offset-2 hover:underline">
            베타 신청
          </Link>
          <Link href="/admin" className="underline-offset-2 hover:underline">
            관리자
          </Link>
        </div>
        <p className="pt-1">© 2026 Benepick</p>
      </div>
    </footer>
  );
}
