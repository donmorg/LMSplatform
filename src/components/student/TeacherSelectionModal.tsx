import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogOverlay, DialogPanel } from "@headlessui/react";
import { LockClosedIcon } from "lucide-react";

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

  return (
    <Dialog open={open} onClose={() => {}} className="relative z-50">
      <DialogOverlay className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl">
          <LockClosedIcon className="w-12 h-12 mx-auto text-indigo-600 mb-4" />
          <h2 className="text-2xl font-black mb-2">{"{{t('teacherSelection.title')}}"}</h2>
          <p className="text-gray-600 mb-6">{"{{t('teacherSelection.subtitle')}}"}</p>
          {teachers.length === 0 ? (
            <p>{"{{t('teacherSelection.noTeachers')}}"}</p>
          ) : (
            <ul className="space-y-4">
              {teachers.map((t) => (
                <li key={t.id} className="flex items-center justify-between p-3 border rounded-[2rem] hover:bg-gray-50 cursor-pointer" onClick={() => handleSelect(t.id)}>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full" style={{ backgroundColor: t.avatarColor }} />
                    <span className="font-medium text-gray-800">{t.fullName}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </DialogPanel>
      </div>
    </Dialog>
  );
}
