import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ArrowLeft, Star, Users, CheckCircle, Clock, TrendingUp, UserCircle, PieChart } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function TeacherQuizDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: quizId } = await params;
  const session = await auth();

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: {
      lesson: true,
      submissions: {
        include: { student: true },
        orderBy: { submittedAt: "desc" }
      }
    }
  });

  if (!quiz) notFound();

  const totalSubmissions = quiz.submissions.length;
  const avgScore = totalSubmissions > 0 
    ? Math.round(quiz.submissions.reduce((acc, s) => acc + s.score, 0) / totalSubmissions)
    : 0;
  
  const passRate = totalSubmissions > 0
    ? Math.round((quiz.submissions.filter(s => s.score >= 70).length / totalSubmissions) * 100)
    : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <Link href="/teacher/quizzes" className="inline-flex items-center text-gray-500 hover:text-indigo-600 font-bold transition-colors">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Quizzes
      </Link>

      <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-indigo-500/5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center space-x-6">
            <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
              <Star className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900">{quiz.title}</h1>
              <p className="text-gray-500 font-medium">Lesson: {quiz.lesson.title}</p>
            </div>
          </div>
          <div className="flex gap-4">
            <button className="px-6 py-3 bg-white border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-all">
              Edit Questions
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Attempts", value: totalSubmissions, icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
          { label: "Average Score", value: `${avgScore}%`, icon: TrendingUp, color: "text-indigo-500", bg: "bg-indigo-50" },
          { label: "Pass Rate", value: `${passRate}%`, icon: CheckCircle, color: "text-green-500", bg: "bg-green-50" },
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

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50">
          <h3 className="text-xl font-black text-gray-900">Student Submissions</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {quiz.submissions.length > 0 ? (
            quiz.submissions.map((sub) => (
              <div key={sub.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                    <UserCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{sub.student.fullName}</p>
                    <p className="text-xs text-gray-400 font-medium">Submitted on {new Date(sub.submittedAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-8">
                  <div className="text-right">
                    <p className={`text-xl font-black ${sub.score >= 70 ? "text-green-600" : "text-amber-600"}`}>
                      {sub.score}%
                    </p>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      {sub.score >= 70 ? "Pass" : "Fail"}
                    </p>
                  </div>
                  <Link 
                    href={`/teacher/students/${sub.studentId}`}
                    className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                    title="View Full Report"
                  >
                    <PieChart className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="p-20 text-center text-gray-400 font-medium">
              No students have taken this quiz yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
