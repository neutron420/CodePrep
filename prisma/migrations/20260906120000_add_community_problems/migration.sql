-- CreateEnum
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'CodingPlatform') THEN
        CREATE TYPE "CodingPlatform" AS ENUM ('LEETCODE', 'GEEKSFORGEEKS', 'CODECHEF', 'ATCODER', 'CODEFORCES', 'HACKERRANK', 'HACKEREARTH', 'CODESTUDIO', 'INTERVIEWBIT', 'CUSTOM');
    END IF;
END $$;

-- CreateTable
CREATE TABLE IF NOT EXISTS "CommunityProblem" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "userId" TEXT,
    "platform" "CodingPlatform" NOT NULL DEFAULT 'LEETCODE',
    "title" TEXT NOT NULL,
    "problemUrl" TEXT,
    "difficulty" "Difficulty" NOT NULL DEFAULT 'MEDIUM',
    "roundType" TEXT NOT NULL,
    "topics" TEXT[],
    "notes" TEXT,
    "upvotes" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommunityProblem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "CommunityProblem_companyId_idx" ON "CommunityProblem"("companyId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "CommunityProblem_createdAt_idx" ON "CommunityProblem"("createdAt");

-- AddForeignKey
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'CommunityProblem_companyId_fkey') THEN
        ALTER TABLE "CommunityProblem" ADD CONSTRAINT "CommunityProblem_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'CommunityProblem_userId_fkey') THEN
        ALTER TABLE "CommunityProblem" ADD CONSTRAINT "CommunityProblem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;
