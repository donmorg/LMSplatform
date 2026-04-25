import TeacherSidebar from "@/components/layout/TeacherSidebar";
import TopBar from "@/components/layout/TopBar";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white flex">
      <TeacherSidebar />
      <div className="flex-1 ml-72">
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-40">
           <div className="flex items-center space-x-2">
             <h2 className="text-lg font-bold text-gray-900">Teacher Control Center</h2>
           </div>
           <TopBar />
        </header>
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
