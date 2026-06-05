"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

interface Teacher {
  id: string;
  fullName: string;
  avatarColor: string;
}

interface TeacherSelectionModalProps {
  teachers: Teacher[];
  studentId: string;
}

export default function TeacherSelectionModal({ teachers, studentId }: TeacherSelectionModalProps) {
  const [open, setOpen] = useState(true);
  const router = useRouter();

  const handleSelect = async (teacherId: string) => {
    setOpen(false);
    try {
      await fetch("/api/student/teacher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teacherId }),
      });
      // reload page to reflect assignment
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="relative z-50">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
      {/* Centered panel */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl">
          <Lock className="w-12 h-12 mx-auto text-indigo-600 mb-4" />
          <h2 className="text-2xl font-black mb-2">{"{{t('teacherSelection.title')}}"}</h2>
          <p className="text-gray-600 mb-6">{"{{t('teacherSelection.subtitle')}}"}</p>
          {teachers.length === 0 ? (
            <p>{"{{t('teacherSelection.noTeachers')}}"}</p>
          ) : (
            <ul className="space-y-4">
              {teachers.map((teacher) => (
                <li key={teacher.id} className="flex items-center justify-between p-3 border rounded-[2rem] hover:bg-gray-50 cursor-pointer" onClick={() => handleSelect(teacher.id)}>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full" style={{ backgroundColor: teacher.avatarColor }} />
                    <span className="font-medium text-gray-800">{teacher.fullName}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
