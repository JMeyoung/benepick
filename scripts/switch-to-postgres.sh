#!/bin/bash
# Neon PostgreSQL로 전환하는 스크립트
# 사용법: DATABASE_URL="postgresql://..." bash scripts/switch-to-postgres.sh

set -e

if [[ -z "$DATABASE_URL" ]]; then
  echo "❌ DATABASE_URL 환경변수를 먼저 설정해주세요."
  echo "   예: export DATABASE_URL=\"postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require\""
  exit 1
fi

echo "1. Prisma 어댑터 교체..."
npm remove @prisma/adapter-better-sqlite3 better-sqlite3 2>/dev/null || true
npm install @prisma/adapter-neon @neondatabase/serverless

echo "2. schema.prisma provider → postgresql..."
sed -i '' 's/provider = "sqlite"/provider = "postgresql"/' prisma/schema.prisma

echo "3. src/lib/prisma.ts → Neon 어댑터로 교체..."
cat > src/lib/prisma.ts << 'EOF'
import { neon } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@/generated/prisma/client";

function createClient() {
  const sql = neon(process.env.DATABASE_URL!);
  const adapter = new PrismaNeon(sql);
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
EOF

echo "4. Prisma 클라이언트 재생성..."
npx prisma generate

echo "5. 마이그레이션 적용..."
npx prisma migrate deploy

echo "6. 시드 데이터 삽입..."
npx tsx prisma/seed.ts

echo "✅ PostgreSQL 전환 완료!"
echo "   이제 'npm run build' 후 Vercel에 배포하세요."
