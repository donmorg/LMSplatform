"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, ArrowLeft, Loader2, Award, CheckCircle2, BookOpen } from "lucide-react";
import Link from "next/link";

export default function NewTestPage() {
  const router = useRouter();
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingLessons, setFetchingLessons] = useState(true);
  const [error, setError] = useState("");

  const [testData, setTestData] = useState({
    title: "",
    description: "",
    selectedLessonIds: [] as string[],
    questions: [
      { id: "tq1", text: "", options: ["", "", "", ""], correctIndex: 0 }
    ]
  });

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await fetch("/api/lessons");
        const data = await res.json();
        setLessons(data);
      } catch (err) {
        console.error("Failed to fetch lessons");
      } finally {
        setFetchingLessons(false);
      }
    };
    fetchLessons();
  }, []);

  const toggleLesson = (id: string) => {
    const newSelection = testData.selectedLessonIds.includes(id)
      ? testData.selectedLessonIds.filter(lid => lid !== id)
      : [...testData.selectedLessonIds, id];
    setTestData({ ...testData, selectedLessonIds: newSelection });
  };

  const addQuestion = () => {
    setTestData({
      ...testData,
      questions: [
        ...testData.questions,
        { id: `tq${testData.questions.length + 1}`, text: "", options: ["", "", "", ""], correctIndex: 0 }
      ]
    });
  };

  const removeQuestion = (index: number) => {
    const newQuestions = testData.questions.filter((_, i) => i !== index);
    setTestData({ ...testData, questions: newQuestions });
  };

  const updateQuestionText = (index: number, text: string) => {
    const newQuestions = [...testData.questions];
    newQuestions[index].text = text;
    setTestData({ ...testData, questions: newQuestions });
  };

  const updateOptionText = (qIndex: number, oIndex: number, text: string) => {
    const newQuestions = [...testData.questions];
    newQuestions[qIndex].options[oIndex] = text;
    setTestData({ ...testData, questions: newQuestions });
  };

  const setCorrectAnswer = (qIndex: number, oIndex: number) => {
    const newQuestions = [...testData.questions];
    newQuestions[qIndex].correctIndex = oIndex;
    setTestData({ ...testData, questions: newQuestions });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (testData.selectedLessonIds.length === 0) {
      setError("Please select at least one lesson for this program test");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: testData.title,
          description: testData.description,
          lessonIds: testData.selectedLessonIds,
          questions: testData.questions
        }),
      });

      if (!res.ok) throw new Error("Failed to create program test");

      router.push("/teacher/quizzes"); // Navigate to same management area
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      <Link href="/teacher/quizzes" className="inline-flex items-center text-gray-500 hover:text-indigo-600 font-bold transition-colors">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Management
      </Link>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900">Program Test Builder 🏆</h1>
          <p className="text-gray-500 mt-2">Create a comprehensive exam covering multiple lessons.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Basic Info */}
        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-indigo-500/5 space-y-8">
          <div className="space-y-4">
            <label className="block text-sm font-black text-gray-700 uppercase tracking-widest">Test Title</label>
            <input
              type="text"
              placeholder="e.g. End of Term Science Exam"
              required
              value={testData.title}
              onChange={(e) => setTestData({ ...testData, title: e.target.value })}
              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold"
            />
          </div>
          <div className="space-y-4">
            <label className="block text-sm font-black text-gray-700 uppercase tracking-widest">Description</label>
            <textarea
              placeholder="What topics does this test cover?"
              rows={3}
              value={testData.description}
              onChange={(e) => setTestData({ ...testData, description: e.target.value })}
              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium resize-none"
            />
          </div>
        </div>

        {/* Lesson Selection */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-gray-900 flex items-center">
            <BookOpen className="w-6 h-6 mr-3 text-indigo-600" />
            Select Included Lessons
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lessons.map((lesson) => {
              const isSelected = testData.selectedLessonIds.includes(lesson.id);
              return (
                <button
                  key={lesson.id}
                  type="button"
                  onClick={() => toggleLesson(lesson.id)}
                  className={`p-6 rounded-[2rem] border-2 text-left transition-all ${
                    isSelected 
                      ? "border-indigo-600 bg-indigo-50/50" 
                      : "border-gray-50 bg-white hover:border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      lesson.type === "VIDEO" ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-500"
                    }`}>
                      <BookOpen className="w-4 h-4" />
                    </div>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-indigo-600" />}
                  </div>
                  <h3 className="font-bold text-gray-900 leading-tight">{lesson.title}</h3>
                </button>
              );
            })}
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-gray-900">Test Questions ({testData.questions.length})</h2>
            <button
              type="button"
              onClick={addQuestion}
              className="px-6 py-3 bg-indigo-50 text-indigo-600 rounded-xl font-black hover:bg-indigo-100 transition-all flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Question
            </button>
          </div>

          <div className="space-y-8">
            {testData.questions.map((question, qIndex) => (
              <div key={question.id} className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm relative animate-in slide-in-from-bottom-4 duration-500">
                <div className="absolute top-8 right-8">
                  <button
                    type="button"
                    onClick={() => removeQuestion(qIndex)}
                    disabled={testData.questions.length === 1}
                    className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all disabled:opacity-0"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-8">
                  <div className="space-y-4">
                    <label className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em]">Exam Question {qIndex + 1}</label>
                    <input
                      type="text"
                      placeholder="Enter your comprehensive question here..."
                      required
                      value={question.text}
                      onChange={(e) => updateQuestionText(qIndex, e.target.value)}
                      className="w-full text-xl font-bold bg-transparent border-b-2 border-gray-100 focus:border-indigo-600 outline-none pb-4 transition-all"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {question.options.map((option, oIndex) => (
                      <div 
                        key={oIndex}
                        className={`group p-4 rounded-2xl border-2 flex items-center space-x-3 transition-all ${
                          question.correctIndex === oIndex 
                            ? "border-indigo-500 bg-indigo-50/50" 
                            : "border-gray-50 bg-gray-50 hover:border-gray-200"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => setCorrectAnswer(qIndex, oIndex)}
                          className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                            question.correctIndex === oIndex ? "bg-indigo-500 text-white" : "bg-white border-2 border-gray-200"
                          }`}
                        >
                          {question.correctIndex === oIndex && <CheckCircle2 className="w-4 h-4" />}
                        </button>
                        <input
                          type="text"
                          placeholder={`Option ${oIndex + 1}`}
                          required
                          value={option}
                          onChange={(e) => updateOptionText(qIndex, oIndex, e.target.value)}
                          className="flex-1 bg-transparent border-none outline-none font-bold text-gray-700"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-6 bg-red-50 text-red-700 font-bold rounded-[2rem] border border-red-100 text-center">
            {error}
          </div>
        )}

        <div className="pt-8">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-6 bg-gray-900 text-white rounded-[2.5rem] font-black text-xl shadow-xl hover:bg-black transition-all flex items-center justify-center transform active:scale-[0.98]"
          >
            {loading ? (
              <>
                <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                Publishing Exam...
              </>
            ) : (
              <>
                <Award className="w-6 h-6 mr-3 text-amber-400" />
                Publish Program Test 🚀
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
