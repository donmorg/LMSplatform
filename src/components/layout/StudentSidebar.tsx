"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Star, Trophy, Settings, LogOut, HeartPulse } from "lucide-react";
import { signOut } from "next-auth/react";
import { useLanguage } from "@/lib/LanguageContext";

export default function StudentSidebar() {
  const pathname = usePathname();
  const { t, dir } = useLanguage();

  const links = [
    { name: t("sidebar.dashboard"), href: "/student/dashboard", icon: Home },
    { name: t("sidebar.lessons"), href: "/student/lessons", icon: BookOpen },
    { name: t("sidebar.quizzes"), href: "/student/quizzes", icon: Star },
    { name: t("sidebar.results"), href: "/student/results", icon: Trophy },
    { name: t("sidebar.mentalHealthTest"), href: "/student/mental-health", icon: HeartPulse },
  ];

  return (
    <div className={`w-72 bg-white border-e border-gray-100 flex flex-col h-screen fixed top-0 z-50 ${dir === "rtl" ? "right-0" : "left-0"}`}>
      <div className="p-8">
        <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className="relative w-10 h-10 flex items-center justify-center">
            <img src="/logo.png" alt="ATHAR Logo" className="w-full h-full object-contain" />
          </div>
          <span className="text-xl font-black tracking-tight text-gray-900">{language === "ar" ? "أثار" : "ATHAR"}</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          // Exact match for dashboard to avoid active state on other routes starting with /student/dashboard
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center space-x-3 rtl:space-x-reverse px-4 py-4 rounded-2xl font-bold transition-all ${
                isActive
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon className={`w-6 h-6 shrink-0 ${isActive ? "text-indigo-600" : "text-gray-400"}`} />
              <span className="truncate">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <div className="p-6 bg-indigo-600 rounded-3xl text-white relative overflow-hidden group mb-4">
          <div className="relative z-10">
            <p className="text-xs font-bold text-indigo-200 uppercase tracking-widest mb-1">Weekly Goal</p>
            <p className="text-xl font-black mb-4">3/5 Lessons Done</p>
            <div className="w-full bg-indigo-500 h-2 rounded-full overflow-hidden">
              <div className="bg-white h-full w-[60%] rounded-full" />
            </div>
          </div>
          <Star className="absolute -bottom-4 -right-4 w-24 h-24 text-indigo-500 opacity-20 group-hover:scale-110 transition-transform rtl:-left-4 rtl:right-auto" />
        </div>

        <button
          onClick={() => signOut()}
          className="w-full flex items-center space-x-3 rtl:space-x-reverse px-4 py-4 rounded-2xl font-bold text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all"
        >
          <LogOut className="w-6 h-6 shrink-0" />
          <span>{t("topbar.logout")}</span>
        </button>
      </div>
    </div>
  );
}
