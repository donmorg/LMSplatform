"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/LanguageContext";
import { mentalHealthQuestions } from "@/lib/mentalHealthQuestions";
import { ChevronRight, ChevronLeft } from "lucide-react";

export default function MentalHealthTestPage() {
  const { t, dir } = useLanguage();
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleOptionChange = (questionIndex: number, score: number) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: score }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/student/mental-health", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      if (res.ok) {
        const data = await res.json();
        router.push(`/student/mental-health/results?score=${data.score}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const isComplete = Object.keys(answers).length === mentalHealthQuestions.length;

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 mb-2">{t("mentalHealth.title")}</h1>
        <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
          <div 
            className="bg-indigo-600 h-full transition-all duration-300"
            style={{ width: `${(Object.keys(answers).length / mentalHealthQuestions.length) * 100}%` }}
          />
        </div>
        <p className="text-sm font-bold text-gray-500 mt-2 text-right rtl:text-left">
          {Object.keys(answers).length} / {mentalHealthQuestions.length}
        </p>
      </div>

      <div className="space-y-6">
        {mentalHealthQuestions.map((question, index) => (
          <div key={index} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              {index + 1}. {question}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: t("mentalHealth.options.applies"), score: 2, id: "applies" },
                { label: t("mentalHealth.options.sometimes"), score: 1, id: "sometimes" },
                { label: t("mentalHealth.options.doesNotApply"), score: 0, id: "no" }
              ].map((opt) => {
                const isSelected = answers[index] === opt.score;
                return (
                  <label 
                    key={opt.id}
                    className={`flex items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected 
                        ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-md" 
                        : "border-gray-100 text-gray-600 hover:border-indigo-200 hover:bg-gray-50"
                    }`}
                  >
                    <input 
                      type="radio" 
                      name={`question-${index}`} 
                      value={opt.score}
                      checked={isSelected}
                      onChange={() => handleOptionChange(index, opt.score)}
                      className="sr-only"
                    />
                    <span className="font-bold text-lg">{opt.label}</span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={!isComplete || submitting}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-10 rounded-2xl transition-all shadow-lg shadow-indigo-200 flex items-center space-x-2 rtl:space-x-reverse"
        >
          <span>{submitting ? t("common.loading") : t("mentalHealth.submitTest")}</span>
          {dir === "ltr" ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}
