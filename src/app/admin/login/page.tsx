import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "관리자 로그인 | 베네픽" };

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-extrabold">베네픽 관리자</h1>
          <p className="mt-1 text-sm text-muted-foreground">운영자 전용 페이지입니다.</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
