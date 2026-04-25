import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PieChart, TrendingUp, Users, BookOpen, Star, Trophy, Calendar, Filter, Download } from "lucide-react";
import TimeFilter from "@/components/analytics/TimeFilter";
import ExportButton from "@/components/analytics/ExportButton";

export default async function TeacherAnalyticsPage() {
  const session = await auth();
  
  // Basic stats aggregation
  const studentsCount = await prisma.user.count({ where: { role: "STUDENT" } });
  const lessonsCount = await prisma.lesson.count();
  const quizzesCount = await prisma.quiz.count();
  const submissionsCount = await prisma.submission.count();

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Detailed Analytics</h1>
          <p className="text-gray-500 mt-1">Deep dive into classroom performance and engagement metrics.</p>
        </div>
        <div className="flex gap-4">
          <TimeFilter />
          <ExportButton />
        </div>
      </div>



      {/* High Level Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Active Students", value: studentsCount, icon: Users, color: "bg-blue-500", trend: "+12%" },
          { label: "Total Lessons", value: lessonsCount, icon: BookOpen, color: "bg-indigo-500", trend: "+5%" },
          { label: "Quiz Completions", value: submissionsCount, icon: Star, color: "bg-amber-500", trend: "+18%" },
          { label: "Avg. Engagement", value: "84%", icon: TrendingUp, color: "bg-green-500", trend: "+2%" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
            <div className="relative z-10">
              <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-gray-100`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <p className="text-sm font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <div className="flex items-end justify-between">
                <h3 className="text-3xl font-black text-gray-900">{stat.value}</h3>
                <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-lg">{stat.trend}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Performance Chart Placeholder */}
        <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-xl font-black text-gray-900">Performance Over Time</h3>
            <div className="flex space-x-2">
              <div className="flex items-center text-xs font-bold text-gray-400">
                <div className="w-3 h-3 bg-indigo-500 rounded-full mr-2" />
                Quizzes
              </div>
              <div className="flex items-center text-xs font-bold text-gray-400">
                <div className="w-3 h-3 bg-blue-400 rounded-full mr-2" />
                Tests
              </div>
            </div>
          </div>
          
          <div className="h-64 flex items-end justify-between px-4">
            {[40, 65, 45, 90, 55, 80, 60, 95, 70, 85, 50, 75].map((h, i) => (
              <div key={i} className="w-8 bg-indigo-50 rounded-t-xl relative group cursor-pointer hover:bg-indigo-100 transition-all" style={{ height: `${h}%` }}>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {h}%
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-6 text-xs font-bold text-gray-300 uppercase tracking-widest px-2">
            <span>Jan</span>
            <span>Mar</span>
            <span>May</span>
            <span>Jul</span>
            <span>Sep</span>
            <span>Nov</span>
          </div>
        </div>

        {/* Top Performing Students */}
        <div className="bg-gray-900 p-10 rounded-[3rem] text-white">
          <h3 className="text-xl font-bold mb-8">Top Learners 🚀</h3>
          <div className="space-y-6">
            {[
              { name: "Ahmed", score: "98%", color: "bg-pink-500" },
              { name: "Yasmine", score: "95%", color: "bg-blue-500" },
              { name: "Omar", score: "92%", color: "bg-amber-500" },
              { name: "Lina", score: "89%", color: "bg-indigo-500" },
            ].map((student, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 ${student.color} rounded-xl flex items-center justify-center font-bold`}>
                    {student.name.charAt(0)}
                  </div>
                  <span className="font-bold text-gray-300">{student.name}</span>
                </div>
                <span className="text-indigo-400 font-black">{student.score}</span>
              </div>
            ))}
          </div>
          <button className="w-full mt-10 py-4 bg-gray-800 hover:bg-gray-700 rounded-2xl font-bold transition-all text-sm text-gray-400">
            View Leaderboard
          </button>
        </div>
      </div>
    </div>
  );
}
