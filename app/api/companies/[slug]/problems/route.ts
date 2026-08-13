import type { NextRequest } from "next/server";

import { listCompanyProblems } from "../../../../../lib/services/problem.service";
import { handleApiError } from "../../../../../lib/utils/api";
import { listCompanyProblemsQuerySchema } from "../../../../../lib/validations/api";

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const query = listCompanyProblemsQuerySchema.parse(Object.fromEntries(request.nextUrl.searchParams));
    const result = await listCompanyProblems(slug, query);
    return Response.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
