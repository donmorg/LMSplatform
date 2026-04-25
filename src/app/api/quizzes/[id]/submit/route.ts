import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "STUDENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { answers } = await req.json();
    const quizId = params.id;
    const studentId = (session.user as any).id;

    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    const questions = JSON.parse(quiz.questions);
    let correctCount = 0;

    questions.forEach((q: any) => {
      if (answers[q.id] === q.correctIndex) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / questions.length) * 100);

    const submission = await prisma.submission.upsert({
      where: {
        studentId_quizId: {
          studentId,
          quizId,
        },
      },
      update: {
        answers: JSON.stringify(answers),
        score,
        maxScore: 100,
      },
      create: {
        studentId,
        quizId,
        answers: JSON.stringify(answers),
        score,
        maxScore: 100,
      },
    });

    // Also mark lesson as completed if score is passing (>= 70)
    if (score >= 70) {
      await prisma.lessonProgress.upsert({
        where: {
          studentId_lessonId: {
            studentId,
            lessonId: quiz.lessonId,
          },
        },
        update: {
          status: "COMPLETED",
        },
        create: {
          studentId,
          lessonId: quiz.lessonId,
          status: "COMPLETED",
        },
      });
    }

    return NextResponse.json({ score, submissionId: submission.id });
  } catch (error) {
    console.error("Submission error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const quiz = await prisma.quiz.findUnique({
      where: { id: params.id },
      include: { lesson: true },
    });

    if (!quiz) return NextResponse.json({ error: "Quiz not found" }, { status: 404 });

    // Remove correctIndex for students
    if ((session.user as any).role === "STUDENT") {
      const questions = JSON.parse(quiz.questions);
      const safeQuestions = questions.map(({ correctIndex, ...q }: any) => q);
      return NextResponse.json({ ...quiz, questions: JSON.stringify(safeQuestions) });
    }

    return NextResponse.json(quiz);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
