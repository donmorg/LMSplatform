import Link from "next/link";
import { BookOpen, Users, Star, ArrowLeft } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-white" dir="rtl">
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden bg-gradient-to-b from-indigo-50 to-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 font-medium text-sm mb-8 animate-bounce">
            <Star className="w-4 h-4 ml-2 fill-current" />
            التعلم أصبح بسيطاً وممتعاً!
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight leading-tight">
            منصة <span className="text-indigo-600">أثر</span> للدعم النفسي
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            منصة متكاملة مصممة لدعم الأطفال والتلاميذ نفسياً من خلال جلسات إرشادية واختبارات نفسية تفاعلية.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all transform hover:scale-105 shadow-xl shadow-indigo-200 flex items-center"
            >
              ابدأ مجاناً
              <ArrowLeft className="mr-2 w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 bg-white text-gray-700 border-2 border-gray-100 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all"
            >
              تسجيل الدخول
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="p-10 rounded-3xl bg-indigo-600 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
              <BookOpen className="w-48 h-48" />
            </div>
            <h2 className="text-3xl font-bold mb-4">للتلاميذ 🎒</h2>
            <p className="text-indigo-100 text-lg mb-8">
              استكشف الجلسات الإرشادية، وأكمل الاختبارات النفسية، وتطور مع كل خطوة!
            </p>
            <ul className="space-y-3 mb-10">
              <li className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center ml-3">✓</div>
                جلسات إرشادية تفاعلية
              </li>
              <li className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center ml-3">✓</div>
                اختبارات نفسية مخصصة
              </li>
              <li className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center ml-3">✓</div>
                تتبع تقدمك الشخصي
              </li>
            </ul>
            <Link href="/register?role=STUDENT" className="inline-block py-3 px-6 bg-white text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-colors">
              أنا تلميذ
            </Link>
          </div>

          <div className="p-10 rounded-3xl bg-gray-900 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
              <Users className="w-48 h-48" />
            </div>
            <h2 className="text-3xl font-bold mb-4">للأخصائيين النفسيين 📋</h2>
            <p className="text-gray-400 text-lg mb-8">
              أدِر تلاميذك، أضف جلسات إرشادية، وتتبع نتائج الاختبارات النفسية بسهولة.
            </p>
            <ul className="space-y-3 mb-10">
              <li className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center ml-3">✓</div>
                رفع ملفات PDF ومقاطع الفيديو
              </li>
              <li className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center ml-3">✓</div>
                بناء اختبارات نفسية مخصصة
              </li>
              <li className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center ml-3">✓</div>
                تقارير وتحليلات تفصيلية
              </li>
            </ul>
            <Link href="/register?role=TEACHER" className="inline-block py-3 px-6 bg-indigo-500 text-white rounded-xl font-bold hover:bg-indigo-600 transition-colors">
              أنا أخصائي نفسي
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
