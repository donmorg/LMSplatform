import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Star, Trophy, ArrowRight, Clock, CheckCircle, Award } from "lucide-react";
import Link from "next/link";

export default async function StudentQuizzesPage() {
  const session = await auth();
  const studentId = (session?.user as any)?.id;

  const quizzes = await prisma.quiz.findMany({
    include: { 
      lesson: true,
      submissions: {
        where: { studentId }
      }
    }
  });

  const tests = await prisma.test.findMany({
    include: {
      testSubmissions: {
        where: { studentId }
      }
    }
  });

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900">Challenges & Tests 🌟</h1>
          <p className="text-gray-500 mt-2 text-lg">Test your knowledge and earn stars for your profile!</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Quizzes Column */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-gray-900 flex items-center">
            <Star className="w-6 h-6 mr-3 text-amber-500 fill-amber-500" />
            Lesson Quizzes
          </h2>
          <div className="space-y-4">
            {quizzes.map((quiz) => {
              const submission = quiz.submissions[0];
              const isDone = !!submission;
              return (
                <div key={quiz.id} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all group relative overflow-hidden">
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center space-x-4">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                        isDone ? "bg-green-50 text-green-500" : "bg-amber-50 text-amber-500"
                      }`}>
                        {isDone ? <CheckCircle className="w-7 h-7" /> : <Star className="w-7 h-7" />}
                      </div>
                      <div>
                        <h3 className="font-black text-gray-900 group-hover:text-indigo-600 transition-colors">{quiz.title}</h3>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">For: {quiz.lesson.title}</p>
                      </div>
                    </div>
                    {isDone ? (
                      <div className="text-right">
                        <p className="text-2xl font-black text-green-600">{submission.score}%</p>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Completed</p>
                      </div>
                    ) : (
                      <Link 
                        href={`/student/quizzes/${quiz.id}`}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center"
                      >
                        Start 🚀
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tests Column */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-gray-900 flex items-center">
            <Trophy className="w-6 h-6 mr-3 text-indigo-600" />
            Program Tests
          </h2>
          <div className="space-y-4">
            {tests.length > 0 ? (
              tests.map((test) => {
                const submission = test.testSubmissions[0];
                const isDone = !!submission;
                return (
                  <div key={test.id} className="bg-gray-900 p-8 rounded-[2.8rem] text-white shadow-xl group relative overflow-hidden">
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center">
                          <Award className="w-6 h-6 text-white" />
                        </div>
                        {isDone && (
                          <span className="bg-green-500 text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                            Passed
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-black mb-2">{test.title}</h3>
                      <p className="text-gray-400 text-xs mb-8 font-medium leading-relaxed">{test.description || "A comprehensive test covering multiple lessons."}</p>
                      
                      <div className="flex items-center justify-between pt-6 border-t border-gray-800">
                        {isDone ? (
                          <div className="flex items-center space-x-2">
                            <span className="text-3xl font-black text-indigo-400">{submission.score}%</span>
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Best Score</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-gray-500 text-xs font-bold uppercase tracking-widest">
                            <Clock className="w-4 h-4 mr-2" />
                            20-30 Mins
                          </div>
                        )}
                        {!isDone && (
                          <button className="px-6 py-3 bg-white text-gray-900 rounded-xl font-black hover:bg-indigo-50 transition-all flex items-center">
                            Take Exam
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </button>
                        )}
                      </div>
                    </div>
                    <Trophy className="absolute -bottom-6 -right-6 w-32 h-32 text-indigo-500 opacity-10 group-hover:scale-110 transition-transform duration-700" />
                  </div>
                );
              })
            ) : (
              <div className="p-12 text-center bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200">
                <p className="text-gray-400 font-bold">No program tests available yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
