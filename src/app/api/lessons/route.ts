import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "TEACHER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description, type, contentUrl } = await req.json();

    if (!title || !type || !contentUrl) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const lesson = await prisma.lesson.create({
      data: {
        title,
        description,
        type,
        contentUrl,
        teacherId: (session.user as any).id,
      },
    });

    return NextResponse.json(lesson);
  } catch (error) {
    console.error("Lesson creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const lessons = await prisma.lesson.findMany({
      orderBy: { createdAt: "desc" },
      include: { quiz: true },
    });
    return NextResponse.json(lessons);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch lessons" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "TEACHER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, title, description, type, contentUrl } = await req.json();

    const lesson = await prisma.lesson.update({
      where: { id },
      data: { title, description, type, contentUrl },
    });

    return NextResponse.json(lesson);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update lesson" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "TEACHER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();

    await prisma.lesson.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete lesson" }, { status: 500 });
  }
}
