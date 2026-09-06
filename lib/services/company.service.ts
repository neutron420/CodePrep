import { countCompanies, findCompanies, findCompanyBySlug } from "../repositories/company.repository";
import { ApiError, buildPagination } from "../utils/api";
import { companySortFields, type ListCompaniesQuery } from "../validations/api";

export async function listCompanies(query: ListCompaniesQuery) {
  const { page, limit, search, sort, order } = query;

  if (!companySortFields.has(sort)) {
    throw new ApiError(400, `Invalid sort field: "${sort}". Allowed: ${[...companySortFields].join(", ")}`);
  }

  const [total, companies] = await Promise.all([countCompanies(search), findCompanies({ search, page, limit, sort, order })]);

  const data = companies.map((company) => ({
    id: company.id,
    name: company.name,
    slug: company.slug,
    problemCount: (company._count.problems ?? 0) + (company._count.communityProblems ?? 0),
  }));

  return { data, pagination: buildPagination(total, page, limit) };
}

export async function getCompanyBySlug(slug: string) {
  const company = await findCompanyBySlug(slug);
  if (!company) {
    throw new ApiError(404, "Company not found");
  }

  return {
    data: {
      id: company.id,
      name: company.name,
      slug: company.slug,
      problemCount: (company._count.problems ?? 0) + (company._count.communityProblems ?? 0),
    },
  };
}
