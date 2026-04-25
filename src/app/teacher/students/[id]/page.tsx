import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ArrowLeft, BookOpen, Star, Trophy, CheckCircle, Clock, Calendar, Mail, User } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function StudentReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const student = await prisma.user.findUnique({
    where: { id },
    include: {
      submissions: { include: { quiz: true }, orderBy: { submittedAt: "desc" } },
      testSubmissions: { include: { test: true }, orderBy: { submittedAt: "desc" } },
      progress: { include: { lesson: true } },
    }
  });

  if (!student || student.role !== "STUDENT") notFound();

  const completedLessons = student.progress.filter(p => p.status === "COMPLETED").length;
  const avgQuizScore = student.submissions.length > 0 
    ? Math.round(student.submissions.reduce((acc, curr) => acc + curr.score, 0) / student.submissions.length) 
    : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <Link href="/teacher/students" className="inline-flex items-center text-gray-500 hover:text-indigo-600 font-bold transition-colors">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Roster
      </Link>

      <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-indigo-500/5">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          <div 
            className="w-32 h-32 rounded-[2.5rem] flex items-center justify-center text-white text-5xl font-black shadow-lg"
            style={{ backgroundColor: student.avatarColor }}
          >
            {student.fullName.charAt(0)}
          </div>
          <div className="text-center md:text-left flex-1">
            <h1 className="text-4xl font-black text-gray-900 mb-2">{student.fullName}</h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-gray-500 font-medium text-sm">
              <span className="flex items-center"><Mail className="w-4 h-4 mr-2" /> {student.email}</span>
              <span className="flex items-center"><Calendar className="w-4 h-4 mr-2" /> Joined {new Date(student.createdAt).toLocaleDateString()}</span>
              <span className="flex items-center"><User className="w-4 h-4 mr-2" /> Username: {student.username}</span>
            </div>
          </div>
          <div className="bg-indigo-600 text-white px-8 py-4 rounded-3xl text-center shadow-lg shadow-indigo-200">
            <p className="text-xs font-bold uppercase tracking-widest opacity-70 mb-1">Overall Rank</p>
            <p className="text-2xl font-black">Top 10% 🌟</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Performance Stats */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <h3 className="text-lg font-black text-gray-900 mb-6">Learning Stats</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-600 font-bold">
                  <BookOpen className="w-5 h-5 mr-3 text-indigo-500" />
                  Lessons Completed
                </div>
                <span className="text-xl font-black text-gray-900">{completedLessons}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-600 font-bold">
                  <Star className="w-5 h-5 mr-3 text-amber-500" />
                  Quizzes Taken
                </div>
                <span className="text-xl font-black text-gray-900">{student.submissions.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-600 font-bold">
                  <Trophy className="w-5 h-5 mr-3 text-indigo-500" />
                  Avg. Score
                </div>
                <span className="text-xl font-black text-gray-900">{avgQuizScore}%</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 p-8 rounded-[2.5rem] text-white">
            <h3 className="text-lg font-bold mb-6">Recent Progress</h3>
            <div className="space-y-4">
              {student.progress.slice(0, 3).map((p) => (
                <div key={p.id} className="flex items-center justify-between text-sm">
                  <span className="truncate max-w-[150px] text-gray-400 font-medium">{p.lesson.title}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${p.status === "COMPLETED" ? "bg-green-500/20 text-green-400" : "bg-amber-500/20 text-amber-400"}`}>
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed History */}
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-50">
              <h3 className="text-xl font-black text-gray-900">Quiz & Test History</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {student.submissions.length > 0 || student.testSubmissions.length > 0 ? (
                [...student.submissions.map(s => ({ ...s, type: "QUIZ" })), ...student.testSubmissions.map(t => ({ ...t, type: "TEST", quiz: t.test }))].map((sub: any) => (
                  <div key={sub.id} className="p-8 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${sub.type === "QUIZ" ? "bg-indigo-50 text-indigo-600" : "bg-amber-50 text-amber-600"}`}>
                        {sub.type === "QUIZ" ? <Star className="w-6 h-6" /> : <Trophy className="w-6 h-6" />}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{sub.quiz.title}</p>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{sub.type} • {new Date(sub.submittedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-2xl font-black ${sub.score >= 70 ? "text-green-600" : "text-amber-600"}`}>{sub.score}%</p>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{sub.score >= 70 ? "Passed" : "Keep Trying"}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-20 text-center">
                  <CheckCircle className="w-12 h-12 text-gray-100 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">No submission history found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
