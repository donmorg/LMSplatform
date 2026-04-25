"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Video, FileText, Link as LinkIcon, Upload, ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function NewLessonPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "VIDEO", // VIDEO, PDF, LINK
    contentUrl: "",
    file: null as File | null,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, file: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let finalUrl = formData.contentUrl;

      // If there's a file, upload it first
      if (formData.file) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", formData.file);
        uploadFormData.append("type", formData.type);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        });

        if (!uploadRes.ok) throw new Error("File upload failed");
        const uploadData = await uploadRes.json();
        finalUrl = uploadData.url;
      }

      const res = await fetch("/api/lessons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          type: formData.type,
          contentUrl: finalUrl,
        }),
      });

      if (!res.ok) throw new Error("Failed to create lesson");

      router.push("/teacher/lessons");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Link href="/teacher/lessons" className="inline-flex items-center text-gray-500 hover:text-indigo-600 font-bold transition-colors">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Lessons
      </Link>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl p-10">
        <div className="mb-10">
          <h1 className="text-3xl font-black text-gray-900">Create New Lesson</h1>
          <p className="text-gray-500 mt-2">Follow the steps below to share knowledge with your students.</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center mb-12">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center flex-1 last:flex-none">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                step >= s ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-400"
              }`}>
                {step > s ? <CheckCircle className="w-5 h-5" /> : s}
              </div>
              {s < 3 && <div className={`flex-1 h-1 mx-4 rounded-full ${step > s ? "bg-indigo-600" : "bg-gray-100"}`} />}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="p-4 bg-red-50 text-red-700 font-bold rounded-2xl border border-red-100">
              {error}
            </div>
          )}

          {/* Step 1: Content Type */}
          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-bold text-gray-900">What kind of content is this?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { id: "VIDEO", label: "Video Lesson", icon: Video, desc: "Upload or paste URL", color: "text-red-500 bg-red-50" },
                  { id: "PDF", label: "PDF Document", icon: FileText, desc: "Reading material", color: "text-blue-500 bg-blue-50" },
                  { id: "LINK", label: "External Link", icon: LinkIcon, desc: "Website or article", color: "text-green-500 bg-green-50" }
                ].map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: type.id })}
                    className={`p-6 rounded-[2rem] border-2 text-left transition-all hover:scale-105 active:scale-95 ${
                      formData.type === type.id 
                        ? "border-indigo-600 bg-indigo-50/30" 
                        : "border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${type.color}`}>
                      <type.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-gray-900">{type.label}</h3>
                    <p className="text-xs text-gray-500 mt-1">{type.desc}</p>
                  </button>
                ))}
              </div>
              <div className="pt-6">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
                >
                  Continue to Details
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Content Details */}
          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="space-y-4">
                <label className="block text-sm font-bold text-gray-700">Lesson Title</label>
                <input
                  type="text"
                  placeholder="e.g. Introduction to Solar Systems"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                />
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-bold text-gray-700">Description (Optional)</label>
                <textarea
                  placeholder="Tell students what they will learn..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium resize-none"
                />
              </div>
              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={!formData.title}
                  className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:bg-gray-300 disabled:shadow-none"
                >
                  Continue to Content
                </button>
              </div>
            </div>
          )}

          {/* Step 3: File Upload / URL */}
          {step === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-bold text-gray-900">Add your {formData.type.toLowerCase()} content</h2>
              
              {formData.type === "LINK" ? (
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-gray-700">External URL</label>
                  <div className="relative">
                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="url"
                      placeholder="https://example.com/lesson"
                      required
                      value={formData.contentUrl}
                      onChange={(e) => setFormData({ ...formData, contentUrl: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="border-2 border-dashed border-gray-200 rounded-[2rem] p-12 text-center bg-gray-50 hover:bg-indigo-50/50 hover:border-indigo-300 transition-all group relative cursor-pointer">
                    <input
                      type="file"
                      accept={formData.type === "PDF" ? "application/pdf" : "video/*"}
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    {formData.file ? (
                      <div className="space-y-2">
                        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                        <p className="font-bold text-gray-900">{formData.file.name}</p>
                        <p className="text-xs text-gray-500">{(formData.file.size / 1024 / 1024).toFixed(2)} MB • Click to change</p>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4 group-hover:text-indigo-500 group-hover:scale-110 transition-all" />
                        <p className="font-bold text-gray-700">Drag and drop or click to upload</p>
                        <p className="text-sm text-gray-500 mt-2">
                          Max size: {formData.type === "PDF" ? "50MB" : "500MB"}
                        </p>
                      </>
                    )}
                  </div>
                  
                  {formData.type === "VIDEO" && (
                    <div className="space-y-4">
                      <div className="relative flex items-center">
                        <div className="flex-1 h-px bg-gray-100" />
                        <span className="px-4 text-xs font-bold text-gray-400 uppercase">Or use a video link</span>
                        <div className="flex-1 h-px bg-gray-100" />
                      </div>
                      <input
                        type="url"
                        placeholder="YouTube, Vimeo, or generic video link"
                        value={formData.contentUrl}
                        onChange={(e) => setFormData({ ...formData, contentUrl: e.target.value })}
                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading || (!formData.contentUrl && !formData.file)}
                  className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:bg-gray-300 flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Uploading Content...
                    </>
                  ) : (
                    "Publish Lesson 🚀"
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
