"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Video, FileText, Link as LinkIcon, Upload, Save, Trash2 } from "lucide-react";
import Link from "next/link";

export default function EditLessonPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id: lessonId } = use(params);


  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [lessonData, setLessonData] = useState({
    title: "",
    description: "",
    type: "VIDEO",
    contentUrl: "",
    order: 0
  });

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const res = await fetch(`/api/lessons`);
        const lessons = await res.json();
        const lesson = lessons.find((l: any) => l.id === lessonId);
        if (lesson) {
          setLessonData({
            title: lesson.title,
            description: lesson.description || "",
            type: lesson.type,
            contentUrl: lesson.contentUrl,
            order: lesson.order
          });
        } else {
          setError("Lesson not found");
        }
      } catch (err) {
        setError("Failed to fetch lesson details");
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, [lessonId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch(`/api/lessons`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: lessonId, ...lessonData }),
      });

      if (!res.ok) throw new Error("Failed to update lesson");

      router.push("/teacher/lessons");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
        <p className="text-gray-500 font-bold">Loading lesson details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <Link href="/teacher/lessons" className="inline-flex items-center text-gray-500 hover:text-indigo-600 font-bold transition-colors">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Lessons
      </Link>

      <div>
        <h1 className="text-4xl font-black text-gray-900">Edit Lesson ✏️</h1>
        <p className="text-gray-500 mt-2 text-lg">Update your educational content and materials.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-indigo-500/5 space-y-8">
          <div className="space-y-4">
            <label className="block text-sm font-black text-gray-700 uppercase tracking-widest">Lesson Title</label>
            <input
              type="text"
              required
              value={lessonData.title}
              onChange={(e) => setLessonData({ ...lessonData, title: e.target.value })}
              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold"
            />
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-black text-gray-700 uppercase tracking-widest">Description</label>
            <textarea
              rows={4}
              value={lessonData.description}
              onChange={(e) => setLessonData({ ...lessonData, description: e.target.value })}
              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium resize-none"
            />
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-black text-gray-700 uppercase tracking-widest">Content Type</label>
            <div className="grid grid-cols-3 gap-4">
              {[
                { id: "VIDEO", icon: Video, label: "Video" },
                { id: "PDF", icon: FileText, label: "PDF" },
                { id: "LINK", icon: LinkIcon, label: "Link" },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setLessonData({ ...lessonData, type: t.id })}
                  className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all ${
                    lessonData.type === t.id 
                      ? "border-indigo-600 bg-indigo-50 text-indigo-600" 
                      : "border-gray-50 bg-gray-50 text-gray-400 hover:border-gray-200"
                  }`}
                >
                  <t.icon className="w-6 h-6 mb-2" />
                  <span className="font-bold text-sm">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-black text-gray-700 uppercase tracking-widest">
              {lessonData.type === "LINK" ? "Resource URL" : "File URL"}
            </label>
            <input
              type="text"
              required
              value={lessonData.contentUrl}
              onChange={(e) => setLessonData({ ...lessonData, contentUrl: e.target.value })}
              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold"
            />
          </div>
        </div>

        {error && (
          <div className="p-6 bg-red-50 text-red-700 font-bold rounded-[2rem] border border-red-100 text-center">
            {error}
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 py-6 bg-indigo-600 text-white rounded-[2.5rem] font-black text-xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center"
          >
            {saving ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6 mr-3" />}
            {saving ? "Updating..." : "Save Changes"}
          </button>
          <button
            type="button"
            className="px-10 py-6 bg-white border-2 border-red-100 text-red-500 rounded-[2.5rem] font-black hover:bg-red-50 transition-all flex items-center justify-center"
          >
            <Trash2 className="w-6 h-6" />
          </button>
        </div>
      </form>
    </div>
  );
}
