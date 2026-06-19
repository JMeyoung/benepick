"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

type Props = { currentCategory?: string };

export function CategoryFilterChips({ currentCategory }: Props) {
  const pathname = usePathname();

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
      <Link
        href={pathname}
        className={cn(
          "shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition-all duration-300",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          !currentCategory
            ? "border-primary/30 bg-gradient-to-r from-primary to-premium-cyan text-white shadow-md shadow-primary/20"
            : "border-border/50 bg-card/50 backdrop-blur-sm text-muted-foreground hover:bg-primary/5 hover:border-primary/20 hover:text-primary"
        )}
      >
        전체
      </Link>
      {CATEGORIES.map((cat) => (
        <Link
          key={cat.code}
          href={`${pathname}?category=${cat.code}`}
          className={cn(
            "shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition-all duration-300",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            currentCategory === cat.code
              ? "border-primary/30 bg-gradient-to-r from-primary to-premium-cyan text-white shadow-md shadow-primary/20"
              : "border-border/50 bg-card/50 backdrop-blur-sm text-muted-foreground hover:bg-primary/5 hover:border-primary/20 hover:text-primary"
          )}
        >
          {cat.label}
        </Link>
      ))}
    </div>
  );
}
