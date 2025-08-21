import Link from "next/link";
import { useRouter } from "next/router";
import { LayoutDashboard, Users, BarChart2, Info, Home } from "lucide-react";

export default function Sidebar() {
  const router = useRouter();
  
  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/clients", icon: Users, label: "Clients" },
    { href: "/stats", icon: BarChart2, label: "Statistics" },
    { href: "/about", icon: Info, label: "About Us" }
  ];

  return (
    <aside className="w-64 bg-gradient-to-b from-slate-50 to-white shadow-lg min-h-screen border-r border-slate-200">
      <div className="p-6 flex flex-col h-full">
        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ClientConnect
          </h1>
          <p className="text-xs text-slate-500 mt-1">Client Management Hub</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = router.pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200 group ${
                  isActive
                    ? "bg-blue-50 text-blue-700 shadow-sm border border-blue-100"
                    : "text-slate-600 hover:text-blue-600 hover:bg-slate-50"
                }`}
              >
                <Icon 
                  size={18} 
                  className={`transition-colors ${
                    isActive ? "text-blue-600" : "group-hover:text-blue-500"
                  }`}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>
             {/* Footer */}
        <div className="pt-4 border-t border-slate-200">
          <p className="text-xs text-slate-400 text-center">
            © {new Date().getFullYear()} ClientConnect
          </p>
        </div>
      </div>
    </aside>
  );
}