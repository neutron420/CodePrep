import type { NextRequest } from "next/server";

import { listProblems } from "../../../lib/services/problem.service";
import { handleApiError } from "../../../lib/utils/api";
import { listProblemsQuerySchema } from "../../../lib/validations/api";

export async function GET(request: NextRequest) {
  try {
    const query = listProblemsQuerySchema.parse(Object.fromEntries(request.nextUrl.searchParams));
    const result = await listProblems(query);
    return Response.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
