// import { FaUser, FaChartLine, FaFileInvoice } from "react-icons/fa";

// export default function Sidebar() {
//   return (
//     <div className="w-64 bg-white shadow-lg p-4 hidden md:block">
//       <h2 className="text-xl font-bold mb-6">ClientConnect</h2>
//       <ul className="space-y-4">
//         <li className="flex items-center gap-2 text-blue-600 font-semibold">
//           <FaChartLine /> Dashboard
//         </li>
//         <li className="flex items-center gap-2 text-gray-600 hover:text-blue-600 cursor-pointer">
//           <FaUser /> Clients
//         </li>
//         <li className="flex items-center gap-2 text-gray-600 hover:text-blue-600 cursor-pointer">
//           <FaFileInvoice /> Invoices
//         </li>
//         <li>
//           <a href="/stats" className="hover:text-blue-600">📈 Stats</a>
//         </li>
//       </ul>
//     </div>
//   );
// }

// import Link from "next/link";

// export default function Sidebar() {
//   return (
//     <div className="w-64 bg-white shadow-lg min-h-screen p-4">
//       <h1 className="text-2xl font-bold mb-6 text-blue-700">Client Connect</h1>
//       <nav className="space-y-3">
//         <Link href="/dashboard" className="block text-gray-700 hover:text-blue-600">
//           📊 Dashboard
//         </Link>
//         <Link href="/clients" className="block text-gray-700 hover:text-blue-600">
//           👥 Clients
//         </Link>
//         <Link href="/stats" className="block text-gray-700 hover:text-blue-600">
//           📈 Stats
//         </Link>
//       </nav>
//     </div>
//   );
// }

// import Link from "next/link";
// import { useRouter } from "next/router";

// export default function Sidebar() {
//   const router = useRouter();

//   const navItems = [
//     { label: "📊 Dashboard", href: "/dashboard" },
//     { label: "👥 Clients", href: "/clients" },
//     { label: "📈 Stats", href: "/stats" },
//   ];

//   return (
//     <div className="w-64 bg-white shadow-lg min-h-screen p-4">
//       <h1 className="text-2xl font-bold mb-6 text-blue-700">Client Connect</h1>
//       <nav className="space-y-3">
//         {navItems.map((item) => (
//           <Link
//             key={item.href}
//             href={item.href}
//             className={`block hover:text-blue-600 ${
//               router.pathname === item.href ? "text-blue-700 font-semibold" : "text-gray-700"
//             }`}
//           >
//             {item.label}
//           </Link>
//         ))}
//       </nav>
//     </div>
//   );
// }

// components/Sidebar.js
import Link from "next/link";
import { LayoutDashboard, Users, BarChart2 } from "lucide-react";

export default function Sidebar() {
  return (
    <div className="w-64 bg-white shadow-xl min-h-screen p-5 flex flex-col justify-between border-r">
      <div>
        <h1 className="text-3xl font-bold text-blue-700 mb-8">ClientConnect</h1>
        <nav className="space-y-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 text-gray-700 hover:text-blue-600 font-medium transition-colors"
          >
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <Link
            href="/clients"
            className="flex items-center gap-3 text-gray-700 hover:text-blue-600 font-medium transition-colors"
          >
            <Users size={20} />
            Clients
          </Link>
          <Link
            href="/stats"
            className="flex items-center gap-3 text-gray-700 hover:text-blue-600 font-medium transition-colors"
          >
            <BarChart2 size={20} />
            Stats
          </Link>
          <Link href="/about" className="block text-gray-700 hover:text-blue-600">
          ℹ️ About Us
         </Link>

        </nav>
      </div>

      <div className="text-sm text-gray-400 mt-10">
        © {new Date().getFullYear()} ClientConnect
      </div>
    </div>
  );
}

