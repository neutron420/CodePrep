import type { Difficulty } from "../../app/generated/prisma/enums";

import { prisma } from "../prisma";
import { withDbRetry } from "../db-retry";

export interface ProblemListParams {
  search?: string;
  difficulty?: Difficulty;
  page: number;
  limit: number;
  sort: string;
  order: "asc" | "desc";
}

function buildProblemWhere(params: Pick<ProblemListParams, "search" | "difficulty">) {
  return {
    ...(params.search ? { title: { contains: params.search, mode: "insensitive" as const } } : {}),
    ...(params.difficulty ? { difficulty: params.difficulty } : {}),
  };
}

export function findProblems(params: ProblemListParams) {
  const { page, limit, sort, order } = params;

  const orderBy = sort === "difficulty" ? { difficulty: order } : { title: order };

  return withDbRetry(() =>
    prisma.problem.findMany({
      where: buildProblemWhere(params),
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
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
    })
  );
}

export function countProblems(params: Pick<ProblemListParams, "search" | "difficulty">) {
  return withDbRetry(() => prisma.problem.count({ where: buildProblemWhere(params) }));
}

export function findProblemBySlug(slug: string) {
  return withDbRetry(() =>
    prisma.problem.findUnique({
      where: { slug },
      select: {
        id: true,
        title: true,
        slug: true,
        difficulty: true,
        leetcodeUrl: true,
        topics: {
          select: {
            topic: { select: { id: true, name: true } },
          },
        },
        companies: {
          select: {
            company: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    })
  );
}
