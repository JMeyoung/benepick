import Link from "next/link";

const NAV_ITEMS = [
  { href: "/benefits", label: "내 혜택" },
  { href: "/saved", label: "저장" },
  { href: "/waitlist", label: "베타 신청" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-3xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-1.5 text-lg font-extrabold tracking-tight">
          <span className="inline-block size-2.5 rounded-full bg-primary" aria-hidden />
          베네픽
        </Link>
        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-2.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
