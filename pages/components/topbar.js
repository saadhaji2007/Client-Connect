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

// // components/Topbar.js
// import { Bell, UserCircle2 } from "lucide-react";

// export default function Topbar() {
//   return (
//     <div className="flex justify-between items-center bg-white p-4 shadow-md rounded-xl mb-4">
//       <h2 className="text-xl font-semibold text-gray-800">Welcome Back 👋</h2>

//       <div className="flex items-center gap-4">
//         <button className="text-gray-600 hover:text-blue-600 transition-colors">
//           <Bell size={22} />
//         </button>
//         <div className="flex items-center gap-2">
//           <UserCircle2 size={26} className="text-gray-600" />
//           <span className="text-gray-700 font-medium">Saad</span>
//         </div>
//       </div>
//     </div>
//   );
// }
