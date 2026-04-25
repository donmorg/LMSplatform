import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ArrowLeft, Star, Clock, User, CheckCircle, BookOpen } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import VideoPlayer from "@/components/lesson/VideoPlayer";
import PdfViewer from "@/components/lesson/PdfViewer";

export default async function LessonViewerPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const { id: lessonId } = await params;
  const studentId = (session?.user as any)?.id;

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { 
      teacher: true,
      quiz: true,
      progress: {
        where: { studentId }
      }
    }
  });

  if (!lesson) notFound();

  const isCompleted = lesson.progress[0]?.status === "COMPLETED";

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Link href="/student/lessons" className="inline-flex items-center text-gray-500 hover:text-indigo-600 font-bold transition-colors">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Library
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[3rem] overflow-hidden shadow-2xl shadow-indigo-500/5 border border-gray-100">
            {lesson.type === "VIDEO" && <VideoPlayer url={lesson.contentUrl} />}
            {lesson.type === "PDF" && <PdfViewer url={lesson.contentUrl} />}
            {lesson.type === "LINK" && (
              <div className="p-12 text-center space-y-6">
                <div className="w-20 h-20 bg-green-50 text-green-500 rounded-[2rem] flex items-center justify-center mx-auto">
                  <BookOpen className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-black text-gray-900">External Learning Resource</h2>
                <p className="text-gray-500 max-w-sm mx-auto">Click the button below to open this resource in a new tab.</p>
                <a 
                  href={lesson.contentUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block px-10 py-5 bg-indigo-600 text-white rounded-[2rem] font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95"
                >
                  Visit Resource 🚀
                </a>
              </div>
            )}
          </div>

          <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
            <h1 className="text-4xl font-black text-gray-900 mb-4">{lesson.title}</h1>
            <div className="flex flex-wrap items-center gap-6 mb-8 text-sm font-bold text-gray-400">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2 text-indigo-600" />
                Teacher: {lesson.teacher.fullName}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2 text-amber-500" />
                Estimated: 10 mins
              </div>
              {isCompleted && (
                <div className="flex items-center text-green-500">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Completed
                </div>
              )}
            </div>
            <div className="prose prose-indigo max-w-none">
              <p className="text-gray-600 text-lg leading-relaxed">{lesson.description || "No description provided for this lesson."}</p>
            </div>
          </div>
        </div>

        {/* Sidebar / Quiz CTA */}
        <div className="space-y-8">
          {lesson.quiz ? (
            <div className="bg-gradient-to-br from-amber-400 to-amber-600 p-1 rounded-[3rem] shadow-xl shadow-amber-200">
              <div className="bg-white p-10 rounded-[2.8rem] text-center">
                <div className="w-20 h-20 bg-amber-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                  <Star className="w-10 h-10 text-amber-500 fill-amber-500" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">Quiz Time!</h3>
                <p className="text-gray-500 text-sm mb-8">Test your knowledge and earn stars for your profile!</p>
                <Link 
                  href={`/student/quizzes/${lesson.quiz.id}`}
                  className="block w-full py-5 bg-amber-500 text-white rounded-[2rem] font-black shadow-lg shadow-amber-100 hover:bg-amber-600 transition-all hover:scale-105 active:scale-95"
                >
                  Start Quiz Now! 🌟
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-indigo-50 p-10 rounded-[3rem] border border-indigo-100">
              <h3 className="text-xl font-black text-indigo-900 mb-4">What's Next?</h3>
              <p className="text-indigo-700 text-sm mb-6 font-medium">Once you're finished with this lesson, you can explore other topics in your library!</p>
              <Link 
                href="/student/lessons"
                className="block w-full py-4 bg-white border-2 border-indigo-200 text-indigo-600 rounded-[2rem] font-bold text-center hover:bg-indigo-100 transition-all"
              >
                Go to Library
              </Link>
            </div>
          )}

          <div className="bg-gray-900 p-10 rounded-[3rem] text-white">
            <h3 className="text-xl font-bold mb-6">Progress</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-xs font-bold text-gray-400">
                <span>COURSE COMPLETION</span>
                <span>45%</span>
              </div>
              <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full w-[45%]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
