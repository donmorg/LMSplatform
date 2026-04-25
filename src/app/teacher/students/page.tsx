import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Users, Search, MoreVertical, Star, BookOpen, Trophy, ArrowRight, UserCircle } from "lucide-react";
import Link from "next/link";

export default async function StudentRosterPage() {
  const session = await auth();
  
  const students = await prisma.user.findMany({
    where: { role: "STUDENT" },
    include: {
      submissions: true,
      progress: true,
    },
    orderBy: { fullName: "asc" },
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Roster</h1>
          <p className="text-gray-500 mt-1">Track progress and performance of all students in your classes.</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search students by name or email..." 
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Student Name</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Lessons Done</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Avg. Quiz Score</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Last Active</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {students.length > 0 ? (
                students.map((student) => {
                  const completedLessons = student.progress.filter(p => p.status === "COMPLETED").length;
                  const totalScore = student.submissions.reduce((acc, curr) => acc + curr.score, 0);
                  const avgScore = student.submissions.length > 0 ? Math.round(totalScore / student.submissions.length) : 0;

                  return (
                    <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                            style={{ backgroundColor: student.avatarColor }}
                          >
                            {student.fullName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{student.fullName}</p>
                            <p className="text-xs text-gray-500">{student.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <BookOpen className="w-4 h-4 mr-2 text-indigo-400" />
                          <span className="font-bold text-gray-700">{completedLessons}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Trophy className={`w-4 h-4 mr-2 ${avgScore >= 80 ? "text-amber-500" : "text-gray-300"}`} />
                          <span className={`font-bold ${avgScore >= 80 ? "text-gray-900" : "text-gray-500"}`}>
                            {avgScore > 0 ? `${avgScore}%` : "No data"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(student.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link 
                          href={`/teacher/students/${student.id}`}
                          className="inline-flex items-center px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg font-bold hover:bg-indigo-100 transition-all text-xs"
                        >
                          View Report
                          <ArrowRight className="w-3 h-3 ml-2" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center">
                      <UserCircle className="w-12 h-12 text-gray-200 mb-4" />
                      <p className="text-gray-500 font-medium">No students registered yet.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
