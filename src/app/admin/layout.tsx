import Link from "next/link";
import { logoutAction } from "@/app/actions/admin-auth";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const NAV_ITEMS = [
  { href: "/admin/benefits", label: "혜택 관리" },
  { href: "/admin/import", label: "혜택 임포트" },
  { href: "/admin/organizations", label: "조직 관리" },
  { href: "/admin/leads", label: "리드 목록" },
  { href: "/admin/logs", label: "감사 로그" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto w-full max-w-6xl px-4">
          <div className="flex h-14 items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/admin/benefits" className="text-sm font-extrabold tracking-tight">
                베네픽 관리자
              </Link>
              {/* Desktop nav */}
              <nav className="hidden sm:flex items-center gap-1">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-md px-2.5 py-1.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
            <form action={logoutAction}>
              <Button variant="outline" size="sm" type="submit">로그아웃</Button>
            </form>
          </div>
          {/* Mobile nav — horizontal scroll */}
          <nav className="flex sm:hidden items-center gap-1 overflow-x-auto scrollbar-none pb-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="shrink-0 rounded-md px-2.5 py-1.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-8">
        {children}
      </main>
    </div>
  );
}
