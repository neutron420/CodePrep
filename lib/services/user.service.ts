import {
  countSolvedProblems,
  findOrCreateUser,
  findProblemBySlug,
  findSolvedProblems,
  markProblemSolved,
  unmarkProblemSolved,
} from "../repositories/user.repository";
import { ApiError, buildPagination } from "../utils/api";
import type { ListSolvedProblemsQuery } from "../validations/api";

export async function getOrCreateUser(clerkId: string, email: string | null) {
  return findOrCreateUser(clerkId, email);
}

export async function listSolvedProblems(clerkId: string, email: string | null, query: ListSolvedProblemsQuery) {
  const { page, limit, search } = query;
  const user = await getOrCreateUser(clerkId, email);

  const [total, solved] = await Promise.all([
    countSolvedProblems(user.id, search),
    findSolvedProblems(user.id, { page, limit, search }),
  ]);

  const data = solved.map(({ solvedAt, problem }) => ({
    ...problem,
    topics: problem.topics.map(({ topic }) => topic.name),
    solvedAt,
  }));

  return { data, pagination: buildPagination(total, page, limit) };
}

export async function markProblemDone(clerkId: string, email: string | null, slug: string) {
  const user = await getOrCreateUser(clerkId, email);
  const problem = await findProblemBySlug(slug);
  if (!problem) {
    throw new ApiError(404, "Problem not found");
  }

  const solved = await markProblemSolved(user.id, problem.id);

  return {
    data: {
      slug: problem.slug,
      solvedAt: solved.solvedAt,
    },
  };
}

export async function unmarkProblemDone(clerkId: string, email: string | null, slug: string) {
  const user = await getOrCreateUser(clerkId, email);
  const problem = await findProblemBySlug(slug);
  if (!problem) {
    throw new ApiError(404, "Problem not found");
  }

  await unmarkProblemSolved(user.id, problem.id);

  return { data: { slug: problem.slug, solved: false } };
}
