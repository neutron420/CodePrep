import { prisma } from "../prisma";

export interface SolvedProblemListParams {
  page: number;
  limit: number;
  search?: string;
}

export function findOrCreateUser(clerkId: string, email: string | null) {
  return prisma.user.upsert({
    where: { clerkId },
    update: email ? { email } : {},
    create: { clerkId, email },
  });
}

export function findUserByClerkId(clerkId: string) {
  return prisma.user.findUnique({ where: { clerkId } });
}

export function findSolvedProblems(userId: number, params: SolvedProblemListParams) {
  const { page, limit, search } = params;

  return prisma.solvedProblem.findMany({
    where: {
      userId,
      ...(search
        ? {
            problem: {
              title: { contains: search, mode: "insensitive" as const },
            },
          }
        : {}),
    },
    orderBy: { solvedAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
    select: {
      solvedAt: true,
      problem: {
        select: {
          id: true,
          title: true,
          slug: true,
          difficulty: true,
          leetcodeUrl: true,
          topics: {
            select: {
              topic: { select: { name: true } },
            },
          },
        },
      },
    },
  });
}

export function countSolvedProblems(userId: number, search?: string) {
  return prisma.solvedProblem.count({
    where: {
      userId,
      ...(search
        ? {
            problem: {
              title: { contains: search, mode: "insensitive" as const },
            },
          }
        : {}),
    },
  });
}

export function findProblemById(id: number) {
  return prisma.problem.findUnique({ where: { id } });
}

export function findProblemBySlug(slug: string) {
  return prisma.problem.findUnique({ where: { slug } });
}

export function markProblemSolved(userId: number, problemId: number) {
  return prisma.solvedProblem.upsert({
    where: { userId_problemId: { userId, problemId } },
    update: {},
    create: { userId, problemId },
  });
}

export function unmarkProblemSolved(userId: number, problemId: number) {
  return prisma.solvedProblem.deleteMany({ where: { userId, problemId } });
}
