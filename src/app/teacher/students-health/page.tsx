import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { HeartPulse, CheckCircle } from "lucide-react";

export default async function StudentsHealthPage() {
  const session = await auth();
  const teacherId = (session?.user as any)?.id;

  const rawResults = await prisma.mentalHealthResult.findMany({
    include: {
      student: true
    },
    orderBy: { createdAt: "asc" }
  });

  const groupedResults = new Map();
  rawResults.forEach(r => {
    if (!groupedResults.has(r.studentId)) {
      groupedResults.set(r.studentId, {
        student: r.student,
        attempts: []
      });
    }
    groupedResults.get(r.studentId).attempts.push(r);
  });
  const studentsHealth = Array.from(groupedResults.values());

  return (
    <div className="max-w-7xl mx-auto space-y-10" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">صحة التلاميذ</h1>
          <p className="text-gray-500 mt-1">مراجعة نتائج مقياس الصحة النفسية للتلاميذ التابعين لك.</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
              <HeartPulse className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">تقديمات الاختبار الأخيرة</h2>
          </div>
          <span className="bg-indigo-100 text-indigo-700 py-1 px-3 rounded-full text-xs font-bold uppercase tracking-widest">
            الإجمالي {studentsHealth.length}
          </span>
        </div>

        {studentsHealth.length === 0 ? (
          <div className="p-12 text-center">
            <HeartPulse className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">لم يقم أي تلميذ بتقديم اختبار الصحة النفسية بعد.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-white">
                  <th className="py-4 px-8 text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 text-right">التلميذ</th>
                  <th className="py-4 px-8 text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 text-right">التاريخ</th>
                  <th className="py-4 px-8 text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 text-right">الدرجة الإجمالية</th>
                  <th className="py-4 px-8 text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 text-right">الدرجة الإجمالية2</th>
                  <th className="py-4 px-8 text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 text-right">مقارنة</th>
                  <th className="py-4 px-8 text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 text-left">التفاصيل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {studentsHealth.map(({ student, attempts }) => {
                  const attempt1 = attempts[0];
                  const attempt2 = attempts.length > 1 ? attempts[1] : null;
                  const maxScore = 74;

                  let answersObj1 = {};
                  try {
                    answersObj1 = JSON.parse(attempt1.answers);
                  } catch(e) {}

                  let answersObj2 = {};
                  if (attempt2) {
                    try {
                      answersObj2 = JSON.parse(attempt2.answers);
                    } catch(e) {}
                  }
                  
                  return (
                    <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-5 px-8">
                        <div className="flex items-center space-x-3 space-x-reverse">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: student.avatarColor || "#7c3aed" }}>
                            {student.fullName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{student.fullName}</p>
                            <p className="text-xs text-gray-400">{student.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-8">
                        <p className="text-sm font-medium text-gray-600">
                          {new Date(attempt1.createdAt).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="py-5 px-8">
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <span className={`text-lg font-black ${attempt1.score < 40 ? 'text-amber-600' : 'text-green-600'}`}>
                            {attempt1.score}
                          </span>
                        </div>
                      </td>
                      <td className="py-5 px-8">
                        {attempt2 ? (
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <span className={`text-lg font-black ${attempt2.score < 40 ? 'text-amber-600' : 'text-green-600'}`}>
                              {attempt2.score}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      <td className="py-5 px-8">
                        <div className="flex flex-col justify-center space-y-1.5 w-24">
                          <div className="w-full bg-gray-100 rounded-full h-2">
                            <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${Math.min((attempt1.score / maxScore) * 100, 100)}%` }}></div>
                          </div>
                          {attempt2 && (
                            <div className="w-full bg-gray-100 rounded-full h-2">
                              <div className="bg-pink-500 h-2 rounded-full" style={{ width: `${Math.min((attempt2.score / maxScore) * 100, 100)}%` }}></div>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-5 px-8 text-left">
                        <details className="group">
                          <summary className="cursor-pointer text-sm font-bold text-indigo-600 hover:text-indigo-700 list-none flex items-center justify-start">
                            عرض الإجابات
                          </summary>
                          <div className="mt-4 p-4 bg-gray-50 rounded-xl max-w-sm text-sm text-gray-600 max-h-60 overflow-y-auto text-right space-y-4">
                            <div>
                              <h4 className="font-bold text-indigo-600 mb-2">المحاولة الأولى</h4>
                              {Object.entries(answersObj1).map(([qIndex, answer]) => (
                                <div key={qIndex} className="mb-2 border-b border-gray-100 pb-2 last:border-0">
                                  <span className="font-bold text-gray-800">س{parseInt(qIndex) + 1}: </span> 
                                  الدرجة {answer as React.ReactNode}
                                </div>
                              ))}
                            </div>
                            {attempt2 && (
                              <div className="pt-2 border-t-2 border-indigo-100">
                                <h4 className="font-bold text-pink-600 mb-2">المحاولة الثانية</h4>
                                {Object.entries(answersObj2).map(([qIndex, answer]) => (
                                  <div key={qIndex} className="mb-2 border-b border-gray-100 pb-2 last:border-0">
                                    <span className="font-bold text-gray-800">س{parseInt(qIndex) + 1}: </span> 
                                    الدرجة {answer as React.ReactNode}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </details>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
