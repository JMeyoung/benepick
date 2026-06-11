import type { Metadata } from "next";

export const metadata: Metadata = { title: "개인정보처리방침 | 베네픽" };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 prose prose-sm">
      <h1 className="text-2xl font-extrabold mb-6">개인정보처리방침</h1>
      <p className="text-muted-foreground text-sm mb-8">최종 업데이트: 2026년 6월 11일</p>

      <section className="mb-8">
        <h2 className="font-bold text-lg mb-3">1. 수집하는 개인정보 항목</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          베네픽은 대기자 등록 및 인터뷰 신청 시 다음 정보를 수집합니다.
        </p>
        <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-muted-foreground">
          <li>이름 (선택)</li>
          <li>이메일 또는 연락처 (필수)</li>
          <li>서비스 피드백 메시지 (선택)</li>
          <li>개인정보 수집·이용 동의 여부</li>
        </ul>
        <p className="text-sm mt-3 text-muted-foreground">
          혜택 조회를 위해 입력하는 나이대·학생 여부·통신사·카드사·관심 분야·지역 정보는 쿠키 기반 익명 식별자와 연결되며, 개인을 직접 식별하지 않습니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="font-bold text-lg mb-3">2. 수집 목적</h2>
        <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
          <li>베타 서비스 오픈 안내</li>
          <li>사용자 인터뷰 일정 협의</li>
          <li>서비스 개선을 위한 피드백 수집</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="font-bold text-lg mb-3">3. 보유 및 이용 기간</h2>
        <p className="text-sm text-muted-foreground">
          수집한 개인정보는 수집 목적 달성 후 즉시 파기하거나, 정보 주체가 삭제 요청 시 지체 없이 파기합니다. 베타 서비스 출시 후 최대 1년 이내 보유합니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="font-bold text-lg mb-3">4. 제3자 제공</h2>
        <p className="text-sm text-muted-foreground">
          수집한 개인정보는 정보 주체의 동의 없이 제3자에게 제공하지 않습니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="font-bold text-lg mb-3">5. 정보 주체의 권리</h2>
        <p className="text-sm text-muted-foreground">
          언제든지 개인정보 열람, 수정, 삭제를 요청할 수 있습니다. 아래 이메일로 요청해 주세요.
        </p>
        <p className="mt-2 text-sm font-medium">contact: admin@benepick.local</p>
      </section>

      <section>
        <h2 className="font-bold text-lg mb-3">6. 쿠키 사용</h2>
        <p className="text-sm text-muted-foreground">
          베네픽은 혜택 조건 저장 및 저장 기능을 위해 익명 쿠키를 사용합니다. 브라우저 설정에서 쿠키를 비활성화할 수 있으나, 일부 기능이 제한될 수 있습니다.
        </p>
      </section>
    </div>
  );
}
