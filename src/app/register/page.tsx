"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { GraduationCap, BookOpen, ShieldCheck, User, Mail, Lock, UserCircle, Loader2, ArrowRight } from "lucide-react";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("role") === "TEACHER" ? "TEACHER" : "STUDENT";

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    role: initialRole,
    passkey: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "فشل التسجيل");
      }

      router.push("/login?registered=true");
    } catch (err: any) {
      setError(err.message === "Registration failed" ? "فشل إنشاء الحساب. يرجى التحقق من البيانات المحخلة." : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2" dir="rtl">
      {/* Visual Side */}
      <div className={`hidden md:flex flex-col justify-center items-center p-12 text-white transition-colors duration-500 ${
        formData.role === "TEACHER" ? "bg-gray-900" : "bg-indigo-600"
      }`}>
        <div className="max-w-md text-center">
          {formData.role === "TEACHER" ? (
            <>
              <ShieldCheck className="w-24 h-24 mb-8 mx-auto animate-pulse text-indigo-400" />
              <h2 className="text-4xl font-bold mb-4">تمكين العقول الشابة</h2>
              <p className="text-xl text-gray-400">انضم إلى مجتمعنا من الأخصائيين النفسيين وساهم في بناء مستقبل التلاميذ.</p>
            </>
          ) : (
            <>
              <GraduationCap className="w-24 h-24 mb-8 mx-auto animate-bounce text-yellow-300" />
              <h2 className="text-4xl font-bold mb-4">ابدأ مغامرتك اليوم</h2>
              <p className="text-xl text-indigo-100">اكتشف عالماً من الجلسات الإرشادية الممتعة والأنشطة الرائعة!</p>
            </>
          )}
        </div>
      </div>

      {/* Form Side */}
      <div className="flex flex-col justify-center items-center p-8 bg-white">
        <div className="w-full max-w-md">
          <Link href="/" className="inline-flex items-center text-indigo-600 font-bold mb-8 hover:underline">
            <ArrowRight className="ml-2 w-5 h-5" /> العودة للرئيسية
          </Link>
          <h1 className="text-3xl font-black mb-2 text-gray-900">إنشاء حساب جديد</h1>
          <p className="text-gray-500 mb-8 font-medium">انضم إلى أفضل منصة إرشادية وتوجيهية للتلاميذ!</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Toggle */}
            <div className="flex p-1 bg-gray-100 rounded-2xl mb-6">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: "STUDENT" })}
                className={`flex-1 py-3 rounded-xl font-bold transition-all flex items-center justify-center ${
                  formData.role === "STUDENT" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-800"
                }`}
              >
                <BookOpen className="w-4 h-4 ml-2" />
                تلميذ
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: "TEACHER" })}
                className={`flex-1 py-3 rounded-xl font-bold transition-all flex items-center justify-center ${
                  formData.role === "TEACHER" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-800"
                }`}
              >
                <ShieldCheck className="w-4 h-4 ml-2" />
                أخصائي نفسي
              </button>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border-r-4 border-red-500 text-red-700 font-medium rounded-xl text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="relative">
                <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="الاسم الكامل"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full pr-12 pl-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium text-right"
                />
              </div>

              <div className="relative">
                <UserCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="اسم المستخدم"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full pr-12 pl-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium text-right"
                />
              </div>

              <div className="relative">
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="البريد الإلكتروني"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pr-12 pl-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium text-right"
                />
              </div>

              <div className="relative">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  placeholder="كلمة المرور"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pr-12 pl-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium text-right"
                />
              </div>

              {formData.role === "TEACHER" && (
                <div className="relative animate-in slide-in-from-top-4 duration-300">
                  <ShieldCheck className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-600" />
                  <input
                    type="password"
                    placeholder="رمز التحقق للأخصائي النفسي"
                    required
                    value={formData.passkey}
                    onChange={(e) => setFormData({ ...formData, passkey: e.target.value })}
                    className="w-full pr-12 pl-4 py-4 bg-indigo-50 border border-indigo-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium text-right"
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all transform active:scale-95 flex items-center justify-center ${
                loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200"
              }`}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin ml-2" /> : null}
              {loading ? "جاري إنشاء الحساب..." : "انضم الآن!"}
            </button>
          </form>

          <p className="mt-8 text-center text-gray-500 font-medium">
            لديك حساب بالفعل؟{" "}
            <Link href="/login" className="text-indigo-600 font-bold hover:underline">
              تسجيل الدخول
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center bg-indigo-600 text-white" dir="rtl">
        <Loader2 className="w-12 h-12 animate-spin mb-4 text-white" />
        <p className="text-xl font-bold">جاري تحضير صفحة التسجيل...</p>
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
