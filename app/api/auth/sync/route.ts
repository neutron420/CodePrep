import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { uid, email, phoneNumber, displayName, photoUrl } = body;

    if (!uid) {
      return NextResponse.json(
        { error: "Missing required uid" },
        { status: 400 }
      );
    }

    const user = await prisma.user.upsert({
      where: { id: uid },
      update: {
        email: email || undefined,
        phoneNumber: phoneNumber || undefined,
        displayName: displayName || undefined,
        photoUrl: photoUrl || undefined,
      },
      create: {
        id: uid,
        email: email || null,
        phoneNumber: phoneNumber || null,
        displayName: displayName || null,
        photoUrl: photoUrl || null,
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Error in /api/auth/sync:", error);
    return NextResponse.json(
      { error: "Failed to synchronize user profile" },
      { status: 500 }
    );
  }
}
