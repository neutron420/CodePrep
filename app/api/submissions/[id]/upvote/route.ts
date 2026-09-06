import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// In-memory cache of recent votes (IP + submissionId) to prevent replay/bot spam
const recentUpvotes = new Set<string>();

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const submissionId = Number(id);

    if (isNaN(submissionId)) {
      return NextResponse.json(
        { error: "Invalid submission ID" },
        { status: 400 }
      );
    }

    // Identify client by IP or forwarding header
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "client-ip";
    const voteKey = `${ip}_${submissionId}`;

    if (recentUpvotes.has(voteKey)) {
      const current = await prisma.communityProblem.findUnique({
        where: { id: submissionId },
        select: { id: true, upvotes: true, title: true },
      });
      return NextResponse.json(
        {
          error: "Already upvoted",
          alreadyVoted: true,
          upvotes: current?.upvotes ?? 1,
        },
        { status: 200 }
      );
    }

    // Register vote
    recentUpvotes.add(voteKey);
    if (recentUpvotes.size > 20000) {
      recentUpvotes.clear();
    }

    const updated = await prisma.communityProblem.update({
      where: { id: submissionId },
      data: {
        upvotes: {
          increment: 1,
        },
      },
      select: {
        id: true,
        upvotes: true,
        title: true,
      },
    });

    return NextResponse.json({
      success: true,
      upvotes: updated.upvotes,
      submission: updated,
    });
  } catch (error) {
    console.error("Error upvoting submission:", error);
    return NextResponse.json(
      { error: "Failed to upvote submission" },
      { status: 500 }
    );
  }
}
