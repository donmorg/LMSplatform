"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, ChevronRight, Loader2, Star, Timer, Trophy } from "lucide-react";
import Link from "next/link";
import confetti from "canvas-confetti";

export default function QuizTakerPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id: quizId } = use(params);


  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await fetch(`/api/quizzes/${quizId}`);
        if (!res.ok) throw new Error("Quiz not found");
        const data = await res.json();
        
        const parsedQuestions = JSON.parse(data.questions);
        setQuiz(data);
        setQuestions(parsedQuestions);
        if (data.timeLimit) setTimeLeft(data.timeLimit);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId]);

  const submitQuiz = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/quizzes/${quizId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      const data = await res.json();
      setResult(data);
      if (data.score >= 70) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#6366f1", "#f59e0b", "#10b981"]
        });
      }
    } catch (err) {
      setError("Failed to submit quiz");
    } finally {
      setSubmitting(false);
    }
  }, [quizId, answers, submitting]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || result) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          submitQuiz();
          return 0;
        }
        return prev ? prev - 1 : 0;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, result, submitQuiz]);

  const handleOptionSelect = (optionIndex: number) => {
    if (result) return;
    const currentQuestion = questions[currentQuestionIndex];
    setAnswers({ ...answers, [currentQuestion.id]: optionIndex });
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      submitQuiz();
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
        <p className="text-gray-500 font-bold">Getting your quiz ready...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4 p-8 text-center">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-[2rem] flex items-center justify-center mb-4">
          <Star className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-gray-900">Oops! Something went wrong.</h2>
        <p className="text-gray-500">{error}</p>
        <Link href="/student/lessons" className="text-indigo-600 font-bold hover:underline">Back to Lessons</Link>
      </div>
    );
  }

  if (result) {
    return (
      <div className="max-w-3xl mx-auto py-20 px-6 animate-in zoom-in-95 duration-500">
        <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl p-12 text-center">
          <div className="w-24 h-24 bg-amber-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 animate-bounce">
            <Trophy className="w-12 h-12 text-amber-500" />
          </div>
          <h2 className="text-4xl font-black text-gray-900 mb-2">Quiz Completed!</h2>
          <p className="text-gray-500 text-lg mb-10">You've done a great job. Let's see your results!</p>
          
          <div className="bg-indigo-50 rounded-[2.5rem] p-10 mb-10">
            <div className="text-6xl font-black text-indigo-600 mb-2">{result.score}%</div>
            <p className="font-bold text-indigo-900 uppercase tracking-widest text-sm">Your Total Score</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-10 text-left">
            <div className="bg-gray-50 p-6 rounded-2xl">
              <p className="text-xs font-bold text-gray-400 uppercase mb-1">Status</p>
              <p className={`font-black ${result.score >= 70 ? "text-green-600" : "text-amber-600"}`}>
                {result.score >= 70 ? "PASSED! 🌟" : "KEEP TRYING! 💪"}
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-2xl">
              <p className="text-xs font-bold text-gray-400 uppercase mb-1">Points Earned</p>
              <p className="font-black text-indigo-600">{Math.floor(result.score / 10)} Stars</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/student/lessons"
              className="flex-1 py-5 bg-indigo-600 text-white rounded-[2rem] font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all"
            >
              Back to Lessons
            </Link>
            <button 
              onClick={() => window.location.reload()}
              className="flex-1 py-5 bg-white border-2 border-gray-100 text-gray-700 rounded-[2rem] font-black hover:bg-gray-50 transition-all"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto py-10 px-6 space-y-10">
      <div className="flex items-center justify-between">
        <Link href={`/student/lessons/${quiz.lessonId}`} className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-indigo-600 transition-all">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div className="bg-white px-6 py-3 border border-gray-100 rounded-2xl flex items-center shadow-sm">
          <Timer className={`w-5 h-5 mr-3 ${timeLeft && timeLeft < 10 ? "text-red-500 animate-pulse" : "text-indigo-600"}`} />
          <span className="font-black text-gray-900">
            {timeLeft !== null ? `${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, "0")}` : "Unlimited"}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-4">
        <div className="flex justify-between text-sm font-black text-indigo-600 uppercase tracking-widest">
          <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <div className="w-full bg-white h-4 rounded-full p-1 border border-gray-100">
          <div 
            className="bg-indigo-500 h-full rounded-full transition-all duration-500 ease-out shadow-lg shadow-indigo-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-2xl shadow-indigo-500/5 animate-in slide-in-from-right-8 duration-500">
        <h2 className="text-3xl font-black text-gray-900 mb-12 text-center leading-tight">
          {currentQuestion.text}
        </h2>

        <div className="grid gap-6">
          {currentQuestion.options.map((option: string, index: number) => {
            const isSelected = answers[currentQuestion.id] === index;
            return (
              <button
                key={index}
                onClick={() => handleOptionSelect(index)}
                className={`p-6 rounded-[2rem] border-2 text-left flex items-center group transition-all transform active:scale-[0.98] ${
                  isSelected 
                    ? "border-indigo-600 bg-indigo-50 shadow-xl shadow-indigo-100" 
                    : "border-gray-50 bg-gray-50 hover:border-gray-200 hover:bg-white"
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mr-6 font-black text-xl transition-all ${
                  isSelected ? "bg-indigo-600 text-white" : "bg-white text-gray-400 group-hover:text-indigo-600"
                }`}>
                  {String.fromCharCode(65 + index)}
                </div>
                <span className={`text-xl font-bold transition-all ${isSelected ? "text-indigo-900" : "text-gray-700"}`}>
                  {option}
                </span>
                {isSelected && (
                  <CheckCircle2 className="w-8 h-8 ml-auto text-indigo-600 animate-in zoom-in-50 duration-300" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={nextQuestion}
          disabled={answers[currentQuestion.id] === undefined || submitting}
          className="px-10 py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center group disabled:bg-gray-200 disabled:shadow-none"
        >
          {submitting ? (
            <>
              <Loader2 className="w-6 h-6 mr-3 animate-spin" />
              Checking...
            </>
          ) : (
            <>
              {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Finish Quiz"}
              <ChevronRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
