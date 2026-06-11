# 베네픽 (Benepick)

나이·학생 여부·통신사·카드사·관심 분야를 입력하면 **내 조건에 맞는 할인 혜택만 한 화면에** 모아 보여주는 혜택 통합 추천 웹서비스 MVP.

> 기획 문서: `docs/PRD.md` (혜택 통합 추천 서비스 총정리)

## 실행 방법

```bash
npm install            # 의존성 설치 (postinstall에서 prisma generate 자동 실행)
cp .env.example .env   # 환경변수 준비 (SESSION_SECRET 등 수정)
npm run db:migrate     # SQLite 마이그레이션
npm run db:seed        # 예시 혜택 데이터 + 관리자 계정 시드
npm run dev            # http://localhost:3000
```

## 관리자

- 주소: `/admin/login`
- 계정: `.env`의 `ADMIN_EMAIL` / `ADMIN_PASSWORD` (기본값 `admin@benepick.local` / `benepick2026!`)

## 테스트

```bash
npm test               # Vitest 단위 테스트 (혜택 매칭 로직 등)
```

## 기술 스택

Next.js (App Router) · TypeScript · Tailwind CSS · shadcn/ui · Prisma 7 + SQLite · Zod · jose

## 주의: 시드 데이터

`prisma/seed.ts`의 혜택 데이터는 실제 멤버십/카드 혜택을 **모사한 예시**입니다. 실제 조건·할인율과 다를 수 있으며, 각 혜택의 "원문 확인" 링크에서 공식 정보를 확인해야 합니다.
