"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

type Props = { currentCategory?: string };

export function CategoryFilterChips({ currentCategory }: Props) {
  const pathname = usePathname();

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      <Link
        href={pathname}
        className={cn(
          "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
          !currentCategory
            ? "border-primary bg-primary text-primary-foreground"
            : "hover:bg-accent"
        )}
      >
        전체
      </Link>
      {CATEGORIES.map((cat) => (
        <Link
          key={cat.code}
          href={`${pathname}?category=${cat.code}`}
          className={cn(
            "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
            currentCategory === cat.code
              ? "border-primary bg-primary text-primary-foreground"
              : "hover:bg-accent"
          )}
        >
          {cat.label}
        </Link>
      ))}
    </div>
  );
}
