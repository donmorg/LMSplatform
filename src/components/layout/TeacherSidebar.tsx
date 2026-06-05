"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, Star, Users, PieChart, LogOut, PlusCircle, HeartPulse } from "lucide-react";
import { signOut } from "next-auth/react";
import { useLanguage } from "@/lib/LanguageContext";

export default function TeacherSidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const links = [
    { name: t("sidebar.dashboard"), href: "/teacher/dashboard", icon: LayoutDashboard },
    { name: t("sidebar.lessons"), href: "/teacher/lessons", icon: BookOpen },
    { name: t("sidebar.quizzes"), href: "/teacher/quizzes", icon: Star },
    { name: t("sidebar.students"), href: "/teacher/students", icon: Users },
    { name: t("sidebar.mentalHealthTest"), href: "/teacher/students-health", icon: HeartPulse },
    { name: t("sidebar.analytics"), href: "/teacher/analytics", icon: PieChart },
  ];

  return (
    <div className="w-72 bg-gray-900 flex flex-col h-screen fixed top-0 right-0 z-50 border-l border-gray-800">
      <div className="p-8 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3 space-x-reverse">
          <div className="relative w-10 h-10 flex items-center justify-center bg-white rounded-xl p-1">
            <img src="/logo.jpg" alt="أثر" className="w-full h-full object-contain" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">أثر</span>
        </Link>
      </div>

      <div className="px-4 mb-8">
        <Link
          href="/teacher/lessons/new"
          className="w-full py-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center transition-all shadow-lg shadow-indigo-900/20"
        >
          <PlusCircle className="w-5 h-5 ml-2" />
          {t("common.create")}
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center space-x-3 space-x-reverse px-4 py-4 rounded-xl font-medium transition-all ${
                isActive
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
              }`}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-indigo-400" : "text-gray-500"}`} />
              <span className="truncate">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-gray-800">
        <button
          onClick={() => signOut()}
          className="w-full flex items-center space-x-3 space-x-reverse px-4 py-3 rounded-xl font-medium text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <span>{t("topbar.logout")}</span>
        </button>
      </div>
    </div>
  );
}
