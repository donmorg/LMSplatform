"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { HeartPulse, CheckCircle } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { mentalHealthQuestions } from "@/lib/mentalHealthQuestions";

export default function MentalHealthResultsPage() {
  const searchParams = useSearchParams();
  const scoreParam = searchParams.get("score");
  const score = scoreParam ? parseInt(scoreParam, 10) : 0;
  const { t } = useLanguage();

  const maxScore = mentalHealthQuestions.length * 3;
  const percentage = Math.round((score / maxScore) * 100);

  let messageKey = "mentalHealth.results.messageOk";
  if (percentage >= 80) {
    messageKey = "mentalHealth.results.messagePositive";
  } else if (percentage <= 40) {
    messageKey = "mentalHealth.results.messageNeedsSupport";
  }

  return (
    <div className="max-w-3xl mx-auto mt-12">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 relative">
          <CheckCircle className="w-12 h-12 text-green-600 relative z-10" />
        </div>
        
        <h1 className="text-4xl font-black text-gray-900 mb-8">{t("mentalHealth.results.title")}</h1>

        <div className="bg-gray-50 rounded-2xl p-6 mb-10 max-w-xl mx-auto border border-gray-100">
          <p className="text-xl text-indigo-600 leading-relaxed font-bold">
            Thank you, your answers have been sent.
          </p>
        </div>

        <Link
          href="/student/dashboard"
          className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-10 rounded-2xl transition-all shadow-lg shadow-indigo-200"
        >
          {t("mentalHealth.results.backToDashboard")}
        </Link>
      </div>
    </div>
  );
}
