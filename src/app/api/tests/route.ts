import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "TEACHER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description, lessonIds, questions } = await req.json();

    if (!title || !lessonIds || lessonIds.length === 0 || !questions) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const test = await prisma.test.create({
      data: {
        title,
        description,
        questions: JSON.stringify(questions),
        teacherId: (session.user as any).id,
        testLessons: {
          create: lessonIds.map((lessonId: string) => ({
            lesson: { connect: { id: lessonId } }
          }))
        }
      },
    });

    return NextResponse.json(test);
  } catch (error) {
    console.error("Test creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const tests = await prisma.test.findMany({
      include: { testLessons: { include: { lesson: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(tests);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch tests" }, { status: 500 });
  }
}
