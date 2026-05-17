import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { HeartPulse, CheckCircle } from "lucide-react";

export default async function StudentsHealthPage() {
  const session = await auth();
  const teacherId = (session?.user as any)?.id;

  const results = await prisma.mentalHealthResult.findMany({

    include: {
      student: true
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Students Health</h1>
          <p className="text-gray-500 mt-1">Review mental health test results from your assigned students.</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
              <HeartPulse className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Recent Test Submissions</h2>
          </div>
          <span className="bg-indigo-100 text-indigo-700 py-1 px-3 rounded-full text-xs font-bold uppercase tracking-widest">
            {results.length} Total
          </span>
        </div>

        {results.length === 0 ? (
          <div className="p-12 text-center">
            <HeartPulse className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No students have submitted the health test yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white">
                  <th className="py-4 px-8 text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Student</th>
                  <th className="py-4 px-8 text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Date</th>
                  <th className="py-4 px-8 text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Total Score</th>
                  <th className="py-4 px-8 text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {results.map((result) => {
                  let answersObj = {};
                  try {
                    answersObj = JSON.parse(result.answers);
                  } catch(e) {}
                  
                  return (
                    <tr key={result.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-5 px-8">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: result.student.avatarColor || "#7c3aed" }}>
                            {result.student.fullName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{result.student.fullName}</p>
                            <p className="text-xs text-gray-400">{result.student.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-8">
                        <p className="text-sm font-medium text-gray-600">
                          {new Date(result.createdAt).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="py-5 px-8">
                        <div className="flex items-center space-x-2">
                          <span className={`text-lg font-black ${result.score < 40 ? 'text-amber-600' : 'text-green-600'}`}>
                            {result.score}
                          </span>
                        </div>
                      </td>
                      <td className="py-5 px-8">
                        <details className="group">
                          <summary className="cursor-pointer text-sm font-bold text-indigo-600 hover:text-indigo-700 list-none flex items-center">
                            View Answers
                          </summary>
                          <div className="mt-4 p-4 bg-gray-50 rounded-xl max-w-sm text-sm text-gray-600 max-h-60 overflow-y-auto">
                            {Object.entries(answersObj).map(([qIndex, answer]) => (
                              <div key={qIndex} className="mb-2 border-b border-gray-100 pb-2 last:border-0">
                                <span className="font-bold text-gray-800">Q{parseInt(qIndex) + 1}: </span> 
                                Score {answer as React.ReactNode}
                              </div>
                            ))}
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
