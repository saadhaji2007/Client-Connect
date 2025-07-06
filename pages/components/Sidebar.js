import { FaUser, FaChartLine, FaFileInvoice } from "react-icons/fa";

export default function Sidebar() {
  return (
    <div className="w-64 bg-white shadow-lg p-4 hidden md:block">
      <h2 className="text-xl font-bold mb-6">ClientConnect</h2>
      <ul className="space-y-4">
        <li className="flex items-center gap-2 text-blue-600 font-semibold">
          <FaChartLine /> Dashboard
        </li>
        <li className="flex items-center gap-2 text-gray-600 hover:text-blue-600 cursor-pointer">
          <FaUser /> Clients
        </li>
        <li className="flex items-center gap-2 text-gray-600 hover:text-blue-600 cursor-pointer">
          <FaFileInvoice /> Invoices
        </li>
        <li>
          <a href="/stats" className="hover:text-blue-600">📈 Stats</a>
        </li>
      </ul>
    </div>
  );
}
