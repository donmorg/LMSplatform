import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Star, Trophy, Plus, Search, Filter, ArrowRight, MoreVertical, BookOpen, Award } from "lucide-react";
import Link from "next/link";

export default async function QuizzesManagementPage() {
  const session = await auth();
  const teacherId = (session?.user as any)?.id;

  const quizzes = await prisma.quiz.findMany({
    where: { teacherId },
    include: { lesson: true, submissions: true },
    orderBy: { createdAt: "desc" },
  });

  const tests = await prisma.test.findMany({
    where: { teacherId },
    include: { testLessons: { include: { lesson: true } }, testSubmissions: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quizzes & Tests</h1>
          <p className="text-gray-500 mt-1">Manage your knowledge checks and comprehensive exams.</p>
        </div>
        <div className="flex gap-4">
          <Link 
            href="/teacher/quizzes/new"
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Quiz
          </Link>
          <Link 
            href="/teacher/tests/new"
            className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold shadow-lg hover:bg-black transition-all flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Test
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Quizzes Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-black text-gray-900 flex items-center">
            <Star className="w-6 h-6 mr-3 text-amber-500 fill-amber-500" />
            Lesson Quizzes
          </h2>
          <div className="space-y-4">
            {quizzes.length > 0 ? (
              quizzes.map((quiz) => (
                <div key={quiz.id} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                        <Star className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{quiz.title}</h3>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Lesson: {quiz.lesson.title}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <div className="flex space-x-6">
                      <div className="text-center">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Submissions</p>
                        <p className="font-bold text-gray-900">{quiz.submissions.length}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Avg. Score</p>
                        <p className="font-bold text-gray-900">
                          {quiz.submissions.length > 0 
                            ? Math.round(quiz.submissions.reduce((acc, s) => acc + s.score, 0) / quiz.submissions.length)
                            : 0}%
                        </p>
                      </div>
                    </div>
                    <Link 
                      href={`/teacher/quizzes/${quiz.id}`}
                      className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-indigo-600 hover:text-white transition-all"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200">
                <p className="text-gray-400 font-bold">No quizzes created yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Tests Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-black text-gray-900 flex items-center">
            <Trophy className="w-6 h-6 mr-3 text-indigo-600" />
            Program Tests
          </h2>
          <div className="space-y-4">
            {tests.length > 0 ? (
              tests.map((test) => (
                <div key={test.id} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                        <Award className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{test.title}</h3>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{test.testLessons.length} Lessons Included</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <div className="flex space-x-6">
                      <div className="text-center">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Submissions</p>
                        <p className="font-bold text-gray-900">{test.testSubmissions.length}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Difficulty</p>
                        <p className="font-bold text-indigo-600">Advanced</p>
                      </div>
                    </div>
                    <Link 
                      href={`/teacher/tests/${test.id}`}
                      className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-indigo-600 hover:text-white transition-all"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200">
                <p className="text-gray-400 font-bold">No program tests created yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
