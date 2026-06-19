"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { SunIcon, MoonIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/benefits", label: "내 혜택" },
  { href: "/saved", label: "저장" },
  { href: "/waitlist", label: "베타 신청" },
];

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="다크/라이트 모드 전환"
      className="size-9 text-muted-foreground hover:text-foreground"
    >
      <SunIcon className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <MoonIcon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
}

export function SiteHeader() {
  const pathname = usePathname();

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
        <div className="flex items-center gap-1">
          <nav className="flex items-center gap-0.5">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300",
                    "after:absolute after:bottom-0.5 after:left-1/2 after:h-[2px] after:rounded-full after:bg-gradient-to-r after:from-primary after:to-premium-cyan after:transition-all after:duration-300 after:-translate-x-1/2",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    isActive
                      ? "text-foreground after:w-3/5"
                      : "text-muted-foreground hover:text-foreground hover:bg-primary/5 after:w-0 hover:after:w-3/5"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
