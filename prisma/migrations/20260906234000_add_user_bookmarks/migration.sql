-- CreateTable
CREATE TABLE IF NOT EXISTS "UserBookmarkProblem" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "problemId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserBookmarkProblem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "UserBookmarkProblem_userId_idx" ON "UserBookmarkProblem"("userId");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "UserBookmarkProblem_userId_problemId_key" ON "UserBookmarkProblem"("userId", "problemId");

-- AddForeignKey
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'UserBookmarkProblem_userId_fkey') THEN
        ALTER TABLE "UserBookmarkProblem" ADD CONSTRAINT "UserBookmarkProblem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;
