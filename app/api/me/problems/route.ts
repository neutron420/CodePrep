import type { NextRequest } from "next/server";

import { requireAuth } from "@/lib/auth";
import { listSolvedProblems } from "@/lib/services/user.service";
import { handleApiError } from "@/lib/utils/api";
import { listSolvedProblemsQuerySchema } from "@/lib/validations/api";

export async function GET(request: NextRequest) {
  try {
    const { clerkId, email } = await requireAuth();
    const query = listSolvedProblemsQuerySchema.parse(Object.fromEntries(request.nextUrl.searchParams));
    const result = await listSolvedProblems(clerkId, email, query);
    return Response.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
