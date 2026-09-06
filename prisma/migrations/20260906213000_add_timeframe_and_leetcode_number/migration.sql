-- AlterTable Problem
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Problem' AND column_name = 'leetcodeNumber') THEN
        ALTER TABLE "Problem" ADD COLUMN "leetcodeNumber" INTEGER;
    END IF;
END $$;

-- AlterTable CompanyProblem
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'CompanyProblem' AND column_name = 'timeframe') THEN
        ALTER TABLE "CompanyProblem" ADD COLUMN "timeframe" TEXT DEFAULT 'ALL';
    END IF;
END $$;

-- AlterTable CommunityProblem
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'CommunityProblem' AND column_name = 'interviewMonth') THEN
        ALTER TABLE "CommunityProblem" ADD COLUMN "interviewMonth" TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'CommunityProblem' AND column_name = 'interviewYear') THEN
        ALTER TABLE "CommunityProblem" ADD COLUMN "interviewYear" INTEGER;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'CommunityProblem' AND column_name = 'timeframe') THEN
        ALTER TABLE "CommunityProblem" ADD COLUMN "timeframe" TEXT DEFAULT 'ALL';
    END IF;
END $$;
