import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Users, BookOpen, Star, TrendingUp, Plus, ArrowRight, UserCheck } from "lucide-react";
import Link from "next/link";

export default async function TeacherDashboard() {
  const session = await auth();
  const teacherId = (session?.user as any)?.id;

  // Fetch stats
  const studentCount = await prisma.user.count({ where: { role: "STUDENT" } });
  const lessonCount = await prisma.lesson.count({ where: { teacherId } });
  const quizCount = await prisma.quiz.count({ where: { teacherId } });

  const recentStudents = await prisma.user.findMany({
    where: { role: "STUDENT" },
    take: 5,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back, Teacher!</h1>
          <p className="text-gray-500 mt-1">Here's what's happening in your classroom today.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Link 
            href="/teacher/lessons/new"
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Lesson
          </Link>
          <Link 
            href="/teacher/quizzes/new"
            className="px-6 py-3 bg-white text-gray-700 border border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition-all flex items-center"
          >
            <Star className="w-5 h-5 mr-2 text-amber-500" />
            New Quiz
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Students", value: studentCount, icon: Users, color: "bg-blue-50 text-blue-600" },
          { label: "Active Lessons", value: lessonCount, icon: BookOpen, color: "bg-indigo-50 text-indigo-600" },
          { label: "Quizzes Created", value: quizCount, icon: Star, color: "bg-amber-50 text-amber-600" },
          { label: "Avg. Performance", value: "84%", icon: TrendingUp, color: "bg-green-50 text-green-600" }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Activity / Students */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">New Students</h2>
              <Link href="/teacher/students" className="text-sm font-bold text-indigo-600 hover:underline">View Roster</Link>
            </div>
            <div className="divide-y divide-gray-50">
              {recentStudents.length > 0 ? (
                recentStudents.map((student) => (
                  <div key={student.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: student.avatarColor }}
                      >
                        {student.fullName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{student.fullName}</p>
                        <p className="text-xs text-gray-500">Joined {new Date(student.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <Link 
                      href={`/teacher/students/${student.id}`}
                      className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center">
                  <UserCheck className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-400 font-medium">No students registered yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Insights */}
        <div className="space-y-6">
          <div className="bg-indigo-900 text-white p-8 rounded-[2.5rem] relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-4">Class Insights</h3>
              <p className="text-indigo-200 text-sm mb-6">Your students are most active between 4 PM and 6 PM.</p>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span>Lesson Completion Rate</span>
                  <span className="font-bold">72%</span>
                </div>
                <div className="w-full bg-indigo-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-400 h-full w-[72%]" />
                </div>
              </div>
            </div>
            <TrendingUp className="absolute -bottom-6 -right-6 w-32 h-32 text-indigo-800 opacity-50 group-hover:scale-110 transition-transform" />
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Quizzes</h3>
            <div className="space-y-4">
              <p className="text-sm text-gray-500 text-center py-4">No recent submissions to review.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
