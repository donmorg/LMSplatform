"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Star, Trophy, Settings, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

const links = [
  { name: "Dashboard", href: "/student/dashboard", icon: Home },
  { name: "My Lessons", href: "/student/lessons", icon: BookOpen },
  { name: "Quizzes", href: "/student/quizzes", icon: Star },
  { name: "My Results", href: "/student/results", icon: Trophy },
];

export default function StudentSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-72 bg-white border-r border-gray-100 flex flex-col h-screen fixed left-0 top-0 z-50">
      <div className="p-8">
        <Link href="/" className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
            L
          </div>
          <span className="text-xl font-black tracking-tight text-gray-900">EduPlay</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center space-x-3 px-4 py-4 rounded-2xl font-bold transition-all ${
                isActive
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? "text-indigo-600" : "text-gray-400"}`} />
              <span>{link.name}</span>
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
          <Star className="absolute -bottom-4 -right-4 w-24 h-24 text-indigo-500 opacity-20 group-hover:scale-110 transition-transform" />
        </div>

        <button
          onClick={() => signOut()}
          className="w-full flex items-center space-x-3 px-4 py-4 rounded-2xl font-bold text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all"
        >
          <LogOut className="w-6 h-6" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
