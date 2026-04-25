"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Trash2, ArrowLeft, Loader2, Star, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
}

function QuizBuilderForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lessonIdFromUrl = searchParams.get("lessonId");

  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingLessons, setFetchingLessons] = useState(true);
  const [error, setError] = useState("");

  const [quizData, setQuizData] = useState({
    title: "",
    lessonId: lessonIdFromUrl || "",
    timeLimit: 0,
    questions: [
      { id: "q1", text: "", options: ["", "", "", ""], correctIndex: 0 }
    ] as Question[]
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

  const addQuestion = () => {
    setQuizData({
      ...quizData,
      questions: [
        ...quizData.questions,
        { id: `q${quizData.questions.length + 1}`, text: "", options: ["", "", "", ""], correctIndex: 0 }
      ]
    });
  };

  const removeQuestion = (index: number) => {
    const newQuestions = quizData.questions.filter((_, i) => i !== index);
    setQuizData({ ...quizData, questions: newQuestions });
  };

  const updateQuestionText = (index: number, text: string) => {
    const newQuestions = [...quizData.questions];
    newQuestions[index].text = text;
    setQuizData({ ...quizData, questions: newQuestions });
  };

  const updateOptionText = (qIndex: number, oIndex: number, text: string) => {
    const newQuestions = [...quizData.questions];
    newQuestions[qIndex].options[oIndex] = text;
    setQuizData({ ...quizData, questions: newQuestions });
  };

  const setCorrectAnswer = (qIndex: number, oIndex: number) => {
    const newQuestions = [...quizData.questions];
    newQuestions[qIndex].correctIndex = oIndex;
    setQuizData({ ...quizData, questions: newQuestions });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!quizData.lessonId) {
      setError("Please select a lesson for this quiz");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: quizData.title,
          lessonId: quizData.lessonId,
          timeLimit: quizData.timeLimit || null,
          questions: quizData.questions
        }),
      });

      if (!res.ok) throw new Error("Failed to create quiz");

      router.push("/teacher/quizzes");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <Link href="/teacher/quizzes" className="inline-flex items-center text-gray-500 hover:text-indigo-600 font-bold transition-colors">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Quizzes
      </Link>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900">Quiz Builder 🎨</h1>
          <p className="text-gray-500 mt-2">Design a fun and challenging quiz for your students.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-indigo-500/5 space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="block text-sm font-black text-gray-700 uppercase tracking-widest">Quiz Title</label>
              <input
                type="text"
                placeholder="e.g. Solar System Fun Quiz!"
                required
                value={quizData.title}
                onChange={(e) => setQuizData({ ...quizData, title: e.target.value })}
                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold"
              />
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-black text-gray-700 uppercase tracking-widest">Linked Lesson</label>
              <select
                required
                value={quizData.lessonId}
                onChange={(e) => setQuizData({ ...quizData, lessonId: e.target.value })}
                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold"
              >
                <option value="">Select a lesson...</option>
                {lessons.map((lesson) => (
                  <option key={lesson.id} value={lesson.id}>{lesson.title}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-4">
            <label className="block text-sm font-black text-gray-700 uppercase tracking-widest">Time Limit (Seconds - 0 for unlimited)</label>
            <input
              type="number"
              value={quizData.timeLimit}
              onChange={(e) => setQuizData({ ...quizData, timeLimit: parseInt(e.target.value) })}
              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold"
            />
          </div>
        </div>

        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-gray-900">Questions ({quizData.questions.length})</h2>
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
            {quizData.questions.map((question, qIndex) => (
              <div key={question.id} className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm relative animate-in slide-in-from-bottom-4 duration-500">
                <div className="absolute top-8 right-8">
                  <button
                    type="button"
                    onClick={() => removeQuestion(qIndex)}
                    disabled={quizData.questions.length === 1}
                    className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all disabled:opacity-0"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-8">
                  <div className="space-y-4">
                    <label className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em]">Question {qIndex + 1}</label>
                    <input
                      type="text"
                      placeholder="What is the closest planet to the Sun?"
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
                            ? "border-green-500 bg-green-50/50" 
                            : "border-gray-50 bg-gray-50 hover:border-gray-200"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => setCorrectAnswer(qIndex, oIndex)}
                          className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                            question.correctIndex === oIndex ? "bg-green-500 text-white" : "bg-white border-2 border-gray-200"
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
                          className="flex-1 bg-transparent border-none outline-none font-bold text-gray-700 placeholder:text-gray-300"
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
            className="w-full py-6 bg-indigo-600 text-white rounded-[2.5rem] font-black text-xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center transform active:scale-[0.98]"
          >
            {loading ? (
              <>
                <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                Saving Quiz...
              </>
            ) : (
              <>
                <Star className="w-6 h-6 mr-3 fill-white" />
                Create Quiz Now!
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function NewQuizPage() {
  return (
    <Suspense fallback={
      <div className="max-w-5xl mx-auto p-20 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
        <p className="text-gray-500 font-bold text-xl text-center">Opening Quiz Builder...</p>
      </div>
    }>
      <QuizBuilderForm />
    </Suspense>
  );
}
