// AuditLog 기록 헬퍼 — 모든 관리자 변경에 자동 기록

import { prisma } from "./prisma";

type AuditAction = "CREATE" | "UPDATE" | "STATUS_CHANGE" | "DELETE" | "LOGIN";
type EntityType = "Benefit" | "Organization" | "AdminUser" | "System";

export async function writeAuditLog(
  adminUserId: string | null,
  action: AuditAction,
  entityType: EntityType,
  entityId: string | null,
  detail?: Record<string, unknown>
) {
  try {
    await prisma.auditLog.create({
      data: {
        adminUserId,
        action,
        entityType,
        entityId,
        detail: detail ? JSON.stringify(detail) : null,
      },
    });
  } catch {
    // 로그 실패는 메인 플로우를 막지 않는다
  }
}
