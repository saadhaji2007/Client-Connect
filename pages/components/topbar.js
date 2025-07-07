import { useEffect, useState } from "react";
import { auth } from "../../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/router";

export default function Topbar() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <div className="bg-white rounded-xl p-4 mb-4 shadow">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          Welcome, {user?.email || "Guest"} 👋
        </h2>

        {user ? (
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-3 py-1 rounded"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => router.push("/login")}
            className="bg-blue-600 text-white px-3 py-1 rounded"
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
}

