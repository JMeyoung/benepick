import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="relative border-t border-border/30">
      {/* Gradient top border accent */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-10 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="inline-block size-2 rounded-full bg-gradient-to-br from-primary to-premium-cyan" aria-hidden />
          <span className="font-bold text-foreground text-gradient">베네픽</span>
        </div>
        <p className="leading-relaxed">
          모든 혜택은 공식 출처 링크와 갱신일을 함께 표시합니다.<br />
          혜택 내용은 제공사 사정에 따라 변경될 수 있으니 원문에서 최종 확인해 주세요.
        </p>
        <div className="flex items-center gap-4 pt-1">
          <Link href="/privacy" className="text-muted-foreground/80 transition-colors duration-300 hover:text-primary underline-offset-4 hover:underline">
            개인정보처리방침
          </Link>
          <Link href="/waitlist" className="text-muted-foreground/80 transition-colors duration-300 hover:text-primary underline-offset-4 hover:underline">
            베타 신청
          </Link>
          <Link href="/admin" className="text-muted-foreground/80 transition-colors duration-300 hover:text-primary underline-offset-4 hover:underline">
            관리자
          </Link>
        </div>
        <div className="flex items-center justify-between border-t border-border/20 pt-4">
          <p className="text-xs text-muted-foreground/60">© 2026 Benepick</p>
          <p className="text-xs text-muted-foreground/40">Made with care ✦</p>
        </div>
      </div>
    </footer>
  );
}
