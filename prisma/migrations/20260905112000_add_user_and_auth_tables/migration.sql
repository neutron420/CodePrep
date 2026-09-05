-- CreateTable
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "phoneNumber" TEXT,
    "displayName" TEXT,
    "photoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "UserTargetCompany" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "companyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserTargetCompany_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "UserSolvedProblem" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "problemId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserSolvedProblem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "User_phoneNumber_key" ON "User"("phoneNumber");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "UserTargetCompany_userId_idx" ON "UserTargetCompany"("userId");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "UserTargetCompany_userId_companyId_key" ON "UserTargetCompany"("userId", "companyId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "UserSolvedProblem_userId_idx" ON "UserSolvedProblem"("userId");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "UserSolvedProblem_userId_problemId_key" ON "UserSolvedProblem"("userId", "problemId");

-- AddForeignKey
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'UserTargetCompany_userId_fkey') THEN
        ALTER TABLE "UserTargetCompany" ADD CONSTRAINT "UserTargetCompany_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'UserTargetCompany_companyId_fkey') THEN
        ALTER TABLE "UserTargetCompany" ADD CONSTRAINT "UserTargetCompany_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'UserSolvedProblem_userId_fkey') THEN
        ALTER TABLE "UserSolvedProblem" ADD CONSTRAINT "UserSolvedProblem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'UserSolvedProblem_problemId_fkey') THEN
        ALTER TABLE "UserSolvedProblem" ADD CONSTRAINT "UserSolvedProblem_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;
