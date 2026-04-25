import StudentSidebar from "@/components/layout/StudentSidebar";
import TopBar from "@/components/layout/TopBar";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <StudentSidebar />
      <div className="flex-1 ml-72">
        <TopBar />
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
