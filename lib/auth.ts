import { auth } from "@clerk/nextjs/server";

import { ApiError } from "./utils/api";

export interface AuthenticatedUser {
  clerkId: string;
  email: string | null;
}

export async function requireAuth(): Promise<AuthenticatedUser> {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const emailClaim = sessionClaims?.email;
  const email = typeof emailClaim === "string" && emailClaim.length > 0 ? emailClaim : null;

  return { clerkId: userId, email };
}
