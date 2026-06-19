import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { PostHogProvider } from "@/components/posthog-provider";
import { PostHogPageview } from "@/components/posthog-pageview";
import { ThemeProvider } from "next-themes";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: {
    default: "베네픽 — 내 조건에 맞는 혜택만 한 번에",
    template: "%s | 베네픽",
  },
  description:
    "나이, 학생 여부, 통신사, 카드사, 관심 분야를 입력하면 지금 받을 수 있는 할인 혜택만 모아 보여드려요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <PostHogProvider>
            <Suspense>
              <PostHogPageview />
            </Suspense>
            {children}
            <Toaster position="top-center" richColors />
          </PostHogProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
