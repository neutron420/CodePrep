/*
  Warnings:

  - You are about to drop the `SolvedProblem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SolvedProblem" DROP CONSTRAINT "SolvedProblem_problemId_fkey";

-- DropForeignKey
ALTER TABLE "SolvedProblem" DROP CONSTRAINT "SolvedProblem_userId_fkey";

-- DropTable
DROP TABLE "SolvedProblem";

-- DropTable
DROP TABLE "User";
