import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/router";
import { LogOut, User, Bell } from "lucide-react";

export default function Topbar() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const getDisplayName = () => {
    if (!user) return "Guest";
    return user.displayName || user.email?.split("@")[0] || "User";
  };

  if (loading) {
    return (
      <header className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
        <div className="animate-pulse flex justify-between items-center">
          <div className="h-6 bg-slate-200 rounded w-48"></div>
          <div className="h-8 bg-slate-200 rounded w-20"></div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
      <div className="flex justify-between items-center">
        {/* Welcome Message */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              Welcome back, {getDisplayName()}
            </h2>
            <p className="text-sm text-slate-500">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
            <Bell size={18} />
          </button>

          {/* Auth Button */}
          {user ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              <LogOut size={16} />
              Logout
            </button>
          ) : (
            <button
              onClick={() => router.push("/login")}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              <User size={16} />
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
}