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

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · shadcn/ui · Prisma 7 + SQLite · Zod v4 · jose v6 · bcryptjs · Vitest

## 프로젝트 구조

```
src/
├── app/
│   ├── (site)/          # 사용자 화면 (/, /onboarding, /benefits, /saved, /waitlist, /privacy)
│   ├── admin/           # 관리자 화면 (/admin/login, /benefits, /organizations, /leads, /logs)
│   ├── actions/         # 서버 액션 (onboarding, favorites, admin-auth, admin-benefits, leads)
│   └── api/track/       # 클라이언트 이벤트 로깅 엔드포인트
├── components/
│   ├── admin/           # 혜택 폼, 조직 폼 등 관리자 컴포넌트
│   └── ui/              # shadcn/ui 컴포넌트
└── lib/
    ├── matching.ts      # 핵심 매칭·점수 로직 (순수 함수)
    ├── prisma.ts        # Prisma 클라이언트 (싱글턴)
    ├── auth.ts          # 관리자 세션 (jose JWT)
    ├── constants.ts     # 카테고리·통신사·카드사 상수
    ├── track.ts         # 이벤트 로깅 헬퍼
    ├── audit.ts         # 감사 로그 헬퍼
    └── visitor.ts       # 익명 방문자 ID 쿠키
prisma/
├── schema.prisma        # DB 스키마 (10개 모델)
├── migrations/          # SQLite 마이그레이션
└── seed.ts              # 예시 혜택 29건 + 관리자 1명
```

## 배포 가이드 (Vercel + Neon PostgreSQL)

### 1. Neon 데이터베이스 준비

1. [neon.tech](https://neon.tech)에서 프로젝트 생성
2. Connection string 복사 (예: `postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require`)

### 2. Prisma 스키마를 PostgreSQL로 전환

```diff
# prisma/schema.prisma
- provider = "sqlite"
+ provider = "postgresql"

# prisma.config.ts — datasource.url을 Neon URL로 교체
```

`better-sqlite3` 어댑터 대신 Neon serverless 어댑터로 전환:

```bash
npm remove @prisma/adapter-better-sqlite3 better-sqlite3
npm install @prisma/adapter-neon @neondatabase/serverless
```

```typescript
// src/lib/prisma.ts
import { neon } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@/generated/prisma/client";

function createClient() {
  const sql = neon(process.env.DATABASE_URL!);
  const adapter = new PrismaNeon(sql);
  return new PrismaClient({ adapter });
}
```

### 3. 마이그레이션 및 시드

```bash
DATABASE_URL="postgresql://..." npx prisma migrate deploy
DATABASE_URL="postgresql://..." npx tsx prisma/seed.ts
```

### 4. Vercel 배포

1. GitHub 저장소 연결 후 Vercel에서 Import
2. 환경변수 설정:

| 변수 | 설명 |
|------|------|
| `DATABASE_URL` | Neon PostgreSQL 연결 문자열 |
| `SESSION_SECRET` | 64자 이상 무작위 문자열 (예: `openssl rand -hex 32`) |
| `ADMIN_EMAIL` | 관리자 이메일 |
| `ADMIN_PASSWORD` | 관리자 초기 비밀번호 |

3. Deploy → 완료 후 `/admin/login`에서 시드한 계정으로 로그인

### 5. 운영 시 체크리스트

- [ ] `SESSION_SECRET`은 최소 32바이트 무작위 값 사용
- [ ] Neon IP 허용 목록에 Vercel 서버리스 IP 대역 추가 (또는 Pooler 연결 사용)
- [ ] 혜택 데이터 갱신 시 `sourceUpdatedAt` 필드 업데이트
- [ ] `prisma/dev.db`는 `.gitignore`에 포함되어 있음 — 절대 커밋하지 말 것

---

## 주의: 시드 데이터

`prisma/seed.ts`의 혜택 데이터는 실제 멤버십/카드 혜택을 **모사한 예시**입니다. 실제 조건·할인율과 다를 수 있으며, 각 혜택의 "원문 확인" 링크에서 공식 정보를 확인해야 합니다.
