import type { NextRequest } from "next/server";

import { getCompanyBySlug } from "../../../../lib/services/company.service";
import { handleApiError, okJson } from "../../../../lib/utils/api";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const result = await getCompanyBySlug(slug);
    return okJson(result.data);
  } catch (error) {
    return handleApiError(error);
  }
}
