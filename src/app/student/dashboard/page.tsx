import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Star, BookOpen, Clock, Trophy, ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function StudentDashboard() {
  const session = await auth();
  const studentId = (session?.user as any)?.id;

  // Fetch some stats for the dashboard
  const progressCount = await prisma.lessonProgress.count({
    where: { studentId, status: "COMPLETED" },
  });

  const recentLessons = await prisma.lesson.findMany({
    take: 3,
    orderBy: { createdAt: "desc" },
  });

  const userName = session?.user?.name || "Student";

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Welcome Banner */}
      <div className="relative p-10 rounded-[3rem] bg-indigo-600 text-white overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl font-black mb-2">Good morning, {userName}! 🌟</h1>
          <p className="text-indigo-100 text-lg opacity-90">Ready for another adventure in learning today?</p>
          <div className="mt-8 flex space-x-4">
            <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-2xl flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-amber-300" />
              <span className="font-bold">{progressCount} Lessons Completed</span>
            </div>
            <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-2xl flex items-center">
              <Star className="w-5 h-5 mr-2 text-amber-300" />
              <span className="font-bold">120 Points Earned</span>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-400/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Continue Learning */}
        <div className="md:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-gray-900">Jump Back In</h2>
            <Link href="/student/lessons" className="text-indigo-600 font-bold hover:underline flex items-center">
              See All <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-6">
            {recentLessons.length > 0 ? (
              recentLessons.map((lesson) => (
                <Link 
                  key={lesson.id} 
                  href={`/student/lessons/${lesson.id}`}
                  className="group bg-white p-6 rounded-[2rem] border border-gray-100 hover:border-indigo-200 transition-all shadow-sm hover:shadow-xl hover:shadow-indigo-500/5"
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${
                    lesson.type === "VIDEO" ? "bg-red-50 text-red-500" :
                    lesson.type === "PDF" ? "bg-blue-50 text-blue-500" : "bg-green-50 text-green-500"
                  }`}>
                    {lesson.type === "VIDEO" ? <Clock className="w-7 h-7" /> : <BookOpen className="w-7 h-7" />}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">{lesson.title}</h3>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-6">{lesson.description}</p>
                  <div className="flex items-center text-indigo-600 font-bold text-sm">
                    Open Lesson <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-2 p-12 text-center bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
                <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">No lessons available yet. Check back soon! 🌟</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Cards */}
        <div className="space-y-8">
          <div className="bg-amber-50 p-8 rounded-[2.5rem] border border-amber-100">
            <h3 className="text-xl font-black text-amber-900 mb-4 flex items-center">
              <Star className="w-6 h-6 mr-2 fill-amber-500 text-amber-500" />
              Daily Challenge
            </h3>
            <p className="text-amber-800 font-medium mb-6">Complete 2 quizzes today to earn the "Fast Learner" badge!</p>
            <div className="bg-white/60 p-4 rounded-2xl flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-amber-900">Quizzes Done</span>
              <span className="text-sm font-black text-amber-900">0/2</span>
            </div>
            <div className="w-full bg-amber-200 h-2 rounded-full">
              <div className="bg-amber-500 h-full w-0 rounded-full" />
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <h3 className="text-xl font-black text-gray-900 mb-6">Leaderboard</h3>
            <div className="space-y-6">
              {[
                { name: "Ahmed", points: 1250, color: "bg-indigo-100 text-indigo-600" },
                { name: "Sara", points: 1100, color: "bg-pink-100 text-pink-600" },
                { name: "Youssef", points: 950, color: "bg-green-100 text-green-600" }
              ].map((user, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${user.color}`}>
                      {user.name.charAt(0)}
                    </div>
                    <span className="font-bold text-gray-700">{user.name}</span>
                  </div>
                  <span className="font-black text-gray-400">{user.points}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
