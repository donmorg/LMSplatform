import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ArrowLeft, BookOpen, Users, Star, Clock, CheckCircle, TrendingUp, UserCircle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function LessonAnalyticsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: lessonId } = await params;
  const session = await auth();

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      quiz: {
        include: {
          submissions: {
            include: { student: true },
            orderBy: { submittedAt: "desc" }
          }
        }
      },
      progress: {
        include: { student: true }
      }
    }
  });

  if (!lesson) notFound();

  const completedCount = lesson.progress.filter(p => p.status === "COMPLETED").length;
  const inProgressCount = lesson.progress.filter(p => p.status === "IN_PROGRESS").length;
  const totalSubmissions = lesson.quiz?.submissions.length || 0;
  const avgScore = totalSubmissions > 0 
    ? Math.round(lesson.quiz!.submissions.reduce((acc, s) => acc + s.score, 0) / totalSubmissions)
    : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <Link href="/teacher/lessons" className="inline-flex items-center text-gray-500 hover:text-indigo-600 font-bold transition-colors">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Lessons
      </Link>

      <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-indigo-500/5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center space-x-6">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
              lesson.type === "VIDEO" ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-500"
            }`}>
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900">{lesson.title}</h1>
              <p className="text-gray-500 font-medium">Lesson Performance Analytics</p>
            </div>
          </div>
          <div className="flex space-x-4">
            <div className="bg-green-50 text-green-600 px-6 py-3 rounded-2xl font-bold text-sm flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Active Lesson
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Views", value: lesson.progress.length, icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
          { label: "Completions", value: completedCount, icon: CheckCircle, color: "text-green-500", bg: "bg-green-50" },
          { label: "Quiz Takers", value: totalSubmissions, icon: Star, color: "text-amber-500", bg: "bg-amber-50" },
          { label: "Avg. Quiz Score", value: `${avgScore}%`, icon: TrendingUp, color: "text-indigo-500", bg: "bg-indigo-50" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-2xl font-black text-gray-900">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Student Progress List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
              <h3 className="text-xl font-black text-gray-900">Recent Student Activity</h3>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                {lesson.progress.length} total students
              </span>
            </div>
            <div className="divide-y divide-gray-50">
              {lesson.progress.length > 0 ? (
                lesson.progress.map((prog) => (
                  <div key={prog.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                        <UserCircle className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{prog.student.fullName}</p>
                        <p className="text-xs text-gray-400 font-medium">Started on {new Date(prog.updatedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className={`px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest ${
                      prog.status === "COMPLETED" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                    }`}>
                      {prog.status.replace("_", " ")}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-20 text-center text-gray-400 font-medium">
                  No student has started this lesson yet.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quiz Performance Sidebar */}
        <div className="space-y-6">
          <div className="bg-gray-900 p-10 rounded-[3rem] text-white">
            <h3 className="text-xl font-bold mb-8 flex items-center">
              <Star className="w-5 h-5 mr-3 text-amber-400 fill-amber-400" />
              Quiz Scores
            </h3>
            <div className="space-y-6">
              {lesson.quiz?.submissions.length ? (
                lesson.quiz.submissions.slice(0, 5).map((sub) => (
                  <div key={sub.id} className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="font-bold text-sm">{sub.student.fullName}</span>
                      <span className="text-[10px] text-gray-500 uppercase font-black">{new Date(sub.submittedAt).toLocaleDateString()}</span>
                    </div>
                    <span className={`font-black text-lg ${sub.score >= 70 ? "text-green-400" : "text-amber-400"}`}>
                      {sub.score}%
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-gray-500 font-medium text-sm">
                  No quiz submissions yet.
                </div>
              )}
            </div>
          </div>

          <div className="bg-indigo-50 p-8 rounded-[2.5rem] border border-indigo-100">
            <h4 className="text-sm font-black text-indigo-900 uppercase tracking-widest mb-4">Lesson Tip</h4>
            <p className="text-indigo-700 text-sm leading-relaxed">
              If completion rates are low, consider breaking this lesson into smaller parts or adding more interactive examples.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
