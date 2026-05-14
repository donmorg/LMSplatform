"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { User, Lock, Upload, Save, CheckCircle } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function StudentProfilePage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const { t, dir } = useLanguage();

  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [teachers, setTeachers] = useState<any[]>([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    // Fetch teachers (Psychologists)
    fetch("/api/student/teacher")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setTeachers(data);
      });

    // Fetch user profile data
    fetch("/api/student/profile")
      .then((res) => res.json())
      .then((data) => {
        setUsername(data.username || "");
        setFullName(data.fullName || "");
        setSelectedTeacherId(data.assignedTeacherId || "");
        setAvatarPreview(data.avatarUrl || null);
        setLoading(false);
      });
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ text: "", type: "" });
    try {
      const res = await fetch("/api/student/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          fullName,
          password: password ? password : undefined,
          assignedTeacherId: selectedTeacherId,
          avatarUrl: avatarPreview,
        }),
      });

      if (res.ok) {
        setMessage({ text: "Profile updated successfully!", type: "success" });
        await update({ assignedTeacherId: selectedTeacherId, avatarUrl: avatarPreview, name: fullName });
        setPassword(""); // clear password field
      } else {
        const error = await res.json();
        setMessage({ text: error.message || "Failed to update profile", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "An error occurred", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto py-10 space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-black text-gray-900">Your Profile</h1>
        <p className="text-gray-500 mt-1">Manage your account settings and preferences.</p>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl font-bold flex items-center ${message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
          {message.type === 'success' && <CheckCircle className="w-5 h-5 mr-2" />}
          {message.text}
        </div>
      )}

      <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
        {/* Avatar Section */}
        <div className="flex items-center space-x-6 rtl:space-x-reverse">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gray-100 overflow-hidden border-4 border-white shadow-lg flex items-center justify-center">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-gray-400" />
              )}
            </div>
            <label className="absolute bottom-0 right-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-indigo-700 transition-colors">
              <Upload className="w-4 h-4" />
              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
            </label>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Profile Picture</h3>
            <p className="text-sm text-gray-500">Upload a new avatar (JPEG, PNG).</p>
          </div>
        </div>

        <div className="space-y-6 pt-6 border-t border-gray-50">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">New Password (leave blank to keep current)</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
            />
          </div>

          {/* Teacher Selection */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Assigned Psychologist (اخصاىي نفسي)</label>
            <select
              value={selectedTeacherId}
              onChange={(e) => setSelectedTeacherId(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all appearance-none"
            >
              <option value="">-- Select a Psychologist --</option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.fullName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-50">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-lg shadow-indigo-200 disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            <span>{saving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
