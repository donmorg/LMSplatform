"use client";

import { useState } from "react";
import { Calendar, ChevronDown, Check } from "lucide-react";

export default function TimeFilter() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("آخر 30 يوم");

  const options = ["اليوم", "آخر 7 أيام", "آخر 30 يوم", "الفصل الدراسي الحالي", "كل الأوقات"];

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="px-6 py-3 bg-white border border-gray-200 rounded-xl font-bold text-gray-700 flex items-center hover:bg-gray-50 transition-all shadow-sm"
      >
        <Calendar className="w-4 h-4 ml-2 text-indigo-500" />
        {selected}
        <ChevronDown className={`mr-3 w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-14 left-0 w-56 bg-white rounded-2xl shadow-2xl border border-gray-50 p-2 z-50 animate-in fade-in zoom-in-95 duration-200">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  setSelected(option);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  selected === option 
                    ? "bg-indigo-50 text-indigo-600" 
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {option}
                {selected === option && <Check className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
