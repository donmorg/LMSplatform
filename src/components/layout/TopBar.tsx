"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Bell, Search, X, CheckCircle, Info, Star } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

export default function TopBar() {
  const { data: session } = useSession();
  const [showNotifications, setShowNotifications] = useState(false);
  const { t } = useLanguage();

  const notifications = [
    { id: 1, title: "جلسة جديدة!", message: "تمت إضافة جلسة إرشادية جديدة.", icon: Info, color: "text-blue-500", time: "منذ دقيقتين" },
    { id: 2, title: "اجتزت الاختبار!", message: "حصلت على 90% في الاختبار النفسي.", icon: CheckCircle, color: "text-green-500", time: "منذ ساعة" },
    { id: 3, title: "إنجاز جديد!", message: "حصلت على وسام المتعلم السريع.", icon: Star, color: "text-amber-500", time: "منذ 3 ساعات" },
  ];

  const isTeacher = (session?.user as any)?.role === "TEACHER";
  const roleLabel = isTeacher ? "اخصائي نفسي" : "تلميذ";

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-40">
      <div className="flex items-center bg-gray-50 px-4 py-2 rounded-2xl w-96">
        <Search className="w-5 h-5 text-gray-400 ml-2" />
        <input
          type="text"
          placeholder="البحث عن جلسات إرشادية..."
          className="bg-transparent border-none outline-none text-sm w-full font-medium text-right"
          dir="rtl"
        />
      </div>

      <div className="flex items-center space-x-6 space-x-reverse relative">
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className={`relative p-2 transition-colors rounded-xl ${showNotifications ? "bg-indigo-50 text-indigo-600" : "text-gray-400 hover:text-gray-600"}`}
        >
          <Bell className="w-6 h-6" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </button>

        {/* Notifications Dropdown */}
        {showNotifications && (
          <div className="absolute top-16 left-0 w-80 bg-white rounded-[2rem] shadow-2xl border border-gray-50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300 z-50" dir="rtl">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
              <h3 className="font-black text-gray-900">الإشعارات</h3>
              <button onClick={() => setShowNotifications(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.map((n) => (
                <div key={n.id} className="p-5 hover:bg-gray-50 transition-colors border-b border-gray-50 cursor-pointer group">
                  <div className="flex items-start space-x-4 space-x-reverse">
                    <div className={`w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center ${n.color} group-hover:scale-110 transition-transform`}>
                      <n.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-900 mb-0.5">{n.title}</p>
                      <p className="text-xs text-gray-500 leading-relaxed">{n.message}</p>
                      <p className="text-[10px] font-bold text-indigo-400 mt-2 uppercase tracking-widest">{n.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 text-center">
              <button className="text-xs font-black text-indigo-600 hover:underline">تحديد الكل كمقروء</button>
            </div>
          </div>
        )}

        <Link
          href={isTeacher ? "/teacher/dashboard" : "/student/profile"}
          className="flex items-center space-x-3 space-x-reverse pr-6 border-r border-gray-100 hover:opacity-80 transition-opacity"
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-100 overflow-hidden"
            style={{ backgroundColor: (session?.user as any)?.avatarColor || "#7c3aed" }}
          >
            {session?.user?.name?.charAt(0) || "م"}
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-sm font-bold text-gray-900">{session?.user?.name || "المستخدم"}</p>
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
              {roleLabel}
            </p>
          </div>
        </Link>
      </div>
    </header>
  );
}
