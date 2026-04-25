"use client";

import { useState } from "react";
import { Download, Loader2, CheckCircle } from "lucide-react";

export default function ExportButton() {
  const [isExporting, setIsExporting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    
    // Simulate a data gathering and file generation process
    setTimeout(() => {
      // Create a dummy CSV content
      const csvContent = "data:text/csv;charset=utf-8,Student,Score,Lesson,Date\nAhmed,98%,Solar System,2026-04-25\nYasmine,95%,Ocean Animals,2026-04-24\nOmar,92%,Math Basics,2026-04-23";
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "classroom_report.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsExporting(false);
      setIsDone(true);
      
      // Reset after 3 seconds
      setTimeout(() => setIsDone(false), 3000);
    }, 1500);
  };

  return (
    <button 
      onClick={handleExport}
      disabled={isExporting}
      className={`px-6 py-3 rounded-xl font-bold shadow-lg transition-all flex items-center min-w-[160px] justify-center ${
        isDone 
          ? "bg-green-500 text-white" 
          : "bg-gray-900 text-white hover:bg-black active:scale-95"
      }`}
    >
      {isExporting ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Preparing...
        </>
      ) : isDone ? (
        <>
          <CheckCircle className="w-4 h-4 mr-2" />
          Downloaded!
        </>
      ) : (
        <>
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </>
      )}
    </button>
  );
}
