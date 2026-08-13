import {
  countProblemsForCompany,
  findCompanyBySlug,
  findProblemsForCompany,
} from "../repositories/company.repository";
import {
  countProblems,
  findProblemBySlug,
  findProblems,
} from "../repositories/problem.repository";
import { ApiError, buildPagination } from "../utils/api";
import {
  problemSortFields,
  type ListCompanyProblemsQuery,
  type ListProblemsQuery,
} from "../validations/api";

export async function listProblems(query: ListProblemsQuery) {
  const { page, limit, search, difficulty, sort, order } = query;

  if (!problemSortFields.has(sort)) {
    throw new ApiError(400, `Invalid sort field: "${sort}". Allowed: ${[...problemSortFields].join(", ")}`);
  }

  const params = { search, difficulty, page, limit, sort, order };
  const [total, problems] = await Promise.all([countProblems({ search, difficulty }), findProblems(params)]);

  return { data: problems.map(flattenProblemTopics), pagination: buildPagination(total, page, limit) };
}

function flattenProblemTopics(problem: { topics: { topic: { name: string } }[] }) {
  return {
    ...problem,
    topics: problem.topics.map(({ topic }) => topic.name),
  };
}

export async function getProblemBySlug(slug: string) {
  const problem = await findProblemBySlug(slug);
  if (!problem) {
    throw new ApiError(404, "Problem not found");
  }

  return {
    data: {
      id: problem.id,
      title: problem.title,
      slug: problem.slug,
      difficulty: problem.difficulty,
      leetcodeUrl: problem.leetcodeUrl,
      topics: problem.topics.map(({ topic }) => topic.name),
      companies: problem.companies.map(({ company }) => company),
    },
  };
}

export async function listCompanyProblems(companySlug: string, query: ListCompanyProblemsQuery) {
  const { page, limit, search, difficulty, sort, order } = query;

  if (!problemSortFields.has(sort)) {
    throw new ApiError(400, `Invalid sort field: "${sort}". Allowed: ${[...problemSortFields].join(", ")}`);
  }

  const company = await findCompanyBySlug(companySlug);
  if (!company) {
    throw new ApiError(404, "Company not found");
  }

  const filter = { search, difficulty };
  const [total, problems] = await Promise.all([
    countProblemsForCompany(company.id, filter),
    findProblemsForCompany(company.id, { ...filter, page, limit, sort, order }),
  ]);

  const data = problems.map(({ problem }) => flattenProblemTopics(problem));

  return { data, pagination: buildPagination(total, page, limit) };
}
