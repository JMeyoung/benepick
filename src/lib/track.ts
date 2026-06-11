// EventLog 기록 헬퍼 — 화면/서버 액션에서 공통으로 사용
// 실패해도 메인 플로우를 막지 않도록 fire-and-forget으로 처리한다.

import { prisma } from "./prisma";

type EventName =
  | "onboarding_complete"
  | "benefit_view"
  | "outbound_click"
  | "favorite_add"
  | "favorite_remove"
  | "lead_submit";

export async function trackEvent(
  eventName: EventName,
  visitorId: string | null | undefined,
  properties?: Record<string, unknown>
) {
  try {
    await prisma.eventLog.create({
      data: {
        visitorId: visitorId ?? null,
        eventName,
        propertiesJson: properties ? JSON.stringify(properties) : null,
      },
    });
  } catch {
    // 이벤트 로깅 실패는 무시
  }
}
