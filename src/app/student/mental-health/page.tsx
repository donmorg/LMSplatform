"use client";

import Link from "next/link";
import { HeartPulse } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function MentalHealthIntroPage() {
  const { t } = useLanguage();

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 text-center mt-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-8 relative">
          <HeartPulse className="w-12 h-12 text-indigo-600 relative z-10" />
          <div className="absolute inset-0 bg-indigo-200 rounded-full animate-ping opacity-20" />
        </div>
        
        <h1 className="text-4xl font-black text-gray-900 mb-4">{t("mentalHealth.title")}</h1>
        <p className="text-xl text-gray-500 mb-10 max-w-xl mx-auto leading-relaxed">
          {t("mentalHealth.subtitle")}
        </p>

        <Link
          href="/student/mental-health/test"
          className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-bold py-5 px-12 rounded-2xl transition-all shadow-xl shadow-indigo-200 hover:shadow-2xl hover:shadow-indigo-200 hover:-translate-y-1"
        >
          {t("mentalHealth.performTest")}
        </Link>
      </div>
    </div>
  );
}
