import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "TEACHER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, lessonId, timeLimit, questions } = await req.json();

    if (!title || !lessonId || !questions) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const quiz = await prisma.quiz.create({
      data: {
        title,
        lessonId,
        timeLimit: timeLimit || null,
        questions: JSON.stringify(questions),
        teacherId: (session.user as any).id,
      },
    });

    return NextResponse.json(quiz);
  } catch (error) {
    console.error("Quiz creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const quizzes = await prisma.quiz.findMany({
      include: { lesson: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(quizzes);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch quizzes" }, { status: 500 });
  }
}
