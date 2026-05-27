"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { translations, Language, TranslationKey } from "./dictionaries";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
  dir: "ltr" | "rtl";
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.documentElement.lang = "ar";
    document.documentElement.dir = "rtl";
  }, []);

  const language: Language = "ar";
  const dir: "rtl" = "rtl";

  const setLanguage = (_lang: Language) => {
    // Arabic only — no language switching
  };

  const t = (key: TranslationKey): string => {
    const keys = key.split(".");
    let current: any = translations["ar"];
    for (const k of keys) {
      if (current[k] === undefined) {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
      current = current[k];
    }
    return current;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      <div dir="rtl" className="w-full h-full min-h-screen text-right">
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
