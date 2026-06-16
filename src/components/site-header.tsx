import Link from "next/link";

const NAV_ITEMS = [
  { href: "/benefits", label: "내 혜택" },
  { href: "/saved", label: "저장" },
  { href: "/waitlist", label: "베타 신청" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/40 bg-background/70 backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between px-4">
        <Link href="/" className="group flex items-center gap-2 text-lg font-extrabold tracking-tight">
          <span
            className="inline-block size-2.5 rounded-full bg-gradient-to-br from-primary to-premium-cyan shadow-sm shadow-primary/30 transition-transform duration-300 group-hover:scale-125"
            aria-hidden
          />
          <span className="text-gradient">베네픽</span>
        </Link>
        <nav className="flex items-center gap-0.5">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all duration-300 hover:text-foreground hover:bg-primary/5 after:absolute after:bottom-0.5 after:left-1/2 after:h-[2px] after:w-0 after:rounded-full after:bg-gradient-to-r after:from-primary after:to-premium-cyan after:transition-all after:duration-300 after:-translate-x-1/2 hover:after:w-3/5"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
