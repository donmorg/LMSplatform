import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BookOpen, Video, FileText, Link as LinkIcon, Star, Search, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function StudentLessonsPage() {
  const session = await auth();
  const studentId = (session?.user as any)?.id;

  const lessons = await prisma.lesson.findMany({
    orderBy: { order: "asc" },
    include: { 
      quiz: true,
      progress: {
        where: { studentId }
      }
    }
  });

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900">Your Learning Journey 🎒</h1>
          <p className="text-gray-500 mt-2 text-lg">Pick a lesson and start discovering new things!</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search lessons..." 
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {lessons.length > 0 ? (
          lessons.map((lesson) => {
            const isCompleted = lesson.progress[0]?.status === "COMPLETED";
            return (
              <Link 
                key={lesson.id} 
                href={`/student/lessons/${lesson.id}`}
                className="group bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/10 transition-all hover:-translate-y-2 relative"
              >
                {/* Image Placeholder / Icon Area */}
                <div className={`h-48 flex items-center justify-center relative overflow-hidden ${
                  lesson.type === "VIDEO" ? "bg-red-50" :
                  lesson.type === "PDF" ? "bg-blue-50" : "bg-green-50"
                }`}>
                  <div className={`p-6 rounded-[2rem] bg-white shadow-xl transition-transform group-hover:scale-125 duration-500 ${
                    lesson.type === "VIDEO" ? "text-red-500" :
                    lesson.type === "PDF" ? "text-blue-500" : "text-green-500"
                  }`}>
                    {lesson.type === "VIDEO" ? <Video className="w-10 h-10" /> : 
                     lesson.type === "PDF" ? <FileText className="w-10 h-10" /> : <LinkIcon className="w-10 h-10" />}
                  </div>
                  
                  {isCompleted && (
                    <div className="absolute top-6 right-6 bg-green-500 text-white p-2 rounded-full shadow-lg animate-bounce">
                      <Star className="w-5 h-5 fill-current" />
                    </div>
                  )}
                </div>

                <div className="p-8">
                  <div className="flex items-center space-x-2 mb-4">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                      lesson.type === "VIDEO" ? "bg-red-100 text-red-600" :
                      lesson.type === "PDF" ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"
                    }`}>
                      {lesson.type}
                    </span>
                    {lesson.quiz && (
                      <span className="bg-amber-100 text-amber-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        Quiz
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">{lesson.title}</h3>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-8 leading-relaxed font-medium">
                    {lesson.description || "Start this lesson to learn more about this topic!"}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <div className="flex items-center text-gray-400 text-xs font-bold">
                      <Clock className="w-4 h-4 mr-1" />
                      5-10 min
                    </div>
                    <div className="text-indigo-600 font-black text-sm flex items-center group-hover:translate-x-1 transition-transform">
                      {isCompleted ? "Learn Again" : "Start Now"} 
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="col-span-3 py-20 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-50 rounded-[2rem] mb-6">
              <BookOpen className="w-10 h-10 text-gray-200" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">No lessons here yet!</h2>
            <p className="text-gray-500 mt-2">Check back later for exciting new content. 🌟</p>
          </div>
        )}
      </div>
    </div>
  );
}
