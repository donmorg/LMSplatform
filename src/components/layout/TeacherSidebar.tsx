"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, Star, Users, PieChart, Settings, LogOut, PlusCircle } from "lucide-react";
import { signOut } from "next-auth/react";

const links = [
  { name: "Overview", href: "/teacher/dashboard", icon: LayoutDashboard },
  { name: "Manage Lessons", href: "/teacher/lessons", icon: BookOpen },
  { name: "Quizzes & Tests", href: "/teacher/quizzes", icon: Star },
  { name: "Student Roster", href: "/teacher/students", icon: Users },
  { name: "Detailed Analytics", href: "/teacher/analytics", icon: PieChart },
];

export default function TeacherSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-72 bg-gray-900 flex flex-col h-screen fixed left-0 top-0 z-50 border-r border-gray-800">
      <div className="p-8 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white font-bold text-xl">
            L
          </div>
          <span className="text-xl font-bold tracking-tight text-white">LMS Pro</span>
        </Link>
      </div>

      <div className="px-4 mb-8">
        <Link 
          href="/teacher/lessons/new"
          className="w-full py-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center transition-all shadow-lg shadow-indigo-900/20"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Create New
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
              className={`flex items-center space-x-3 px-4 py-4 rounded-xl font-medium transition-all ${
                isActive
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-indigo-400" : "text-gray-500"}`} />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-gray-800">
        <button
          onClick={() => signOut()}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
