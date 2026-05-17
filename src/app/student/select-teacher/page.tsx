"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { User, CheckCircle, GraduationCap } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

interface Teacher {
  id: string;
  fullName: string;
  avatarColor: string;
}

export default function SelectTeacherPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const { data: session, update } = useSession();
  const { t } = useLanguage();

  useEffect(() => {
    fetch("/api/student/teacher")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTeachers(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleSelect = async () => {
    if (!selectedTeacherId) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/student/teacher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teacherId: selectedTeacherId }),
      });

      if (res.ok) {
        // Update session (mocking teacher assignment)
        await update({ name: session?.user?.name });
        // Force a hard refresh so the middleware sees the updated session cookie
        window.location.href = "/student/dashboard";
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <GraduationCap className="w-10 h-10 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">{t("teacherSelection.title")}</h1>
          <p className="text-gray-500">{t("teacherSelection.subtitle")}</p>
        </div>

        {teachers.length === 0 ? (
          <div className="text-center p-8 bg-gray-50 rounded-2xl border border-gray-100">
            <p className="text-gray-500 font-medium">{t("teacherSelection.noTeachers")}</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 mb-8">
            {teachers.map((teacher) => (
              <div
                key={teacher.id}
                onClick={() => setSelectedTeacherId(teacher.id)}
                className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                  selectedTeacherId === teacher.id
                    ? "border-indigo-600 bg-indigo-50 shadow-md shadow-indigo-100"
                    : "border-gray-100 hover:border-indigo-200 hover:bg-gray-50"
                }`}
              >
                {selectedTeacherId === teacher.id && (
                  <div className="absolute top-4 right-4 rtl:left-4 rtl:right-auto text-indigo-600">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                )}
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-sm"
                    style={{ backgroundColor: teacher.avatarColor || "#7c3aed" }}
                  >
                    {teacher.fullName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{teacher.fullName}</h3>
                    <p className="text-sm text-gray-500">Psychologist</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={handleSelect}
          disabled={!selectedTeacherId || submitting}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-lg shadow-indigo-200"
        >
          {submitting ? t("teacherSelection.selecting") : t("teacherSelection.confirmSelection")}
        </button>
      </div>
    </div>
  );
}
