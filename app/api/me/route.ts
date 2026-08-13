import { requireAuth } from "@/lib/auth";
import { getOrCreateUser } from "@/lib/services/user.service";
import { handleApiError, okJson } from "@/lib/utils/api";

export async function GET() {
  try {
    const { clerkId, email } = await requireAuth();
    const user = await getOrCreateUser(clerkId, email);

    return okJson({
      id: user.id,
      clerkId: user.clerkId,
      email: user.email,
      createdAt: user.createdAt,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
