import StudentSidebar from "@/components/layout/StudentSidebar";
import TopBar from "@/components/layout/TopBar";
import TeacherSelectionModal from "@/components/student/TeacherSelectionModal";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get current session
  const session = await auth();
  const studentId = (session?.user as any)?.id;

  // Fetch student record to check if a teacher is already assigned
  const student = await prisma.user.findUnique({
    where: { id: studentId },
    select: { teacherId: true },
  });

  // Load all teachers for the selection modal
  const teachers = await prisma.user.findMany({
    where: { role: "TEACHER" },
    select: { id: true, fullName: true, avatarColor: true },
  });

  const needsSelection = !student?.teacherId;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <StudentSidebar />
      <div className="flex-1 ms-72">
        <TopBar />
        {needsSelection && <TeacherSelectionModal teachers={teachers} />}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
