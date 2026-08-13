import { auth } from "@clerk/nextjs/server";

import { okJson } from "@/lib/utils/api";

export async function GET() {
  const { userId } = await auth();

  return okJson({
    authenticated: Boolean(userId),
    userId: userId ?? null,
  });
}
