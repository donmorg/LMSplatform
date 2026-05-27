import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const teachers = await prisma.user.findMany({
      where: { role: "TEACHER" },
      select: {
        id: true,
        fullName: true,
        avatarColor: true,
      },
    });

    return NextResponse.json(teachers);
  } catch (error) {
    console.error("Error fetching teachers:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "STUDENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { teacherId } = body;

    if (!teacherId) {
      return NextResponse.json({ error: "Teacher ID is required" }, { status: 400 });
    }

    // Save the actual relationship in the database
    await prisma.user.update({
      where: { id: (session.user as any).id },
      data: { teacherId },
    });

    console.log(`Successfully assigned student ${(session.user as any).id} to teacher ${teacherId}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error setting teacher:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
