import { requireAuth } from "@/lib/auth";
import { markProblemDone, unmarkProblemDone } from "@/lib/services/user.service";
import { handleApiError, okJson } from "@/lib/utils/api";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function PUT(_request: Request, context: RouteContext) {
  try {
    const { clerkId, email } = await requireAuth();
    const { slug } = await context.params;
    const result = await markProblemDone(clerkId, email, slug);
    return okJson(result.data);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { clerkId, email } = await requireAuth();
    const { slug } = await context.params;
    const result = await unmarkProblemDone(clerkId, email, slug);
    return okJson(result.data);
  } catch (error) {
    return handleApiError(error);
  }
}
