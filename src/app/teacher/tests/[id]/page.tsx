import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ArrowLeft, Trophy, Users, CheckCircle, Award, UserCircle, PieChart, TrendingUp } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function TeacherTestDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: testId } = await params;
  const session = await auth();

  const test = await prisma.test.findUnique({
    where: { id: testId },
    include: {
      testLessons: { include: { lesson: true } },
      testSubmissions: {
        include: { student: true },
        orderBy: { submittedAt: "desc" }
      }
    }
  });

  if (!test) notFound();

  const totalSubmissions = test.testSubmissions.length;
  const avgScore = totalSubmissions > 0 
    ? Math.round(test.testSubmissions.reduce((acc, s) => acc + s.score, 0) / totalSubmissions)
    : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <Link href="/teacher/quizzes" className="inline-flex items-center text-gray-500 hover:text-indigo-600 font-bold transition-colors">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Quizzes & Tests
      </Link>

      <div className="bg-gray-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center space-x-6">
            <div className="w-16 h-16 bg-indigo-500 rounded-2xl flex items-center justify-center">
              <Award className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black">{test.title}</h1>
              <p className="text-gray-400 font-medium">Program Test • {test.testLessons.length} Lessons Included</p>
            </div>
          </div>
          <div className="flex gap-4">
            <button className="px-6 py-3 bg-gray-800 text-white rounded-xl font-bold hover:bg-gray-700 transition-all border border-gray-700">
              Export Results
            </button>
          </div>
        </div>
        <Trophy className="absolute -bottom-10 -right-10 w-48 h-48 text-indigo-500 opacity-20" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Candidates", value: totalSubmissions, icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
          { label: "Class Average", value: `${avgScore}%`, icon: TrendingUp, color: "text-indigo-500", bg: "bg-indigo-50" },
          { label: "Completion Rate", value: totalSubmissions > 0 ? "100%" : "0%", icon: CheckCircle, color: "text-green-500", bg: "bg-green-50" },
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
        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
          <h3 className="text-xl font-black text-gray-900">Student Test Results</h3>
          <span className="px-4 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black uppercase tracking-widest">
            {test.testSubmissions.length} Total
          </span>
        </div>
        <div className="divide-y divide-gray-50">
          {test.testSubmissions.length > 0 ? (
            test.testSubmissions.map((sub) => (
              <div key={sub.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                    <UserCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{sub.student.fullName}</p>
                    <p className="text-xs text-gray-400 font-medium">Finished on {new Date(sub.submittedAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-8">
                  <div className="text-right">
                    <p className={`text-xl font-black ${sub.score >= 70 ? "text-indigo-600" : "text-amber-600"}`}>
                      {sub.score}%
                    </p>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Final Grade</p>
                  </div>
                  <Link 
                    href={`/teacher/students/${sub.studentId}`}
                    className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                  >
                    <PieChart className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="p-20 text-center text-gray-400 font-medium">
              No students have taken this test yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
