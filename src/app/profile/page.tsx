"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { User, Mail, Shield, Camera, Save, Loader2, ArrowLeft, Key } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
  });

  useEffect(() => {
    if (session?.user) {
      setFormData({
        fullName: session.user.name || "",
        email: session.user.email || "",
        username: (session.user as any).username || "",
      });
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to update profile");

      await update({
        ...session,
        user: {
          ...session?.user,
          name: formData.fullName,
          email: formData.email,
        }
      });

      setSuccess("Profile updated successfully! ✨");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const role = (session?.user as any)?.role || "STUDENT";
  const dashboardLink = role === "TEACHER" ? "/teacher/dashboard" : "/student/dashboard";

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Link href={dashboardLink} className="inline-flex items-center text-gray-500 hover:text-indigo-600 font-bold transition-colors">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Dashboard
      </Link>

      <div className="flex flex-col md:flex-row items-center gap-10">
        <div className="relative group">
          <div 
            className="w-32 h-32 rounded-[3rem] flex items-center justify-center text-white text-5xl font-black shadow-2xl shadow-indigo-200 group-hover:scale-105 transition-transform duration-500"
            style={{ backgroundColor: (session?.user as any)?.avatarColor || "#7c3aed" }}
          >
            {session?.user?.name?.charAt(0) || "U"}
          </div>
          <button className="absolute bottom-0 right-0 p-3 bg-white rounded-2xl shadow-lg border border-gray-100 text-indigo-600 hover:bg-indigo-50 transition-all">
            <Camera className="w-5 h-5" />
          </button>
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-black text-gray-900 mb-2">Profile Settings</h1>
          <p className="text-gray-500 font-medium">Manage your personal information and account security.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-indigo-500/5 space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center">
                  <User className="w-3 h-3 mr-2" /> Full Name
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold"
                />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center">
                  <Shield className="w-3 h-3 mr-2" /> Username
                </label>
                <input
                  type="text"
                  disabled
                  value={formData.username}
                  className="w-full px-6 py-4 bg-gray-100 border border-gray-100 rounded-2xl text-gray-400 font-bold cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center">
                <Mail className="w-3 h-3 mr-2" /> Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold"
              />
            </div>

            {error && <p className="text-red-500 text-sm font-bold text-center">{error}</p>}
            {success && <p className="text-green-500 text-sm font-bold text-center">{success}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6 mr-3" />}
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>

        <div className="space-y-8">
          <div className="bg-gray-900 p-8 rounded-[2.5rem] text-white">
            <h3 className="text-lg font-bold mb-6 flex items-center">
              <Key className="w-5 h-5 mr-3 text-indigo-400" />
              Security
            </h3>
            <p className="text-sm text-gray-400 mb-8 leading-relaxed">
              Keep your account safe by updating your password regularly.
            </p>
            <button className="w-full py-4 bg-gray-800 hover:bg-gray-700 rounded-2xl font-bold transition-all text-sm">
              Change Password
            </button>
          </div>

          <div className="bg-indigo-50 p-8 rounded-[2.5rem] border border-indigo-100">
            <h3 className="text-lg font-black text-indigo-900 mb-2">Account Type</h3>
            <span className="inline-block px-3 py-1 bg-indigo-600 text-white text-[10px] font-black rounded-lg uppercase tracking-widest mb-4">
              {role}
            </span>
            <p className="text-indigo-700 text-xs leading-relaxed">
              {role === "TEACHER" 
                ? "You have full access to manage lessons, quizzes, and student analytics." 
                : "You have access to all lessons and quizzes assigned to your account."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
