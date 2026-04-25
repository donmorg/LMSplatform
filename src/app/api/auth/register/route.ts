import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { fullName, username, email, password, role, passkey } = await req.json();

    if (!fullName || !username || !email || !password || !role) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (role === "TEACHER" && passkey !== "lms2026") {
      return NextResponse.json({ error: "Invalid teacher passkey" }, { status: 403 });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const avatarColors = ["#7c3aed", "#ec4899", "#3b82f6", "#10b981", "#f59e0b"];
    const avatarColor = avatarColors[Math.floor(Math.random() * avatarColors.length)];

    const user = await prisma.user.create({
      data: {
        fullName,
        username,
        email,
        passwordHash,
        role,
        avatarColor,
      },
    });

    return NextResponse.json({ message: "User created successfully", userId: user.id });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
