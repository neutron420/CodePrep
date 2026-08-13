import type { Difficulty } from "../../app/generated/prisma/enums";

import { prisma } from "../prisma";

export interface CompanyListParams {
  search?: string;
  page: number;
  limit: number;
  sort: string;
  order: "asc" | "desc";
}

export function findCompanies(params: CompanyListParams) {
  const { search, page, limit, sort, order } = params;

  const where = search ? { name: { contains: search, mode: "insensitive" as const } } : undefined;

  const orderBy =
    sort === "problemCount" ? { problems: { _count: order as "asc" | "desc" } } : { name: order as "asc" | "desc" };

  return prisma.company.findMany({
    where,
    orderBy,
    skip: (page - 1) * limit,
    take: limit,
    select: {
      id: true,
      name: true,
      slug: true,
      _count: { select: { problems: true } },
    },
  });
}

export function countCompanies(search?: string) {
  const where = search ? { name: { contains: search, mode: "insensitive" as const } } : undefined;
  return prisma.company.count({ where });
}

export function findCompanyBySlug(slug: string) {
  return prisma.company.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      _count: { select: { problems: true } },
    },
  });
}

export interface CompanyProblemListParams {
  search?: string;
  difficulty?: Difficulty;
  page: number;
  limit: number;
  sort: string;
  order: "asc" | "desc";
}

function buildCompanyProblemWhere(companyId: number, params: Pick<CompanyProblemListParams, "search" | "difficulty">) {
  return {
    companyId,
    ...(params.search || params.difficulty
      ? {
          problem: {
            ...(params.search ? { title: { contains: params.search, mode: "insensitive" as const } } : {}),
            ...(params.difficulty ? { difficulty: params.difficulty } : {}),
          },
        }
      : {}),
  };
}

export function findProblemsForCompany(companyId: number, params: CompanyProblemListParams) {
  const { page, limit, sort, order } = params;

  const orderBy = sort === "difficulty" ? { problem: { difficulty: order } } : { problem: { title: order } };

  return prisma.companyProblem.findMany({
    where: buildCompanyProblemWhere(companyId, params),
    orderBy,
    skip: (page - 1) * limit,
    take: limit,
    select: {
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

export function countProblemsForCompany(companyId: number, params: Pick<CompanyProblemListParams, "search" | "difficulty">) {
  return prisma.companyProblem.count({ where: buildCompanyProblemWhere(companyId, params) });
}
