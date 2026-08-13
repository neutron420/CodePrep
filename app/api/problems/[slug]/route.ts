import type { NextRequest } from "next/server";

import { getProblemBySlug } from "../../../../lib/services/problem.service";
import { handleApiError, okJson } from "../../../../lib/utils/api";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const result = await getProblemBySlug(slug);
    return okJson(result.data);
  } catch (error) {
    return handleApiError(error);
  }
}
