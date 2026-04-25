import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Plus, Search, Filter, MoreVertical, Video, FileText, Link as LinkIcon, Trash2, Edit, BookOpen, Star } from "lucide-react";
import Link from "next/link";

export default async function ManageLessonsPage() {
  const session = await auth();
  const teacherId = (session?.user as any)?.id;

  const lessons = await prisma.lesson.findMany({
    where: { teacherId },
    orderBy: { createdAt: "desc" },
    include: { quiz: true },
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Lessons</h1>
          <p className="text-gray-500 mt-1">Create, edit, and organize your educational content.</p>
        </div>
        <Link 
          href="/teacher/lessons/new"
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create New Lesson
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search lessons by title..." 
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-3 bg-white border border-gray-200 rounded-xl font-bold text-gray-700 flex items-center hover:bg-gray-50 transition-all">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
        </div>
      </div>

      {/* Lessons Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Lesson Content</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Quiz</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Created At</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {lessons.length > 0 ? (
                lessons.map((lesson) => (
                  <tr key={lesson.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          lesson.type === "VIDEO" ? "bg-red-50 text-red-500" :
                          lesson.type === "PDF" ? "bg-blue-50 text-blue-500" : "bg-green-50 text-green-500"
                        }`}>
                          {lesson.type === "VIDEO" ? <Video className="w-5 h-5" /> : 
                           lesson.type === "PDF" ? <FileText className="w-5 h-5" /> : <LinkIcon className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{lesson.title}</p>
                          <p className="text-xs text-gray-500 truncate max-w-[200px]">{lesson.description || "No description"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        lesson.type === "VIDEO" ? "bg-red-100 text-red-700" :
                        lesson.type === "PDF" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
                      }`}>
                        {lesson.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {lesson.quiz ? (
                        <span className="flex items-center text-xs font-bold text-indigo-600">
                          <Star className="w-4 h-4 mr-1 fill-indigo-600" />
                          Included
                        </span>
                      ) : (
                        <Link 
                          href={`/teacher/quizzes/new?lessonId=${lesson.id}`}
                          className="text-xs font-bold text-gray-400 hover:text-indigo-600 hover:underline"
                        >
                          + Add Quiz
                        </Link>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(lesson.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link 
                          href={`/teacher/lessons/${lesson.id}/edit`}
                          className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                          title="Edit Lesson"
                        >
                          <Edit className="w-5 h-5" />
                        </Link>
                        <Link 
                          href={`/teacher/lessons/${lesson.id}/analytics`}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          title="View Analytics"
                        >
                          <BookOpen className="w-5 h-5" />
                        </Link>
                        <button className="p-2 text-gray-400 hover:text-red-600 transition-colors" title="Delete">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center">
                      <BookOpen className="w-12 h-12 text-gray-200 mb-4" />
                      <p className="text-gray-500 font-medium">No lessons found. Start by creating your first lesson!</p>
                      <Link 
                        href="/teacher/lessons/new"
                        className="mt-4 text-indigo-600 font-bold hover:underline"
                      >
                        Create Lesson Now
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
