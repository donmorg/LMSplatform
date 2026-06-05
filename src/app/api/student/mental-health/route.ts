import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== "STUDENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { answers } = body; // Record<number, number>

    if (!answers || typeof answers !== "object") {
      return NextResponse.json({ error: "Invalid answers format" }, { status: 400 });
    }

    // Calculate score
    let score = 0;
    for (const key in answers) {
      score += answers[key];
    }

    const result = await prisma.mentalHealthResult.create({
      data: {
        studentId: session.user.id as string,
        score,
        answers: JSON.stringify(answers),
      },
    });
    // Mark test as completed for the student
    await prisma.user.update({
      where: { id: session.user.id as string },
      data: { testCompleted: true },
    });

    return NextResponse.json({ success: true, score: result.score });
  } catch (error) {
    console.error("Error saving mental health test:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
