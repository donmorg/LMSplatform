import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Trophy, Star, BookOpen, Clock, ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";

export default async function StudentResultsPage() {
  const session = await auth();
  const studentId = (session?.user as any)?.id;

  const submissions = await prisma.submission.findMany({
    where: { studentId },
    include: { quiz: { include: { lesson: true } } },
    orderBy: { submittedAt: "desc" },
  });

  const testSubmissions = await prisma.testSubmission.findMany({
    where: { studentId },
    include: { test: true },
    orderBy: { submittedAt: "desc" },
  });

  const avgScore = submissions.length > 0 
    ? Math.round(submissions.reduce((acc, curr) => acc + curr.score, 0) / submissions.length) 
    : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900">Your Achievements 🏆</h1>
          <p className="text-gray-500 mt-2 text-lg">Look at how much you've learned! Keep up the great work.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Stats Section */}
        <div className="space-y-8">
          <div className="bg-indigo-600 p-10 rounded-[3rem] text-white shadow-xl shadow-indigo-100 relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-xs font-black uppercase tracking-widest text-indigo-200 mb-2">Average Score</p>
              <h3 className="text-5xl font-black mb-6">{avgScore}%</h3>
              <div className="flex items-center text-sm font-bold text-indigo-100">
                <Star className="w-4 h-4 mr-2 fill-amber-300 text-amber-300" />
                Excellent Progress!
              </div>
            </div>
            <Trophy className="absolute -bottom-4 -right-4 w-32 h-32 text-indigo-500 opacity-20 group-hover:scale-110 transition-transform duration-700" />
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <h3 className="text-xl font-black text-gray-900 mb-6">Quiz Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between font-bold text-gray-600">
                <span>Total Quizzes</span>
                <span className="text-gray-900">{submissions.length}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-600">
                <span>Total Stars</span>
                <span className="text-gray-900">{submissions.length * 10}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results List */}
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-2xl font-black text-gray-900">Recent Scores</h2>
          
          <div className="space-y-4">
            {submissions.length > 0 ? (
              submissions.map((sub) => (
                <div key={sub.id} className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center justify-between group hover:border-indigo-200 transition-all shadow-sm hover:shadow-xl hover:shadow-indigo-500/5">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                      <Star className={`w-6 h-6 ${sub.score >= 70 ? "fill-indigo-600" : ""}`} />
                    </div>
                    <div>
                      <h4 className="font-black text-gray-900 group-hover:text-indigo-600 transition-colors">{sub.quiz.title}</h4>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{new Date(sub.submittedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <p className={`text-2xl font-black ${sub.score >= 70 ? "text-green-500" : "text-amber-500"}`}>{sub.score}%</p>
                    </div>
                    <Link href={`/student/lessons/${sub.quiz.lessonId}`} className="p-3 bg-gray-50 text-gray-400 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                <Trophy className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-500 font-bold">No results yet. Go take your first quiz! 🎒</p>
                <Link href="/student/lessons" className="inline-block mt-4 text-indigo-600 font-black hover:underline">Start Learning</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
