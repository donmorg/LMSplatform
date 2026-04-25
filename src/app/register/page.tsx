"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { GraduationCap, BookOpen, ShieldCheck, User, Mail, Lock, UserCircle, Loader2 } from "lucide-react";

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
        throw new Error(data.error || "Registration failed");
      }

      router.push("/login?registered=true");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Visual Side */}
      <div className={`hidden md:flex flex-col justify-center items-center p-12 text-white transition-colors duration-500 ${
        formData.role === "TEACHER" ? "bg-gray-900" : "bg-indigo-600"
      }`}>
        <div className="max-w-md text-center">
          {formData.role === "TEACHER" ? (
            <>
              <ShieldCheck className="w-24 h-24 mb-8 mx-auto animate-pulse" />
              <h2 className="text-4xl font-bold mb-4">Empower Young Minds</h2>
              <p className="text-xl text-gray-400">Join our community of educators and shape the future of learning.</p>
            </>
          ) : (
            <>
              <GraduationCap className="w-24 h-24 mb-8 mx-auto animate-bounce" />
              <h2 className="text-4xl font-bold mb-4">Start Your Adventure</h2>
              <p className="text-xl text-indigo-100">Unlock a world of fun lessons and earn awesome stars!</p>
            </>
          )}
        </div>
      </div>

      {/* Form Side */}
      <div className="flex flex-col justify-center items-center p-8 bg-white">
        <div className="w-full max-w-md">
          <Link href="/" className="inline-flex items-center text-indigo-600 font-bold mb-8 hover:underline">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-gray-500 mb-8">Join the best educational platform for kids!</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Toggle */}
            <div className="flex p-1 bg-gray-100 rounded-2xl mb-6">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: "STUDENT" })}
                className={`flex-1 py-3 rounded-xl font-bold transition-all flex items-center justify-center ${
                  formData.role === "STUDENT" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500"
                }`}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Student
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: "TEACHER" })}
                className={`flex-1 py-3 rounded-xl font-bold transition-all flex items-center justify-center ${
                  formData.role === "TEACHER" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
                }`}
              >
                <ShieldCheck className="w-4 h-4 mr-2" />
                Teacher
              </button>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 font-medium rounded-r-lg">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>

              <div className="relative">
                <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Username"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  placeholder="Password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>

              {formData.role === "TEACHER" && (
                <div className="relative animate-in slide-in-from-top-4 duration-300">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-600" />
                  <input
                    type="password"
                    placeholder="Teacher Passkey"
                    required
                    value={formData.passkey}
                    onChange={(e) => setFormData({ ...formData, passkey: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 bg-indigo-50 border border-indigo-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
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
              {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
              {loading ? "Creating Account..." : "Join Now!"}
            </button>
          </form>

          <p className="mt-8 text-center text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="text-indigo-600 font-bold hover:underline">
              Log In
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-indigo-600 text-white">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <p className="text-xl font-bold">Preparing your adventure...</p>
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
