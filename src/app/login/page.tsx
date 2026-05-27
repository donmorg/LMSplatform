"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, UserCircle, LogIn, Loader2 } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        username: formData.username,
        password: formData.password,
        redirect: false,
      });

      if (res?.error) {
        setError("اسم المستخدم أو كلمة المرور غير صحيحة");
        return;
      }

      router.push("/dashboard");
    } catch (err: any) {
      setError("حدث خطأ غير متوقع. يرجى المحاولة مجدداً.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-xl shadow-gray-200" dir="rtl">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl mb-4">
          <LogIn className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">مرحباً بعودتك!</h1>
        <p className="text-gray-500 mt-2">سجّل دخولك لمتابعة رحلتك الإرشادية.</p>
      </div>

      {registered && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 font-medium rounded-xl border border-green-100 text-center">
          تم التسجيل بنجاح! يمكنك تسجيل الدخول الآن.
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 font-medium rounded-xl border border-red-100 text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <UserCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="اسم المستخدم"
            required
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className="w-full pr-12 pl-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium text-right"
            dir="rtl"
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
            dir="rtl"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all transform active:scale-95 flex items-center justify-center ${
            loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200"
          }`}
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin ml-2" /> : null}
          {loading ? "جاري الدخول..." : "تسجيل الدخول"}
        </button>
      </form>

      <p className="mt-10 text-center text-gray-500">
        ليس لديك حساب؟{" "}
        <Link href="/register" className="text-indigo-600 font-bold hover:underline">
          إنشاء حساب جديد
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6" dir="rtl">
      <Suspense fallback={
        <div className="w-full max-w-md bg-white p-20 rounded-3xl shadow-xl flex flex-col items-center justify-center">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
          <p className="text-gray-500 font-bold">جاري التحميل...</p>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}
