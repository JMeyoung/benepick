"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createAdminSession, destroyAdminSession } from "@/lib/auth";
import { writeAuditLog } from "@/lib/audit";

export async function loginAction(_prev: unknown, formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "이메일과 비밀번호를 입력해 주세요." };
  }

  const admin = await prisma.adminUser.findUnique({ where: { email } });
  if (!admin) return { error: "이메일 또는 비밀번호가 올바르지 않습니다." };

  const ok = bcrypt.compareSync(password, admin.passwordHash);
  if (!ok) return { error: "이메일 또는 비밀번호가 올바르지 않습니다." };

  await createAdminSession(admin.id, admin.email);
  await writeAuditLog(admin.id, "LOGIN", "AdminUser", admin.id);

  redirect("/admin/benefits");
}

export async function logoutAction() {
  await destroyAdminSession();
  redirect("/admin/login");
}
