import type { NextRequest } from "next/server";

import { listCompanies } from "../../../lib/services/company.service";
import { handleApiError } from "../../../lib/utils/api";
import { listCompaniesQuerySchema } from "../../../lib/validations/api";

export async function GET(request: NextRequest) {
  try {
    const query = listCompaniesQuerySchema.parse(Object.fromEntries(request.nextUrl.searchParams));
    const result = await listCompanies(query);
    return Response.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
